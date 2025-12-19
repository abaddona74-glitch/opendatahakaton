import { PrismaClient, UtilityType } from '@prisma/client';
import { faker } from '@faker-js/faker';
// simple account generator (used here inline to avoid ESM import resolution issues)
function generateAccount(regionCode: string) {
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `${regionCode}-${String(seq).padStart(6, '0')}`;
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const regionNames = ['Uchtepa', 'Chilonzor', 'Yunusobod', 'Mirzo Ulugbek', 'Yakkasaroy'];
  for (let r = 0; r < regionNames.length; r++) {
    const code = String(12345 + r); // 12345, 12346...
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [69.1 + r * 0.01, 41.2 + r * 0.01],
          [69.11 + r * 0.01, 41.2 + r * 0.01],
          [69.11 + r * 0.01, 41.21 + r * 0.01],
          [69.1 + r * 0.01, 41.21 + r * 0.01],
          [69.1 + r * 0.01, 41.2 + r * 0.01]
        ]
      ]
    };

    const region = await prisma.region.upsert({
      where: { code },
      update: { name: regionNames[r], polygon },
      create: { name: regionNames[r], code, polygon },
    });

    // create 5 districts for the region
    const districts = [] as any[];
    for (let d = 0; d < 5; d++) {
      const district = await prisma.district.create({ data: { name: `${regionNames[r]} District ${d + 1}`, regionId: region.id } });
      districts.push(district);
    }

    // create 10 streets
    for (let s = 0; s < 10; s++) {
      const districtForStreet = districts[Math.floor(s / 2)];
      const street = await prisma.street.create({
        data: {
          name: `${faker.location.street()} #${s + 1}`,
          districtId: districtForStreet.id,
        }
      });

      // create 50 houses per street
      for (let h = 0; h < 50; h++) {
        const house = await prisma.house.create({
          data: {
            number: String(h + 1),
            streetId: street.id,
            location: {
              lat: 41.2 + r * 0.01 + Math.random() * 0.005,
              lng: 69.1 + r * 0.01 + Math.random() * 0.005,
            }
          }
        });

        // 1-3 residents
        const residentCount = Math.floor(Math.random() * 3) + 1;
        for (let rr = 0; rr < residentCount; rr++) {
          const resident = await prisma.resident.create({
            data: {
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              middleName: Math.random() > 0.5 ? faker.person.middleName() : null,
              houseId: house.id,
            }
          });

          // create 1-3 accounts per resident
          const accCount = Math.floor(Math.random() * 3) + 1;
          for (let a = 0; a < accCount; a++) {
            const typeOptions: UtilityType[] = [UtilityType.ELECTRIC, UtilityType.GAS, UtilityType.WATER];
            const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
            // generate accountNo and ensure unique with retries
            let accountNo = generateAccount(region.code);
            let created = null;
            for (let attempt = 0; attempt < 5; attempt++) {
              try {
                created = await prisma.utilityAccount.create({
                  data: {
                    accountNo,
                    type,
                    balance: 0,
                    residentId: resident.id,
                    regionId: region.id,
                  }
                });
                break;
              } catch (err) {
                accountNo = generateAccount(region.code);
                continue;
              }
            }
            if (!created) {
              console.warn('Failed to create account for', resident.id);
            }
          }
        }
      }
    }
  }

  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

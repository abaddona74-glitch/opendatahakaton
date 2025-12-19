import { NextResponse } from 'next/server';
import { PrismaClient, UtilityType } from '@prisma/client';
import generateAccount from '../../../lib/generateAccount';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const regionId = url.searchParams.get('regionId');
  const type = url.searchParams.get('type');

  const where: any = {};
  if (regionId) where.regionId = Number(regionId);
  if (type) where.type = type as UtilityType;

  const accounts = await prisma.utilityAccount.findMany({ where });
  return NextResponse.json({ accounts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { residentId, regionId, type } = body;
  if (!residentId || !regionId || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // create account with retries to avoid unique conflict
  for (let attempt = 0; attempt < 5; attempt++) {
    const region = await prisma.region.findUnique({ where: { id: Number(regionId) } });
    if (!region) return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    const accountNo = generateAccount(region.code);
    try {
      const account = await prisma.utilityAccount.create({
        data: {
          accountNo,
          type: type as UtilityType,
          balance: 0,
          residentId: Number(residentId),
          regionId: Number(regionId),
        }
      });
      return NextResponse.json({ account });
    } catch (err) {
      continue; // retry on conflict
    }
  }

  return NextResponse.json({ error: 'Unable to generate unique account' }, { status: 500 });
}

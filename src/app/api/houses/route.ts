import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const streetId = url.searchParams.get('streetId');
  const regionId = url.searchParams.get('regionId');

  const where: any = {};
  if (streetId) where.streetId = Number(streetId);

  let houses;
  if (regionId) {
    houses = await prisma.house.findMany({
      where: { street: { district: { regionId: Number(regionId) } } },
    });
  } else {
    houses = await prisma.house.findMany({ where });
  }

  return NextResponse.json({ houses });
}

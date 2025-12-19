import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const houseId = url.searchParams.get('houseId');
  if (!houseId) return NextResponse.json({ error: 'houseId required' }, { status: 400 });
  const residents = await prisma.resident.findMany({ where: { houseId: Number(houseId) }, include: { accounts: true } });
  return NextResponse.json({ residents });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, middleName, houseId } = body;
  if (!firstName || !lastName || !houseId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const resident = await prisma.resident.create({ data: { firstName, lastName, middleName: middleName || null, houseId } });
  return NextResponse.json({ resident });
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const regions = await prisma.region.findMany({ include: { districts: true } });
  return NextResponse.json({ regions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, code, polygon } = body;
  if (!name || !code || !polygon) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const region = await prisma.region.create({ data: { name, code, polygon } });
  return NextResponse.json({ region });
}

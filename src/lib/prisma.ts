import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getUsers() {
  return prisma.user.findMany();
}

export async function createUser(name: string, email: string) {
  return prisma.user.create({ data: { name, email } });
}

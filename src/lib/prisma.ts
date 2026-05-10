import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function makePrismaClient() {
  // Prisma Postgres requires the prisma+postgres:// Accelerate URL for app queries.
  // The direct postgres:// URL (DATABASE_DIRECT_URL) is used only for CLI migrations.
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
  })
}

export const prisma = globalForPrisma.prisma ?? makePrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

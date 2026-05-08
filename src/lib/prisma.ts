import { PrismaClient } from "@/generated/prisma"
import { withAccelerate } from "@prisma/extension-accelerate"

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrismaClient> | undefined
}

function makePrismaClient() {
  return new PrismaClient().$extends(withAccelerate())
}

// Reuse the client in development to avoid exhausting connections on hot reload
export const prisma = globalForPrisma.prisma ?? makePrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

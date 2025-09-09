// Mock Prisma client for build time when network is unavailable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClient: any
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaClient = require('@prisma/client').PrismaClient
} catch {
  // Mock PrismaClient for build time
  PrismaClient = class MockPrismaClient {
    usageEvent = {
      create: async () => ({}),
      findMany: async () => [],
    }
    monthlyBudget = {
      findUnique: async () => null,
      upsert: async () => ({}),
      create: async () => ({}),
      update: async () => ({}),
    }
    alertLog = {
      findMany: async () => [],
      create: async () => ({}),
    }
    $disconnect = async () => {}
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
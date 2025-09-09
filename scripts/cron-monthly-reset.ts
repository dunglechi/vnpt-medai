// Mock Prisma client for build time when network is unavailable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClient: any
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PrismaClient = require('@prisma/client').PrismaClient
} catch {
  // Mock PrismaClient for build time
  PrismaClient = class MockPrismaClient {
    monthlyBudget = {
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
    }
    alertLog = {
      create: async () => ({}),
    }
    $disconnect = async () => {}
  }
}

const prisma = new PrismaClient()

async function monthlyBudgetReset() {
  try {
    console.log('Starting monthly budget reset...')
    
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    
    // Check if budget for current month already exists
    const existingBudget = await prisma.monthlyBudget.findUnique({
      where: {
        year_month: {
          year: currentYear,
          month: currentMonth,
        },
      },
    })
    
    if (existingBudget) {
      console.log(`Budget for ${currentYear}-${currentMonth} already exists`)
      return
    }
    
    // Get previous month's budget to copy settings
    let previousMonth = currentMonth - 1
    let previousYear = currentYear
    
    if (previousMonth === 0) {
      previousMonth = 12
      previousYear = currentYear - 1
    }
    
    const previousBudget = await prisma.monthlyBudget.findUnique({
      where: {
        year_month: {
          year: previousYear,
          month: previousMonth,
        },
      },
    })
    
    // Create new budget for current month
    const budgetLimit = previousBudget?.budgetLimitUsd || 100 // Default to $100
    
    const newBudget = await prisma.monthlyBudget.create({
      data: {
        year: currentYear,
        month: currentMonth,
        budgetLimitUsd: budgetLimit,
        currentUsageUsd: 0,
        isActive: true,
      },
    })
    
    console.log(`Created new budget for ${currentYear}-${currentMonth}:`, newBudget)
    
    // Deactivate previous month's budget
    if (previousBudget) {
      await prisma.monthlyBudget.update({
        where: {
          id: previousBudget.id,
        },
        data: {
          isActive: false,
        },
      })
      console.log(`Deactivated budget for ${previousYear}-${previousMonth}`)
    }
    
    // Check if budget reset should trigger any alerts
    const usagePercentage = (newBudget.currentUsageUsd / newBudget.budgetLimitUsd) * 100
    
    if (usagePercentage > 0) {
      await prisma.alertLog.create({
        data: {
          alertType: 'budget_reset',
          message: `Monthly budget reset for ${currentYear}-${String(currentMonth).padStart(2, '0')}. New budget limit: $${budgetLimit}`,
          metadata: {
            year: currentYear,
            month: currentMonth,
            budgetLimitUsd: budgetLimit,
          },
        },
      })
    }
    
    console.log('Monthly budget reset completed successfully')
    
  } catch (error) {
    console.error('Error during monthly budget reset:', error)
    
    // Log error as alert
    try {
      await prisma.alertLog.create({
        data: {
          alertType: 'system_error',
          message: `Failed to reset monthly budget: ${error instanceof Error ? error.message : String(error)}`,
          metadata: {
            error: error instanceof Error ? error.stack : String(error),
            timestamp: new Date().toISOString(),
          },
        },
      })
    } catch (logError) {
      console.error('Failed to log error alert:', logError)
    }
    
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Export for Vercel cron jobs
export { monthlyBudgetReset }

// Allow running as standalone script
if (require.main === module) {
  monthlyBudgetReset()
    .then(() => {
      console.log('Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}
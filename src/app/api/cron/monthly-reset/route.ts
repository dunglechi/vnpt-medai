import { NextRequest, NextResponse } from 'next/server'

// Import dynamically to handle when Prisma client is not available during build
async function getMonthlyBudgetReset() {
  try {
    const { monthlyBudgetReset } = await import('../../../../../scripts/cron-monthly-reset')
    return monthlyBudgetReset
  } catch (error) {
    console.error('Failed to import monthlyBudgetReset:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or has proper authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const monthlyBudgetReset = await getMonthlyBudgetReset()
    
    if (!monthlyBudgetReset) {
      return NextResponse.json(
        { error: 'Monthly budget reset function not available' },
        { status: 503 }
      )
    }
    
    await monthlyBudgetReset()
    
    return NextResponse.json({
      success: true,
      message: 'Monthly budget reset completed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        error: 'Monthly budget reset failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
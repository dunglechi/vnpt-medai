import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    const now = new Date()
    const year = yearParam ? parseInt(yearParam) : now.getFullYear()
    const month = monthParam ? parseInt(monthParam) : now.getMonth() + 1

    // TODO: Fetch from database when Prisma is properly configured
    const budget = {
      id: 'sample-budget',
      year,
      month,
      budgetLimitUsd: 100,
      currentUsageUsd: 23.45,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { year, month, budgetLimitUsd, currentUsageUsd } = body

    if (!year || !month) {
      return NextResponse.json(
        { error: 'Missing required fields: year, month' },
        { status: 400 }
      )
    }

    // TODO: Save to database when Prisma is properly configured
    const budget = {
      id: 'sample-budget',
      year: parseInt(year),
      month: parseInt(month),
      budgetLimitUsd: budgetLimitUsd ? parseFloat(budgetLimitUsd) : 100,
      currentUsageUsd: currentUsageUsd ? parseFloat(currentUsageUsd) : 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('Budget would be saved:', budget)

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // TODO: Fetch from database when Prisma is properly configured
    const alerts = [
      {
        id: 'alert-1',
        alertType: 'budget_warning',
        message: 'Monthly budget is 75% used. Current usage: $75.00 of $100.00',
        metadata: { budgetPercentage: 75 },
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: 'alert-2',
        alertType: 'high_usage',
        message: 'Unusual spike in API usage detected',
        metadata: { tokensUsed: 50000, timeWindow: '1 hour' },
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ].filter(alert => !unreadOnly || !alert.isRead).slice(0, limit)

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertType, message, metadata } = body

    if (!alertType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: alertType, message' },
        { status: 400 }
      )
    }

    // TODO: Save to database when Prisma is properly configured
    const alert = {
      id: 'temp-alert-id',
      alertType,
      message,
      metadata,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    console.log('Alert would be saved:', alert)

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
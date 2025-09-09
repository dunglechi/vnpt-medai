import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, modelName, tokensUsed, costUsd, requestType, metadata } = body

    if (!modelName || tokensUsed === undefined || costUsd === undefined || !requestType) {
      return NextResponse.json(
        { error: 'Missing required fields: modelName, tokensUsed, costUsd, requestType' },
        { status: 400 }
      )
    }

    // TODO: Save to database when Prisma is properly configured
    const usageEvent = {
      id: 'temp-id',
      userId,
      modelName,
      tokensUsed: parseInt(tokensUsed),
      costUsd: parseFloat(costUsd),
      requestType,
      metadata,
      createdAt: new Date().toISOString(),
    }

    console.log('Usage event would be saved:', usageEvent)

    return NextResponse.json(usageEvent)
  } catch (error) {
    console.error('Error creating usage event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId')

    // TODO: Fetch from database when Prisma is properly configured
    const usageEvents = [
      {
        id: 'sample-1',
        userId: userId || 'user1',
        modelName: 'gpt-4',
        tokensUsed: 1500,
        costUsd: 0.045,
        requestType: 'completion',
        metadata: { endpoint: '/api/chat' },
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 'sample-2',
        userId: userId || 'user1',
        modelName: 'gpt-3.5-turbo',
        tokensUsed: 800,
        costUsd: 0.012,
        requestType: 'completion',
        metadata: { endpoint: '/api/summarize' },
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      },
    ].slice(0, limit)

    return NextResponse.json(usageEvents)
  } catch (error) {
    console.error('Error fetching usage events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
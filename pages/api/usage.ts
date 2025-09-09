import type { NextApiRequest, NextApiResponse } from 'next'

export interface UsageData {
  id: string
  date: string
  service: string
  requests: number
  cost: number
  status: 'completed' | 'in-progress' | 'failed'
}

export interface UsageResponse {
  usage: UsageData[]
  totalRequests: number
  totalCost: number
  period: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsageResponse>
) {
  // Mock usage data
  const mockUsage: UsageData[] = [
    {
      id: '1',
      date: '2024-01-15',
      service: 'Medical Image Analysis',
      requests: 245,
      cost: 12.50,
      status: 'completed'
    },
    {
      id: '2', 
      date: '2024-01-14',
      service: 'Symptom Analysis',
      requests: 156,
      cost: 7.80,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-13',
      service: 'Medical Image Analysis',
      requests: 89,
      cost: 4.45,
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-01-12',
      service: 'Drug Interaction Check',
      requests: 312,
      cost: 15.60,
      status: 'completed'
    },
    {
      id: '5',
      date: '2024-01-11',
      service: 'Diagnostic Assistance',
      requests: 178,
      cost: 8.90,
      status: 'in-progress'
    }
  ]

  const totalRequests = mockUsage.reduce((sum, item) => sum + item.requests, 0)
  const totalCost = mockUsage.reduce((sum, item) => sum + item.cost, 0)

  res.status(200).json({
    usage: mockUsage,
    totalRequests,
    totalCost: Math.round(totalCost * 100) / 100,
    period: 'January 2024'
  })
}
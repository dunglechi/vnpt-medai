import type { NextApiRequest, NextApiResponse } from 'next'

export interface AlertData {
  id: string
  type: 'budget' | 'usage' | 'performance' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  service?: string
}

export interface AlertsResponse {
  alerts: AlertData[]
  unreadCount: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AlertsResponse>
) {
  // Mock alerts data
  const mockAlerts: AlertData[] = [
    {
      id: '1',
      type: 'budget',
      severity: 'high',
      title: 'Budget Threshold Exceeded',
      message: 'Medical Image Analysis service has exceeded 80% of allocated budget for January 2024',
      timestamp: '2024-01-15T14:30:00Z',
      isRead: false,
      service: 'Medical Image Analysis'
    },
    {
      id: '2',
      type: 'usage',
      severity: 'medium',
      title: 'High Usage Detected',
      message: 'Unusual spike in API requests detected for Symptom Analysis service',
      timestamp: '2024-01-15T12:15:00Z',
      isRead: false,
      service: 'Symptom Analysis'
    },
    {
      id: '3',
      type: 'performance',
      severity: 'low',
      title: 'Response Time Increased',
      message: 'Average response time for Drug Interaction Check has increased by 15%',
      timestamp: '2024-01-15T10:45:00Z',
      isRead: true,
      service: 'Drug Interaction Check'
    },
    {
      id: '4',
      type: 'security',
      severity: 'critical',
      title: 'Suspicious Activity Detected',
      message: 'Multiple failed authentication attempts detected from IP 192.168.1.100',
      timestamp: '2024-01-15T09:20:00Z',
      isRead: false
    },
    {
      id: '5',
      type: 'budget',
      severity: 'medium',
      title: 'Monthly Budget Warning',
      message: 'Overall budget usage is at 54% with 50% of month remaining',
      timestamp: '2024-01-14T16:00:00Z',
      isRead: true
    },
    {
      id: '6',
      type: 'usage',
      severity: 'low',
      title: 'Service Usage Update',
      message: 'Diagnostic Assistance service usage is 50% below average this week',
      timestamp: '2024-01-14T14:30:00Z',
      isRead: true,
      service: 'Diagnostic Assistance'
    }
  ]

  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length

  res.status(200).json({
    alerts: mockAlerts,
    unreadCount
  })
}
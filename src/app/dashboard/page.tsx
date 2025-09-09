'use client'

import { useEffect, useState } from 'react'

interface UsageEvent {
  id: string
  userId?: string
  modelName: string
  tokensUsed: number
  costUsd: number
  requestType: string
  metadata?: Record<string, unknown>
  createdAt: string
}

interface MonthlyBudget {
  id: string
  year: number
  month: number
  budgetLimitUsd: number
  currentUsageUsd: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AlertLog {
  id: string
  alertType: string
  message: string
  metadata?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

export default function Dashboard() {
  const [budget, setBudget] = useState<MonthlyBudget | null>(null)
  const [usageEvents, setUsageEvents] = useState<UsageEvent[]>([])
  const [alerts, setAlerts] = useState<AlertLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch current month budget
        const budgetResponse = await fetch('/api/budget')
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json()
          setBudget(budgetData)
        }

        // Fetch recent usage events
        const usageResponse = await fetch('/api/usage?limit=20')
        if (usageResponse.ok) {
          const usageData = await usageResponse.json()
          setUsageEvents(usageData)
        }

        // Fetch recent alerts
        const alertsResponse = await fetch('/api/alerts?limit=10')
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setAlerts(alertsData)
        }
      } catch (err) {
        setError('Failed to fetch dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getBudgetPercentage = () => {
    if (!budget) return 0
    return (budget.currentUsageUsd / budget.budgetLimitUsd) * 100
  }

  const getBudgetStatusColor = () => {
    const percentage = getBudgetPercentage()
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Token Usage & Cost Monitoring Dashboard</h1>
      
      {/* Budget Overview */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>
        {budget ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {new Date(budget.year, budget.month - 1).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </span>
              <span className={`font-semibold ${getBudgetStatusColor()}`}>
                {getBudgetPercentage().toFixed(1)}% used
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className={`h-2.5 rounded-full ${
                  getBudgetPercentage() >= 90 ? 'bg-red-600' :
                  getBudgetPercentage() >= 75 ? 'bg-yellow-600' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(getBudgetPercentage(), 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span>Current Usage: {formatCurrency(budget.currentUsageUsd)}</span>
              <span>Budget Limit: {formatCurrency(budget.budgetLimitUsd)}</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No budget data available</div>
        )}
      </div>

      {/* Recent Usage Events */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Usage Events</h2>
        {usageEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Model</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Tokens</th>
                  <th className="px-4 py-2 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                {usageEvents.map((event) => (
                  <tr key={event.id} className="border-b">
                    <td className="px-4 py-2 text-sm">{formatDate(event.createdAt)}</td>
                    <td className="px-4 py-2">{event.modelName}</td>
                    <td className="px-4 py-2">{event.requestType}</td>
                    <td className="px-4 py-2">{event.tokensUsed.toLocaleString()}</td>
                    <td className="px-4 py-2">{formatCurrency(event.costUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No usage events found</div>
        )}
      </div>

      {/* Recent Alerts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded border-l-4 ${
                  alert.alertType === 'budget_exceeded' ? 'border-red-500 bg-red-50' :
                  alert.alertType === 'budget_warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{alert.alertType.replace('_', ' ').toUpperCase()}</div>
                    <div className="text-gray-700">{alert.message}</div>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(alert.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No alerts found</div>
        )}
      </div>
    </div>
  )
}
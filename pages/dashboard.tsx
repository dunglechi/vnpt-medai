import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import type { UsageResponse } from './api/usage'
import type { BudgetResponse } from './api/budget'
import type { AlertsResponse } from './api/alerts'

export default function Dashboard() {
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [budget, setBudget] = useState<BudgetResponse | null>(null)
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usageRes, budgetRes, alertsRes] = await Promise.all([
          fetch('/api/usage'),
          fetch('/api/budget'),
          fetch('/api/alerts')
        ])

        const [usageData, budgetData, alertsData] = await Promise.all([
          usageRes.json(),
          budgetRes.json(),
          alertsRes.json()
        ])

        setUsage(usageData)
        setBudget(budgetData)
        setAlerts(alertsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#65a30d'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669'
      case 'in-progress': return '#d97706'
      case 'failed': return '#dc2626'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading dashboard...
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Head>
        <title>Dashboard - VNPT MedAI</title>
        <meta name="description" content="VNPT MedAI Dashboard" />
      </Head>

      {/* Header */}
      <header style={{ 
        backgroundColor: '#1e40af', 
        color: 'white', 
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>VNPT MedAI Dashboard</h1>
          <nav>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
              ← Home
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Monthly Budget Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1f2937' }}>Monthly Budget</h2>
          {budget && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Allocated</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>${budget.currentBudget.allocated}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Spent</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>${budget.currentBudget.spent}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Remaining</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>${budget.currentBudget.remaining}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Usage</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                    {Math.round((budget.currentBudget.spent / budget.currentBudget.allocated) * 100)}%
                  </div>
                </div>
              </div>
              
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#1f2937' }}>Service Breakdown</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {budget.currentBudget.services.map((service, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{service.name}</span>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        ${service.spent} / ${service.allocated}
                      </span>
                      <div style={{ 
                        width: '100px', 
                        height: '8px', 
                        backgroundColor: '#e5e7eb', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${Math.min((service.spent / service.allocated) * 100, 100)}%`, 
                          height: '100%',
                          backgroundColor: service.spent > service.allocated ? '#dc2626' : '#3b82f6',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Recent Usage Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1f2937' }}>Recent Usage</h2>
          {usage && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Requests</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{usage.totalRequests.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Cost</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>${usage.totalCost}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Period</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{usage.period}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#1f2937' }}>Usage Details</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Service</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Requests</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Cost</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.usage.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', color: '#1f2937' }}>{new Date(item.date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', color: '#1f2937' }}>{item.service}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>{item.requests.toLocaleString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>${item.cost}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            backgroundColor: `${getStatusColor(item.status)}20`,
                            color: getStatusColor(item.status)
                          }}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Alerts Section */}
        <section>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1f2937' }}>
            Alerts 
            {alerts && alerts.unreadCount > 0 && (
              <span style={{ 
                marginLeft: '8px',
                padding: '2px 8px',
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {alerts.unreadCount} unread
              </span>
            )}
          </h2>
          {alerts && (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {alerts.alerts.map((alert) => (
                <div key={alert.id} style={{ 
                  padding: '20px',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: alert.isRead ? 'white' : '#fef7ff',
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {alert.title}
                      </h3>
                      <span style={{ 
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        backgroundColor: `${getSeverityColor(alert.severity)}20`,
                        color: getSeverityColor(alert.severity)
                      }}>
                        {alert.severity}
                      </span>
                      <span style={{ 
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280'
                      }}>
                        {alert.type}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                    {alert.message}
                  </p>
                  {alert.service && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ 
                        fontSize: '12px',
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Service: {alert.service}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
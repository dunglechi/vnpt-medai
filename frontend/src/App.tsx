import React, { useState, useEffect } from 'react';
import { UsageData } from './types';
import apiService from './services/api';
import UsageCard from './components/UsageCard';
import TestPanel from './components/TestPanel';
import './App.css';

const App: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<UsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getDashboardData();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnection = async () => {
    const isConnected = await apiService.testConnection();
    setConnectionStatus(isConnected);
  };

  const handleUpdateBudget = async (provider: string, budgetLimit: number) => {
    try {
      await apiService.updateBudget(provider, budgetLimit);
      await fetchDashboardData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
    }
  };

  const handleUsageTracked = () => {
    fetchDashboardData(); // Refresh dashboard when new usage is tracked
  };

  useEffect(() => {
    checkConnection();
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getTotalSpending = () => {
    return dashboardData.reduce((total, item) => total + item.total_cost, 0);
  };

  const getTotalBudget = () => {
    return dashboardData.reduce((total, item) => total + item.budget_limit, 0);
  };

  const getCriticalAlerts = () => {
    return dashboardData.filter(item => item.status === 'critical').length;
  };

  const getWarningAlerts = () => {
    return dashboardData.filter(item => item.status === 'warning').length;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏥 VNPT MedAI - Usage Dashboard</h1>
          <div className="header-info">
            <div className={`connection-status ${connectionStatus ? 'connected' : 'disconnected'}`}>
              {connectionStatus ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
            <div className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button onClick={fetchDashboardData} disabled={isLoading} className="refresh-btn">
              {isLoading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            ❌ {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Monthly Spending</h3>
            <div className="summary-value">${getTotalSpending().toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <h3>Total Monthly Budget</h3>
            <div className="summary-value">${getTotalBudget().toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <h3>Critical Alerts</h3>
            <div className={`summary-value ${getCriticalAlerts() > 0 ? 'critical' : ''}`}>
              {getCriticalAlerts()}
            </div>
          </div>
          <div className="summary-card">
            <h3>Warning Alerts</h3>
            <div className={`summary-value ${getWarningAlerts() > 0 ? 'warning' : ''}`}>
              {getWarningAlerts()}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {isLoading && dashboardData.length === 0 ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            dashboardData.map((data) => (
              <UsageCard
                key={data.provider}
                data={data}
                onUpdateBudget={handleUpdateBudget}
              />
            ))
          )}
        </div>

        <TestPanel onUsageTracked={handleUsageTracked} />
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 VNPT MedAI - Token Usage Tracking & Cost Monitoring System</p>
      </footer>
    </div>
  );
};

export default App;
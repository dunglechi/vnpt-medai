import React from 'react';
import { UsageData } from '../types';

interface UsageCardProps {
  data: UsageData;
  onUpdateBudget: (provider: string, budget: number) => void;
}

const UsageCard: React.FC<UsageCardProps> = ({ data, onUpdateBudget }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newBudget, setNewBudget] = React.useState(data.budget_limit);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#dc3545'; // Red
      case 'warning':
        return '#ffc107'; // Yellow
      default:
        return '#28a745'; // Green
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      default:
        return '✅';
    }
  };

  const handleBudgetUpdate = () => {
    if (newBudget > 0 && newBudget !== data.budget_limit) {
      onUpdateBudget(data.provider, newBudget);
    }
    setIsEditing(false);
  };

  const progressPercentage = Math.min(data.usage_percent, 100);

  return (
    <div className="usage-card">
      <div className="card-header">
        <h3>
          {getStatusIcon(data.status)} {data.provider.toUpperCase()} API
        </h3>
        <span className={`status-badge ${data.status}`}>
          {data.status.toUpperCase()}
        </span>
      </div>

      <div className="usage-metrics">
        <div className="metric">
          <label>Total Tokens:</label>
          <span>{data.total_tokens.toLocaleString()}</span>
        </div>
        
        <div className="metric">
          <label>Total Requests:</label>
          <span>{data.total_requests.toLocaleString()}</span>
        </div>
        
        <div className="metric">
          <label>Current Spending:</label>
          <span>${data.total_cost.toFixed(2)}</span>
        </div>

        <div className="metric">
          <label>Monthly Budget:</label>
          {isEditing ? (
            <div className="budget-edit">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(parseFloat(e.target.value))}
                step="0.01"
                min="0"
              />
              <button onClick={handleBudgetUpdate}>✓</button>
              <button onClick={() => setIsEditing(false)}>✗</button>
            </div>
          ) : (
            <div className="budget-display">
              <span>${data.budget_limit.toFixed(2)}</span>
              <button onClick={() => setIsEditing(true)}>✏️</button>
            </div>
          )}
        </div>

        <div className="metric">
          <label>Remaining Budget:</label>
          <span className={data.remaining_budget < 0 ? 'negative' : ''}>
            ${data.remaining_budget.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Budget Usage</span>
          <span>{data.usage_percent.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: getStatusColor(data.status),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UsageCard;
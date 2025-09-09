export interface UsageData {
  provider: string;
  total_tokens: number;
  total_cost: number;
  total_requests: number;
  budget_limit: number;
  remaining_budget: number;
  usage_percent: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface UsageStats {
  usage: Array<{
    total_tokens: number;
    total_cost: number;
    total_requests: number;
    request_type: string;
    model: string;
  }>;
  currentSpending: number;
  budgetLimit: number;
  remainingBudget: number;
  usagePercent: number;
}

export interface TrackUsageRequest {
  provider: string;
  model: string;
  tokens: number;
  requestType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
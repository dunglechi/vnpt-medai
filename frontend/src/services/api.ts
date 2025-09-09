import axios from 'axios';
import { UsageData, UsageStats, TrackUsageRequest, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get dashboard data
  async getDashboardData(): Promise<UsageData[]> {
    const response = await api.get<ApiResponse<UsageData[]>>('/api/dashboard');
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch dashboard data');
    }
    return response.data.data || [];
  },

  // Get usage statistics for a provider
  async getUsageStats(provider: string, month?: string, year?: number): Promise<UsageStats> {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    
    const response = await api.get<ApiResponse<UsageStats>>(
      `/api/usage/${provider}?${params.toString()}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch usage statistics');
    }
    return response.data.data!;
  },

  // Track manual usage (for testing)
  async trackUsage(request: TrackUsageRequest): Promise<any> {
    const response = await api.post<ApiResponse<any>>('/api/track-usage', request);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to track usage');
    }
    return response.data.data;
  },

  // Update budget for a provider
  async updateBudget(provider: string, budgetLimit: number): Promise<void> {
    const response = await api.put<ApiResponse<any>>(`/api/budget/${provider}`, {
      budgetLimit,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update budget');
    }
  },

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await api.get('/api/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};

export default apiService;
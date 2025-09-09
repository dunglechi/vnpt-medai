const Database = require('./database');

class UsageTracker {
  constructor() {
    this.db = new Database();
    this.budgets = {
      openai: parseFloat(process.env.MONTHLY_BUDGET_OPENAI) || 10,
      gemini: parseFloat(process.env.MONTHLY_BUDGET_GEMINI) || 8
    };
    this.thresholds = {
      warning: parseFloat(process.env.QUOTA_WARNING_THRESHOLD) || 0.8,
      critical: parseFloat(process.env.QUOTA_CRITICAL_THRESHOLD) || 0.95
    };
  }

  // Track API usage and check for budget alerts
  async trackUsage(provider, model, tokens, requestType) {
    try {
      const cost = this.calculateCost(provider, model, tokens, requestType);
      
      // Record the usage
      await this.db.recordUsage(provider, model, tokens, cost, requestType);
      
      // Check for budget alerts
      await this.checkBudgetAlerts(provider);
      
      return {
        success: true,
        cost,
        tokens,
        provider,
        model
      };
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }

  // Calculate cost based on provider pricing
  calculateCost(provider, model, tokens, requestType) {
    const pricing = {
      openai: {
        'gpt-3.5-turbo': {
          input: 0.0015 / 1000,  // $0.0015 per 1K tokens
          output: 0.002 / 1000   // $0.002 per 1K tokens
        },
        'gpt-4': {
          input: 0.03 / 1000,    // $0.03 per 1K tokens
          output: 0.06 / 1000    // $0.06 per 1K tokens
        }
      },
      gemini: {
        'gemini-pro': {
          input: 0.000125 / 1000,   // $0.000125 per 1K tokens
          output: 0.000375 / 1000   // $0.000375 per 1K tokens
        },
        'gemini-pro-vision': {
          input: 0.00025 / 1000,    // $0.00025 per 1K tokens
          output: 0.00075 / 1000    // $0.00075 per 1K tokens
        }
      }
    };

    const modelPricing = pricing[provider]?.[model];
    if (!modelPricing) {
      // Default pricing if model not found
      return tokens * 0.001 / 1000;
    }

    const rate = modelPricing[requestType] || modelPricing.input;
    return tokens * rate;
  }

  // Check budget alerts and send notifications
  async checkBudgetAlerts(provider) {
    try {
      const currentSpending = await this.db.getCurrentMonthSpending(provider);
      const budgetLimit = this.budgets[provider];
      const usagePercent = currentSpending / budgetLimit;

      // Check for warning threshold
      if (usagePercent >= this.thresholds.warning && usagePercent < this.thresholds.critical) {
        await this.sendAlert(provider, 'warning', this.thresholds.warning, currentSpending, budgetLimit);
      }
      
      // Check for critical threshold
      if (usagePercent >= this.thresholds.critical) {
        await this.sendAlert(provider, 'critical', this.thresholds.critical, currentSpending, budgetLimit);
      }

      return {
        currentSpending,
        budgetLimit,
        usagePercent,
        remainingBudget: budgetLimit - currentSpending
      };
    } catch (error) {
      console.error('Error checking budget alerts:', error);
      throw error;
    }
  }

  // Send alert notification
  async sendAlert(provider, alertType, threshold, currentSpend, budgetLimit) {
    const message = `${alertType.toUpperCase()} Alert: ${provider.toUpperCase()} API usage has reached ${(threshold * 100).toFixed(1)}% of monthly budget. Current spending: $${currentSpend.toFixed(2)} / $${budgetLimit.toFixed(2)}`;
    
    // Record alert in database
    await this.db.recordAlert(provider, alertType, threshold, currentSpend, budgetLimit, message);
    
    // Log alert (in production, this could send emails/notifications)
    console.log(`🚨 BUDGET ALERT: ${message}`);
    
    return message;
  }

  // Get usage statistics
  async getUsageStats(provider, month, year) {
    try {
      const usage = await this.db.getMonthlyUsage(provider, month, year);
      const currentSpending = await this.db.getCurrentMonthSpending(provider);
      const budgetLimit = this.budgets[provider];
      
      return {
        usage,
        currentSpending,
        budgetLimit,
        remainingBudget: budgetLimit - currentSpending,
        usagePercent: (currentSpending / budgetLimit) * 100
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }

  // Get dashboard data for all providers
  async getDashboardData() {
    try {
      const dashboardData = await this.db.getDashboardData();
      const result = [];

      for (const provider of ['openai', 'gemini']) {
        const providerData = dashboardData.find(d => d.provider === provider) || {
          provider,
          total_tokens: 0,
          total_cost: 0,
          total_requests: 0
        };

        const budgetLimit = this.budgets[provider];
        const usagePercent = (providerData.total_cost / budgetLimit) * 100;

        result.push({
          ...providerData,
          budget_limit: budgetLimit,
          remaining_budget: budgetLimit - providerData.total_cost,
          usage_percent: usagePercent,
          status: usagePercent >= 95 ? 'critical' : usagePercent >= 80 ? 'warning' : 'normal'
        });
      }

      return result;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
}

module.exports = UsageTracker;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const UsageTracker = require('./usageTracker');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize usage tracker
const usageTracker = new UsageTracker();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to track API usage
const trackApiUsage = (provider, model, requestType = 'input') => {
  return async (req, res, next) => {
    try {
      // In a real implementation, you would extract token count from the API response
      // For demo purposes, we'll estimate based on content length
      const estimatedTokens = Math.ceil((req.body?.content?.length || 100) / 4);
      
      await usageTracker.trackUsage(provider, model, estimatedTokens, requestType);
      next();
    } catch (error) {
      console.error('Error tracking API usage:', error);
      next(); // Continue even if tracking fails
    }
  };
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VNPT MedAI Backend is running' });
});

// Get dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboardData = await usageTracker.getDashboardData();
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// Get usage statistics for a specific provider
app.get('/api/usage/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { month, year } = req.query;
    
    const now = new Date();
    const targetMonth = month || now.toISOString().slice(0, 7);
    const targetYear = year ? parseInt(year) : now.getFullYear();
    
    const stats = await usageTracker.getUsageStats(provider, targetMonth, targetYear);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching usage statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage statistics'
    });
  }
});

// Manual usage tracking endpoint (for testing)
app.post('/api/track-usage', async (req, res) => {
  try {
    const { provider, model, tokens, requestType } = req.body;
    
    if (!provider || !model || !tokens) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: provider, model, tokens'
      });
    }
    
    const result = await usageTracker.trackUsage(provider, model, tokens, requestType || 'input');
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error tracking usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track usage'
    });
  }
});

// Simulated AI API endpoints with usage tracking

// OpenAI GPT endpoint
app.post('/api/openai/chat', trackApiUsage('openai', 'gpt-3.5-turbo', 'input'), (req, res) => {
  // Simulate OpenAI API response
  const response = {
    id: 'chatcmpl-' + Date.now(),
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'gpt-3.5-turbo',
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: 'This is a simulated medical AI response. In a real implementation, this would connect to OpenAI API.'
      },
      finish_reason: 'stop'
    }],
    usage: {
      prompt_tokens: 20,
      completion_tokens: 30,
      total_tokens: 50
    }
  };
  
  res.json(response);
});

// Gemini API endpoint
app.post('/api/gemini/generate', trackApiUsage('gemini', 'gemini-pro', 'input'), (req, res) => {
  // Simulate Gemini API response
  const response = {
    candidates: [{
      content: {
        parts: [{
          text: 'This is a simulated Gemini medical AI response. In a real implementation, this would connect to Google Gemini API.'
        }],
        role: 'model'
      },
      finishReason: 'STOP',
      index: 0
    }],
    usageMetadata: {
      promptTokenCount: 15,
      candidatesTokenCount: 25,
      totalTokenCount: 40
    }
  };
  
  res.json(response);
});

// Budget management endpoints
app.put('/api/budget/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { budgetLimit } = req.body;
    
    if (!budgetLimit || budgetLimit <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid budget limit'
      });
    }
    
    // Update budget in tracker
    usageTracker.budgets[provider] = parseFloat(budgetLimit);
    
    res.json({
      success: true,
      message: `Budget updated for ${provider}`,
      data: { provider, budgetLimit: parseFloat(budgetLimit) }
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update budget'
    });
  }
});

// Scheduled job to check budgets daily
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily budget check...');
  try {
    await usageTracker.checkBudgetAlerts('openai');
    await usageTracker.checkBudgetAlerts('gemini');
  } catch (error) {
    console.error('Error in scheduled budget check:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 VNPT MedAI Backend running on port ${port}`);
  console.log(`📊 Token usage tracking and cost monitoring enabled`);
  console.log(`💰 Monthly budgets: OpenAI $${usageTracker.budgets.openai}, Gemini $${usageTracker.budgets.gemini}`);
});

module.exports = app;
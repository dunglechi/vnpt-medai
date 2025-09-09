# VNPT MedAI

## Token Usage Tracking & Cost Monitoring System

This project implements comprehensive token usage tracking and cost monitoring for VNPT MedAI, supporting both OpenAI and Gemini API integrations.

### Features

- **Real-time Usage Tracking**: Monitor API token consumption and costs in real-time
- **Budget Management**: Set monthly budgets ($10 for OpenAI, $8 for Gemini) with customizable limits
- **Smart Alerts**: Automatic notifications at 80% (warning) and 95% (critical) budget thresholds
- **Interactive Dashboard**: Modern React TypeScript interface with usage visualization
- **Historical Data**: SQLite database for tracking usage patterns and spending history
- **Multi-Provider Support**: Integrated support for both OpenAI GPT models and Google Gemini

### Architecture

#### Backend (`/backend`)
- **Express.js** server with RESTful API endpoints
- **SQLite** database for persistent usage tracking
- **Node-cron** for scheduled budget monitoring
- Middleware for automatic API usage tracking
- Real-time cost calculation based on provider pricing

#### Frontend (`/frontend`)
- **React 18** with **TypeScript** for type safety
- **Recharts** for usage visualization
- Responsive dashboard design
- Real-time data updates every 30 seconds
- Budget management interface

### Quick Start

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys and configuration
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Environment Configuration**:
   ```env
   # Backend .env
   PORT=3001
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   MONTHLY_BUDGET_OPENAI=10
   MONTHLY_BUDGET_GEMINI=8
   QUOTA_WARNING_THRESHOLD=0.8
   QUOTA_CRITICAL_THRESHOLD=0.95
   ```

### API Endpoints

- `GET /api/dashboard` - Get current usage dashboard data
- `GET /api/usage/:provider` - Get detailed usage statistics
- `POST /api/track-usage` - Manual usage tracking
- `PUT /api/budget/:provider` - Update monthly budget
- `POST /api/openai/chat` - OpenAI API proxy with tracking
- `POST /api/gemini/generate` - Gemini API proxy with tracking

### Usage Tracking

The system automatically tracks:
- Token consumption per API call
- Cost calculation based on current pricing
- Request types (input/output tokens)
- Model-specific usage patterns
- Monthly spending aggregation

### Alert System

Configurable thresholds trigger alerts when:
- **Warning (80%)**: Approaching monthly budget limit
- **Critical (95%)**: Near budget exhaustion
- **Daily Reports**: Automated budget status checks

### Technologies Used

- **Backend**: Node.js, Express.js, SQLite3, Node-cron
- **Frontend**: React 18, TypeScript, Axios, Recharts
- **Database**: SQLite for lightweight, embedded storage
- **Monitoring**: Real-time usage tracking with automated alerts

### License

MIT License - see LICENSE file for details

---

**VNPT MedAI** - AI-Powered Medical Diagnosis Assistant with Comprehensive Cost Monitoring

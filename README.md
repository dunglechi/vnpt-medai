# VNPT MedAI - Token Usage & Cost Monitoring

AI-Powered Medical Diagnosis Assistant with comprehensive token usage and cost monitoring dashboard.

## Features

- **Real-time Usage Tracking**: Monitor AI model token usage and costs
- **Monthly Budget Management**: Set and track monthly spending limits
- **Alert System**: Get notified when approaching budget limits
- **Dashboard Interface**: Visual monitoring with charts and tables
- **API Endpoints**: RESTful APIs for usage tracking and budget management
- **Automated Budget Reset**: Monthly cron job for budget rollover

## Screenshots

### Home Page
![Home Page](https://github.com/user-attachments/assets/1498625f-678b-42e7-87ff-6f23f428e695)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/a79cec55-0fb1-40a1-bd98-241ce2f9693f)

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd vnpt-medai
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:migrate:deploy
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Visit the application:**
   - Home: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

## Database Schema

### Tables

- **usage_events**: Stores individual API usage records
- **monthly_budgets**: Tracks monthly spending limits and current usage
- **alerts_log**: System alerts and notifications

### Environment Variables

```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
CRON_SECRET="your-secret-for-cron-jobs"  # Optional
```

## API Endpoints

### Usage Tracking
- `POST /api/usage` - Record usage event
- `GET /api/usage` - List recent usage events

### Budget Management
- `GET /api/budget` - Get current month budget
- `POST /api/budget` - Update budget settings

### Alerts
- `GET /api/alerts` - List recent alerts
- `POST /api/alerts` - Create alert

### Cron Jobs
- `POST /api/cron/monthly-reset` - Reset monthly budget (automated)

## Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `CRON_SECRET` - Secret for cron job authentication (optional)
3. Deploy automatically runs migrations

### Database Setup (Neon)

1. Create a Neon PostgreSQL database
2. Copy the connection string to `DATABASE_URL`
3. Run migrations: `npm run db:migrate:deploy`

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── usage/             # Usage tracking endpoints
│   │   ├── budget/            # Budget management endpoints
│   │   ├── alerts/            # Alert endpoints
│   │   └── cron/              # Cron job endpoints
│   ├── dashboard/             # Dashboard page
│   └── page.tsx               # Home page
├── lib/
│   └── db.ts                  # Database client
prisma/
├── schema.prisma              # Database schema
└── migrations/                # Database migrations
scripts/
└── cron-monthly-reset.ts      # Monthly budget reset script
```

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Testing API Endpoints

```bash
# Get current budget
curl http://localhost:3000/api/budget

# Record usage
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{"modelName":"gpt-4","tokensUsed":1000,"costUsd":0.03,"requestType":"completion"}'

# Get usage events
curl http://localhost:3000/api/usage

# Get alerts
curl http://localhost:3000/api/alerts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

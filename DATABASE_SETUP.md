# Database Setup Instructions

## Prerequisites
- PostgreSQL database (Neon recommended for Vercel deployment)
- DATABASE_URL environment variable set

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

3. **Run database migrations:**
   ```bash
   npm run db:migrate:deploy
   ```

## Environment Variables

Set these in your Vercel project or `.env` file:

```
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"
CRON_SECRET="your-secret-for-cron-jobs"  # Optional
```

## Database Schema

The application uses three main tables:
- `usage_events`: Stores token usage records
- `monthly_budgets`: Tracks monthly spending limits
- `alerts_log`: System alerts and notifications

## Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. The app will automatically run migrations on deployment

## Cron Jobs

The application includes a monthly budget reset cron job that runs on the 1st of each month.
This is configured in `vercel.json` and will work automatically on Vercel.
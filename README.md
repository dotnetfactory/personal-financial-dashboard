# Personal Finance Dashboard

A dashboard to track all your financial accounts in one place using Plaid API and Coinbase integration. Features include bank account balance tracking, cryptocurrency holdings, daily updates, and email notifications.
![image](https://github.com/user-attachments/assets/d0d8ba2c-d540-444e-a739-7f5797c4dd20)

## Paid Setup Review

Setting up Plaid, Coinbase OAuth, Prisma, and optional SES notifications can involve several small config mismatches. The free [setup readiness checklist](docs/setup-readiness-checklist.md) covers the main items to verify before connecting real accounts.

If you want a second pass on your setup, you can buy a `$12` manual setup review:

[Buy the setup review](https://buy.stripe.com/9B614m8vxeZi80z63vaMU06)

The review covers environment variables, redirect URI alignment, database setup, local run steps, and email notification readiness. It is not financial advice, tax advice, investment advice, or account troubleshooting. Do not send bank credentials, Coinbase credentials, Plaid secrets, account balances, transaction exports, database files, screenshots with private financial data, or production tokens.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Plaid account (Development or Production)
- (Optional) Amazon SES account for email notifications

## Setup Instructions

### 1. Plaid Setup

1. Create a [Plaid account](https://dashboard.plaid.com/signup)
2. Once logged in, go to the [Keys section](https://dashboard.plaid.com/team/keys)
3. Copy your `client_id` and the appropriate `secret` (sandbox/development/production)
4. Note: For real bank connections, you'll need Development or Production credentials

### 2. Coinbase Setup

1. Go to [Coinbase Developer Portal](https://www.coinbase.com/settings/api)
2. Click "New OAuth2 Application"
3. Fill in the application details:
   - Name: Personal Finance Dashboard (or your preferred name)
   - Website URL: http://localhost:3000
   - Redirect URLs: http://localhost:3000/api/crypto/oauth/callback
4. Copy your `client_id` and `client_secret`
5. Note: The redirect URL must match exactly what you set in your `.env` file

### 3. Environment Setup

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd personal-finance-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:

   ```env
   # Plaid API credentials
   PLAID_CLIENT_ID="your_client_id"
   PLAID_SECRET="your_secret"
   PLAID_ENV="development"  # or "sandbox" or "production"

   # Coinbase API credentials
   COINBASE_CLIENT_ID="your_coinbase_client_id"
   COINBASE_CLIENT_SECRET="your_coinbase_client_secret"
   COINBASE_REDIRECT_URI="http://localhost:3000/api/crypto/oauth/callback"

   # Database
   DATABASE_URL="file:./dev.db"

   # Next Auth (generate a secret with: openssl rand -base64 32)
   NEXTAUTH_SECRET="your_generated_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 4. Database Setup

1. Initialize the database:
   ```bash
   npx prisma db push
   ```

### 5. Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### 6. Connecting Accounts

1. For Bank Accounts:

   - Click the "Connect Bank Account" button in the dashboard
   - Follow the Plaid Link flow to connect your bank accounts
   - Your accounts should appear in the dashboard immediately

2. For Coinbase:

   - Click the "Connect Coinbase" button in the dashboard
   - You'll be redirected to Coinbase to authorize the application
   - After authorization, your Coinbase accounts and balances will appear in the dashboard
   - Balances are automatically refreshed periodically

3. Refresh the page to see updated balances for all accounts

## Daily Balance Updates (Optional)

If you want to receive daily balance updates via email, follow these additional steps:

### 1. Email Setup (Amazon SES)

Add the following to your `.env` file to enable email notifications:

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_ses_smtp_username
EMAIL_PASSWORD=your_ses_smtp_password
EMAIL_FROM=your_verified_email@domain.com
```

### 2. Setting Up the Daily Update Script

1. Make the refresh script executable:

   ```bash
   chmod +x scripts/refresh-data.sh
   ```

2. Create a logs directory:

   ```bash
   mkdir logs
   ```

3. Test the script:
   ```bash
   ./scripts/refresh-data.sh
   ```

### 3. Setting Up the Cron Job

1. Open your crontab:

   ```bash
   crontab -e
   ```

2. Add the following line to run the script daily at 6 AM:

   ```bash
   0 6 * * * /full/path/to/scripts/refresh-data.sh >> /full/path/to/logs/refresh.log 2>&1
   ```

   Replace `/full/path/to` with your actual project path.

3. Save and exit the editor

4. Verify your cron job:
   ```bash
   crontab -l
   ```

### Troubleshooting

1. Check the logs for any errors:

   ```bash
   tail -f logs/refresh.log
   ```

2. Common issues:
   - `ITEM_LOGIN_REQUIRED`: You need to re-authenticate with your bank
   - `INVALID_CREDENTIALS`: Your bank credentials need updating
   - `INSTITUTION_DOWN`: The bank's systems are temporarily unavailable

## Development

### Project Structure

- `/src` - Application source code
  - `/app` - Next.js app router components
  - `/components` - Reusable React components
  - `/lib` - Utility functions and configurations
- `/scripts` - Automation scripts
- `/prisma` - Database schema and migrations

### Database Management with Prisma Studio

Prisma Studio provides a modern interface to view and edit your database data:

1. Start Prisma Studio:

   ```bash
   npx prisma studio
   ```

2. Open [http://localhost:5555](http://localhost:5555) in your browser

3. You can:
   - View all your connected bank accounts
   - See historical balance records
   - Manage Plaid connections
   - Export data as CSV
   - Filter and sort records

Note: Be cautious when manually editing data as it might affect the application's functionality.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `./scripts/refresh-data.sh` - Manually run balance update

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

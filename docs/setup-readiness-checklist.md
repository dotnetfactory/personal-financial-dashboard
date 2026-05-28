# Personal Finance Dashboard Setup Readiness Checklist

Use this checklist before connecting real accounts or moving beyond a local development setup.

## Plaid

- Confirm `PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_ENV` match the same Plaid team and environment.
- Use sandbox credentials while testing the first run.
- For development or production access, confirm the app is approved for the Plaid products you plan to use.
- Confirm your Plaid Link flow returns a public token and the exchange route stores the resulting access token.

## Coinbase OAuth

- Confirm the Coinbase application redirect URL exactly matches `COINBASE_REDIRECT_URI`.
- Use the same hostname and port in Coinbase, `.env`, and the browser session.
- Keep `COINBASE_CLIENT_SECRET` out of screenshots, issues, pull requests, and logs.
- Test OAuth with a non-production local setup before connecting anything sensitive.

## Application Environment

- Generate a unique `NEXTAUTH_SECRET` for each environment.
- Confirm `NEXTAUTH_URL` matches the URL where the app is running.
- Run `npm install` after pulling dependency updates.
- Run `npx prisma db push` against the intended local database.
- Keep `.env`, SQLite database files, and logs with account data out of git.

## Daily Updates And Email

- Test `scripts/refresh-data.sh` manually before adding a cron job.
- Write cron output to a log file you can inspect.
- Confirm SES credentials are SMTP credentials, not AWS console credentials.
- Use a verified sender address for `EMAIL_FROM`.

## Safety

- Do not paste bank credentials, Plaid secrets, Coinbase secrets, account balances, transaction exports, database files, or production tokens into public issues.
- Redact account names, balances, and transactions from screenshots.
- Treat this app as a personal data system even in development.
- This checklist is for software setup only. It is not financial advice, tax advice, investment advice, or a recommendation to connect any financial account.

## Paid Setup Review

If you want a manual setup review, use the `$12` checkout link:

https://buy.stripe.com/8x27sNaZP691dWKbjU8so07

Include only sanitized setup context such as your repo URL, deploy URL, environment names, error messages with secrets removed, or a short description of the blocker. Do not send private financial records or credentials.

# CryptoVault Production Deployment Guide

## Overview

CryptoVault is a full-stack cryptocurrency investment platform with user and admin dashboards, real-time crypto prices, deposit/withdrawal management, and password recovery functionality.

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account (free tier available)
- Vercel account (for deployment) or any Node.js hosting

## Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cryptovault
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cryptovault?retryWrites=true&w=majority"

# App URLs
NEXT_PUBLIC_APP_URL="https://yourdomain.com"  # Production URL

# Email Service (Optional - for password reset emails)
EMAIL_SERVICE="smtp"
EMAIL_USER="your-email@domain.com"
EMAIL_PASS="your-app-specific-password"
EMAIL_FROM="noreply@yourdomain.com"

# Security
SALT="generate-secure-random-string-here"
```

### 4. Setup MongoDB

1. Create a MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Get the connection string (include password in URL)
4. Add your application's IP address to the IP whitelist

### 5. Initialize Database

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed  # Optional: Seed initial data
```

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Features

### User Features
- **Authentication**: Secure registration and login with password hashing
- **Password Recovery**: Forgot password with email verification
- **Crypto Wallets**: Manage 4 currencies (BTC, ETH, LTC, USDT)
- **Real-time Prices**: Live cryptocurrency prices via CoinGecko API
- **Deposits**: Request deposits with admin approval workflow
- **Withdrawals**: Withdraw crypto to wallet addresses
- **Investment Plans**: Choose from Starter, Silver, or Gold plans
- **Dashboard**: View balances, transactions, and performance metrics
- **Transaction History**: Track all deposits, withdrawals, and profits

### Admin Features
- **User Management**: View and edit all user accounts
- **Balance Management**: Add or reduce user balances
- **Deposit Approval**: Review and approve pending deposits
- **Withdrawal Approval**: Review and approve pending withdrawals
- **Platform Statistics**: Monitor total deposits, withdrawals, and revenue
- **Analytics**: Real-time insights into platform activity

## Project Structure

```
cryptovault/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin endpoints
│   │   ├── deposits/      # Deposit management
│   │   ├── withdrawals/   # Withdrawal management
│   │   ├── crypto/        # Crypto price data
│   │   └── partners/      # Partner exchanges
│   ├── dashboard/         # User dashboard pages
│   ├── admin/             # Admin dashboard pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── forgot-password/   # Password recovery
│   ├── reset-password/    # Password reset
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── *-carousel.tsx    # Partners carousel
├── lib/                   # Utilities and helpers
│   ├── constants.ts      # Single point of truth for config
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # Authentication utilities
│   └── crypto-api.ts     # CoinGecko integration
├── prisma/               # Database schema
│   └── schema.prisma
└── public/               # Static assets
```

## Database Schema

### User
- Email, password (hashed), first/last name
- Role (user/admin)
- Wallet balances (BTC, ETH, LTC, USDT)
- Total deposited, withdrawn, profits

### Deposit
- User ID, amount, currency
- Status (pending/approved/rejected)
- Transaction hash

### Withdrawal
- User ID, amount, currency, wallet address
- Status (pending/approved/rejected/completed)

### Transaction
- User ID, type (deposit/withdrawal/profit), amount, currency

### PasswordResetToken
- User ID, token, expiration (1 hour)

### Partner
- Name, logo URL, link, active status

### InvestmentPlan
- User plan selection, returns, duration, amounts

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Click Deploy

3. **Post-Deployment**
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables to your production domain
   - Set up custom domain (optional)

### Deploy to Self-Hosted Server

1. **Install Node.js and PM2**
```bash
sudo apt update && sudo apt install nodejs npm
npm install -g pm2
```

2. **Clone and Setup**
```bash
git clone <repo-url>
cd cryptovault
npm install
cp .env.example .env.local
# Edit .env.local with production values
```

3. **Build and Start**
```bash
npm run build
pm2 start npm --name "cryptovault" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use strong random salt in production
   - Rotate sensitive values regularly

2. **Password Security**
   - Passwords are hashed with bcrypt
   - Password reset tokens expire after 1 hour
   - Use HTTPS in production

3. **Database**
   - Use MongoDB Atlas IP whitelist
   - Create separate DB user with limited permissions
   - Enable database encryption

4. **API Protection**
   - Admin routes check user role
   - User data scoped to authenticated user
   - Rate limiting recommended on auth endpoints

5. **CORS & Headers**
   - Configure appropriate CORS headers
   - Set security headers (CSP, X-Frame-Options, etc.)

## Troubleshooting

### MongoDB Connection Failed
- Check connection string in .env.local
- Verify IP address is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

### Crypto Prices Not Updating
- CoinGecko API is free and stable
- Check network tab for API call status
- Verify COINGECKO_API_URL is correct

### Password Reset Not Working
- Verify email configuration in .env.local
- Check that token expiration is set to future time
- Ensure DATABASE_URL is accessible

### Admin Not Found
- Create admin user via direct database insertion or custom seed script
- Verify admin email matches in admin login attempt

## Maintenance

### Regular Tasks
- Monitor MongoDB storage usage
- Review failed login attempts
- Backup database regularly
- Update dependencies: `npm update`

### Database Backups
```bash
# Using MongoDB Atlas Backup
# Go to Atlas Dashboard > Backups > Restore
# Or use mongodump for manual backups
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/cryptovault"
```

## Support & Troubleshooting

For issues:
1. Check error logs in console
2. Review `.env.local` configuration
3. Verify MongoDB connection
4. Check browser developer console for client-side errors

## API Documentation

All API endpoints require authentication via `Authorization` header or user ID in headers.

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Routes
- `GET /api/user/wallet` - Get user wallet balances
- `POST /api/deposits/create` - Create deposit request
- `POST /api/withdrawals/create` - Create withdrawal request
- `GET /api/transactions` - Get transaction history

### Admin Routes
- `GET /api/admin/users` - List all users
- `POST /api/admin/balance/update` - Update user balance
- `POST /api/deposits/approve` - Approve deposit
- `POST /api/withdrawals/approve` - Approve withdrawal

### Public Routes
- `GET /api/crypto/prices` - Get real-time crypto prices
- `GET /api/partners` - Get partner exchanges list

## License

Proprietary - CryptoVault Platform

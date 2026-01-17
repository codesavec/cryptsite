# CryptoVault - Crypto Investment Platform

A full-stack cryptocurrency investment and trading platform built with Next.js, Prisma, MongoDB, and real-time crypto price integration.

## ✨ Features

### User Features
- **Secure Authentication**: Registration & login with bcrypt password hashing
- **Password Recovery**: Complete forgot password and reset flow with secure tokens
- **Multi-Wallet Support**: BTC, ETH, LTC, USDT wallets with real-time balance tracking
- **Live Crypto Prices**: Real-time prices from CoinGecko API with USD conversion
- **Deposits & Withdrawals**: Full transaction management with admin approval workflow
- **Investment Plans**: 3 tiers (Starter, Silver, Gold) with configurable returns
- **Transaction History**: Track all deposits, withdrawals, and profits
- **Responsive Design**: Mobile-first design for all devices

### Admin Features
- **User Management**: View and edit all user accounts
- **Balance Management**: Add or reduce user balances
- **Deposit Approval**: Review and approve deposit requests
- **Withdrawal Approval**: Review and approve withdrawal requests
- **Platform Statistics**: Real-time insights into deposits, withdrawals, and revenue
- **Transaction Monitoring**: Complete transaction audit trail

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: bcryptjs for password hashing
- **UI Components**: shadcn/ui + Radix UI
- **Carousel**: Swiper for partner exchanges carousel
- **APIs**: CoinGecko (free crypto prices)
- **Styling**: Tailwind CSS with custom animations

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas cloud)
- npm or yarn

### Quick Installation (5 minutes)

```bash
# 1. Clone repository
git clone <repository-url>
cd cryptovault

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local and add your MongoDB connection string

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations
npx prisma migrate deploy

# 6. Seed initial data
npm run prisma:seed

# 7. Start development server
npm run dev
```

Visit `http://localhost:3000`

### Default Admin Credentials
```
Email: admin@cryptovault.com
Password: change-me-in-production
```

⚠️ **Important**: Change admin password immediately after first login!

## Project Structure

```
cryptovault/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── login/
│   ├── register/
│   ├── forgot-password/         # Password recovery
│   ├── reset-password/          # Password reset
│   ├── dashboard/
│   │   ├── page.tsx             # User dashboard
│   │   ├── deposit/
│   │   ├── withdraw/
│   │   ├── transactions/
│   │   └── plans/
│   ├── admin/
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── users/
│   │   └── transactions/
│   └── api/
│       ├── auth/                # Authentication
│       ├── deposits/            # Deposit management
│       ├── withdrawals/         # Withdrawal management
│       ├── admin/               # Admin operations
│       ├── user/                # User data
│       ├── crypto/              # Crypto prices
│       └── partners/            # Partner data
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── partners-carousel.tsx    # Swiper carousel
│   ├── dashboard-header.tsx
│   ├── sidebar-nav.tsx
│   ├── wallet-overview.tsx
│   ├── wallet-card.tsx
│   └── ...other components
├── lib/
│   ├── constants.ts             # Single point of truth
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # Auth utilities
│   ├── crypto-api.ts            # CoinGecko integration
│   └── utils.ts
├── hooks/
│   └── use-crypto-prices.ts     # Real-time prices hook
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── scripts/
│   └── setup-production.sh      # Production setup
└── public/
```

## Core Features Explained

### Homepage
- Professional landing page with hero section
- Investment plans showcase (Starter, Silver, Gold)
- Partner exchanges carousel (Swiper integration)
- 4-step onboarding guide
- Automated trading benefits
- Contact information
- Sticky navigation

### User Dashboard
- View total portfolio value
- Real-time balances for 4 cryptocurrencies
- Balances displayed in both crypto and USD
- Statistics dashboard
- Quick action buttons
- Recent activity feed

### Authentication
- **Registration**: Create new account with email/password
- **Login**: Secure authentication with session storage
- **Forgot Password**: Request password reset via email
- **Reset Password**: Token-based secure password reset (1-hour expiration)

### Deposit & Withdrawal
- Request deposits in any supported cryptocurrency
- Admin approval workflow
- Real-time USD conversion
- Withdrawal with wallet address
- Complete transaction history
- Status tracking (pending/approved/rejected)

### Investment Plans
- **Starter**: 200% return after 7 days ($1k-$50k)
- **Silver**: 500% return after 14 days ($10k-$500k)
- **Gold**: 1000% return after 30 days ($15k-$5M)
- Plans include referral bonuses and instant payments

## Database Schema

The application uses 8 core models:

- **User**: Accounts with wallet balances and statistics
- **PasswordResetToken**: Secure password recovery tokens
- **Deposit**: Deposit requests with approval workflow
- **Withdrawal**: Withdrawal requests with approval workflow
- **Transaction**: Complete transaction audit trail
- **InvestmentPlan**: User investment plan selections
- **Partner**: Exchange partnership information
- **Company**: Platform metadata and configuration

## API Endpoints

### Authentication (4 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Operations (4 endpoints)
- `GET /api/user/wallet` - Get wallet balances
- `POST /api/deposits/create` - Create deposit request
- `POST /api/withdrawals/create` - Create withdrawal request
- `GET /api/transactions` - Get transaction history

### Admin Operations (4 endpoints)
- `GET /api/admin/users` - List all users
- `POST /api/admin/balance/update` - Update user balance
- `POST /api/deposits/approve` - Approve deposit
- `POST /api/withdrawals/approve` - Approve withdrawal

### Public APIs (2 endpoints)
- `GET /api/crypto/prices` - Real-time crypto prices
- `GET /api/partners` - Partner exchanges list

**Total: 14+ production-ready endpoints**

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# MongoDB Connection (Required)
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/cryptovault"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# CoinGecko API (No key needed)
COINGECKO_API_URL="https://api.coingecko.com/api/v3"

# Security (Generate secure random value for production)
SALT="your-secure-salt-here"

# Email Service (Optional)
EMAIL_SERVICE="smtp"
EMAIL_USER="your-email@domain.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# Admin Credentials (Change after first login)
ADMIN_EMAIL="admin@cryptovault.com"
ADMIN_PASSWORD="change-me-in-production"
```

## Design System

- **Theme**: Dark mode with professional gold accents (#c9a961)
- **Typography**: Geist font family for clean appearance
- **Colors**:
  - Primary: Gold (#c9a961)
  - Background: Dark navy (#0f1419)
  - Cards: Slightly lighter dark
  - Text: Off-white for contrast
- **Animations**: Smooth fade-ins and transitions
- **Spacing**: Consistent with Tailwind scale
- **Responsiveness**: Mobile-first, works on all devices

## Security Features

- ✅ bcrypt password hashing with salt rounds
- ✅ Secure password reset tokens (1-hour expiration)
- ✅ Protected API routes with authentication
- ✅ Role-based access control (user/admin)
- ✅ Environment variable management
- ✅ No hardcoded secrets
- ✅ Type-safe with TypeScript
- ✅ Validated input and API responses

## Deployment

### Recommended: Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import GitHub repository
# 4. Add environment variables in Vercel dashboard
# 5. Deploy!
```

### Self-Hosted

```bash
# Build
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "cryptovault" -- start
```

See `PRODUCTION_SETUP.md` for comprehensive deployment guide.

## Available Scripts

```bash
npm run dev                 # Development server
npm run build              # Production build
npm start                  # Production server
npm run lint               # Code linting
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:seed        # Seed initial data
```

## Project Highlights

### No Mock Data
- ✅ All data stored in MongoDB
- ✅ Real-time price integration
- ✅ Complete workflow implementation

### Production Ready
- ✅ Comprehensive error handling
- ✅ Loading states and feedback
- ✅ Form validation
- ✅ Responsive on all devices

### Well Documented
- ✅ README.md (this file)
- ✅ PRODUCTION_SETUP.md - Deployment guide
- ✅ DEPLOYMENT_CHECKLIST.md - Pre-launch verification
- ✅ QUICK_REFERENCE.md - Developer reference
- ✅ Inline code documentation

### Developer Friendly
- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Consistent code style
- ✅ Environment configuration management

## Performance

- Server-side rendering for faster initial load
- Client-side caching for crypto prices
- Optimized database queries with indexes
- Image lazy loading
- CSS optimization with Tailwind
- Smooth GPU-accelerated animations

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablet browsers (iPad, Android)

## License

This project is proprietary. All rights reserved.

## Support & Documentation

For detailed information, see:
- 📖 **README.md** - This file (project overview)
- 📋 **PRODUCTION_SETUP.md** - Complete deployment guide
- ✅ **DEPLOYMENT_CHECKLIST.md** - Pre-launch checklist
- 🚀 **QUICK_REFERENCE.md** - Developer quick reference
- 📊 **IMPLEMENTATION_SUMMARY.md** - What was built
- 📦 **DELIVERY_SUMMARY.md** - Complete delivery info

## Getting Help

1. Check the documentation files listed above
2. Review the API endpoints documentation
3. Check the environment configuration
4. Verify MongoDB connection

---

**CryptoVault** - Making crypto investment simple, secure, and beautiful.

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: January 2026

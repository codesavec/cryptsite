# CryptoVault Quick Reference Guide

## Getting Started in 5 Minutes

```bash
# 1. Install
npm install

# 2. Setup environment
cp .env.example .env.local
# Add your MongoDB connection string to DATABASE_URL

# 3. Initialize database
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

# 4. Run
npm run dev

# 5. Visit
# http://localhost:3000
```

## Default Credentials
```
Email: admin@cryptovault.com
Password: change-me-in-production
```

## File Structure Quick Reference

```
app/                    # Pages and API routes
├── page.tsx            # Homepage
├── login/              # Login page
├── register/           # Registration
├── forgot-password/    # Password recovery
├── reset-password/     # Password reset
├── dashboard/          # User pages
│   ├── page.tsx
│   ├── deposit/
│   ├── withdraw/
│   └── transactions/
├── admin/              # Admin pages
│   ├── page.tsx
│   ├── users/
│   └── transactions/
└── api/                # API endpoints
    ├── auth/
    ├── admin/
    ├── deposits/
    ├── withdrawals/
    ├── user/
    ├── crypto/
    └── partners/

components/             # Reusable components
lib/                    # Utilities
├── constants.ts        # Config (single point of truth)
├── db.ts               # Prisma client
├── auth.ts             # Auth helpers
└── crypto-api.ts       # CoinGecko integration

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seeding script
```

## Key URLs

| URL | Purpose |
|-----|---------|
| `/` | Homepage |
| `/login` | User login |
| `/register` | New user registration |
| `/forgot-password` | Password recovery |
| `/reset-password?token=...` | Password reset with token |
| `/dashboard` | User dashboard |
| `/dashboard/deposit` | Make a deposit |
| `/dashboard/withdraw` | Withdraw crypto |
| `/dashboard/transactions` | Transaction history |
| `/admin` | Admin dashboard |
| `/admin/users` | Manage users |
| `/admin/transactions` | Transaction approval |

## Environment Variables Checklist

```env
✓ DATABASE_URL          # MongoDB connection string
✓ NEXT_PUBLIC_APP_URL   # Your domain URL
○ COINGECKO_API_URL     # Usually doesn't need change
○ EMAIL_SERVICE         # For password reset emails
○ EMAIL_USER            # Email account
○ EMAIL_PASS            # Email password
○ SALT                  # Security salt (generate random)
```

## Common Tasks

### Add a New Partner Exchange
```typescript
// Directly in MongoDB or via seed script
await prisma.partner.create({
  data: {
    name: "Exchange Name",
    logo: "https://...",
    url: "https://...",
    isActive: true,
    order: 6
  }
})
```

### Create Admin User
```bash
npm run prisma:seed
# Or manually create in MongoDB
```

### Approve a Deposit
```typescript
await prisma.deposit.update({
  where: { id: "depositId" },
  data: { status: "approved" }
})
// User balance updated automatically
```

### Reset User Password (As Admin)
```typescript
// Delete their password reset token (if exists)
await prisma.passwordResetToken.deleteMany({
  where: { userId: "userId" }
})
// User must use "Forgot Password" flow
```

### Check Real-time Prices
```
GET /api/crypto/prices
Returns: { bitcoin: { usd: 45000 }, ... }
```

## API Response Format

### Success Response
```json
{
  "status": "success",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Database Query Examples

```typescript
// Get user with balances
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" }
})

// Get pending deposits
const deposits = await prisma.deposit.findMany({
  where: { status: "pending" }
})

// Get user transactions
const transactions = await prisma.transaction.findMany({
  where: { userId: "userId" }
})

// Update user balance
const updatedUser = await prisma.user.update({
  where: { id: "userId" },
  data: {
    btcBalance: 1.5,
    totalDeposited: 50000
  }
})
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "DATABASE_URL not provided" | Add DATABASE_URL to .env.local |
| MongoDB connection error | Check IP whitelist in Atlas |
| Crypto prices not loading | Check network tab, CoinGecko API status |
| Admin can't login | Verify email is admin@cryptovault.com |
| Password reset not working | Check DATABASE_URL connection |
| Partners carousel not showing | Verify partners exist in database |

## Security Reminders

⚠️ Change default admin password on first login  
⚠️ Never commit .env.local to Git  
⚠️ Generate secure SALT value for production  
⚠️ Use HTTPS in production  
⚠️ Keep MongoDB IP whitelist restricted  
⚠️ Backup database regularly  
⚠️ Monitor admin activity logs  

## Performance Tips

- Crypto prices cached on client (updates every 10s)
- Database indexes on email and userId for faster queries
- API responses are lightweight JSON
- Images optimized and lazy-loaded
- Animations use GPU acceleration
- Build optimized with Tailwind v4

## Deployment in 10 Minutes

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Click "Deploy"
5. Done!

See PRODUCTION_SETUP.md for detailed steps.

## Support & Resources

- 📖 README.md - Project overview
- 📋 PRODUCTION_SETUP.md - Deployment guide
- ✅ DEPLOYMENT_CHECKLIST.md - Pre-launch checklist
- 🔧 This file - Quick reference

## Version Info

- Next.js: 16.0.10
- React: 19.2.0
- MongoDB: Any version (via Prisma)
- Node: 18+

---

**Happy coding! 🚀**

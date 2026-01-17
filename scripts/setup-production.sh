#!/bin/bash

# CryptoVault Production Setup Script
# Run this after deploying to production

set -e

echo "🚀 CryptoVault Production Setup"
echo "================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found"
    echo "Please copy .env.example to .env.local and configure it first"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding initial data..."
npm run prisma:seed

echo "🏗️  Building application..."
npm run build

echo ""
echo "✅ Production setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Verify all environment variables in .env.local"
echo "2. Test admin login: admin@cryptovault.com"
echo "3. Change admin password immediately"
echo "4. Configure email service for password resets"
echo "5. Setup monitoring and backups"
echo "6. Review security settings"
echo ""
echo "🚀 To start: npm start"

# Trading DZ Platform - Complete Setup Guide

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Backend Setup](#backend-setup)
3. [Website Setup](#website-setup)
4. [Database Configuration](#database-configuration)
5. [Payment Integration](#payment-integration)
6. [Telegram Integration](#telegram-integration)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Monitoring](#monitoring)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Trading DZ Platform                      │
└─────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼─────┐  ┌────▼──────┐  ┌───▼────────┐
         │  Customer   │  │  Admin     │  │ Telegram   │
         │  Website    │  │  Dashboard │  │   Bot      │
         │  (React)    │  │  (React)   │  │  (Node)    │
         └──────┬──────┘  └────┬───────┘  └───┬────────┘
                │              │             │
                └──────────────┼─────────────┘
                               │
                        ┌──────▼──────┐
                        │  Backend     │
                        │  (Express)   │
                        └──────┬───────┘
                               │
                        ┌──────▼──────┐
                        │ PostgreSQL   │
                        │  Database    │
                        └──────────────┘
```

### Components

**Frontend (Customer Website)**

- React 18 + Vite
- Location: `/website`
- Port: 3000
- Features: Auth, Dashboard, Payments, Referrals

**Admin Dashboard**

- React 18
- Location: `/frontend`
- Port: 3001 (configurable)
- Features: User management, Payment verification, Analytics

**Backend API**

- Node.js + Express
- Location: `/backend`
- Port: 5000
- Features: Authentication, User management, Payments, Referrals, Commissions

**Database**

- PostgreSQL
- Sequelize ORM
- Models: User, Payment, Referral, Commission, Withdrawal, AdminLog

---

## 🚀 Backend Setup

### Prerequisites

```bash
Node.js 16+
PostgreSQL 12+
npm or yarn
```

### Installation

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_dz
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_min_32_chars_required_here
JWT_EXPIRY=24h

# Email (optional for verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Wallet
ADMIN_WALLET_ADDRESS=0x22951c64910503f0825fd15667918c6bf0dce1ed

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=your_channel_id
```

4. **Setup database**

```bash
# Create database
createdb trading_dz

# Run migrations (if using Sequelize migrations)
npx sequelize-cli db:migrate
```

5. **Start backend**

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Backend will be running at `http://localhost:5000`

### Verify Backend

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "OK" }
```

---

## 💻 Website Setup

### Prerequisites

```bash
Node.js 16+
npm or yarn
Backend running on port 5000
```

### Installation

1. **Navigate to website directory**

```bash
cd website
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env.development**

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Trading DZ
```

4. **Start development server**

```bash
npm run dev
```

Website will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
# Output in dist/ directory
```

### Environment Variables

**Development (.env.development)**

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Trading DZ
```

**Production (.env.production)**

```env
VITE_API_URL=https://api.tradingdz.com/api
VITE_APP_NAME=Trading DZ
```

---

## 🗄️ Database Configuration

### PostgreSQL Setup

1. **Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

2. **Create database and user**

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE trading_dz;

-- Create user
CREATE USER trading_dz_user WITH PASSWORD 'secure_password';

-- Grant privileges
ALTER ROLE trading_dz_user SET client_encoding TO 'utf8';
ALTER ROLE trading_dz_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE trading_dz_user SET default_transaction_deferrable TO on;
ALTER ROLE trading_dz_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE trading_dz TO trading_dz_user;

-- Connect to database
\c trading_dz

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO trading_dz_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO trading_dz_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO trading_dz_user;
```

3. **Database Models**

The following tables are created automatically by Sequelize:

- **Users** - User accounts and profiles
- **Payments** - Payment records and transactions
- **Referrals** - Referral relationships
- **Commissions** - Commission records
- **Withdrawals** - Withdrawal requests
- **AdminLogs** - Admin action logs

---

## 💳 Payment Integration

### USDT Wallet Configuration

1. **Set wallet address in backend .env**

```env
ADMIN_WALLET_ADDRESS=0x22951c64910503f0825fd15667918c6bf0dce1ed
```

2. **Payment Flow**
   - User sends 250 USDT to wallet
   - User submits transaction ID
   - Admin verifies transaction via blockchain explorer
   - Backend marks subscription as "Active"
   - User gains access to dashboard and Telegram

### Supported Blockchains

- **Ethereum (ERC20)**
- **Tron (TRC20)**
- **Binance Smart Chain (BEP20)**

### Manual Verification Steps

1. Visit blockchain explorer:
   - Etherscan (ERC20): https://etherscan.io
   - TronScan (TRC20): https://tronscan.org
   - BscScan (BEP20): https://bscscan.com

2. Search for transaction ID

3. Verify:
   - Recipient: `0x22951c64910503f0825fd15667918c6bf0dce1ed`
   - Amount: 250 USDT
   - Status: Confirmed

4. Approve in admin dashboard

### Automated Verification (Future)

For automated verification, implement Blockchain API:

- Etherscan API
- TronGrid API
- QuickNode

---

## 🤖 Telegram Integration

### Setup Bot

1. **Create Telegram Bot**
   - Message @BotFather on Telegram
   - Follow prompts to create bot
   - Copy bot token

2. **Configure Backend**

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here
```

3. **Create Channel**
   - Create private Telegram channel
   - Add bot as admin
   - Get channel ID

### Bot Features

```python
# Example bot commands
/start - Get channel invite link
/stats - View referral stats
/earnings - Check earnings
/withdraw - Withdraw request
/support - Contact support
```

### Send Invite Link

When user completes payment:

```javascript
// Backend sends this via API
const inviteLink = await telegram.createChatInviteLink(channelId);
sendToUser(inviteLink);
```

---

## 🚢 Deployment

### Option 1: Vercel (Recommended for Frontend)

**Deploy Website**

```bash
npm install -g vercel
cd website
vercel
```

Environment variables in Vercel dashboard:

```
VITE_API_URL=https://api.tradingdz.com/api
```

### Option 2: Heroku (Backend)

**Deploy Backend**

```bash
# Login to Heroku
heroku login

# Create app
heroku create trading-dz-api

# Set environment variables
heroku config:set DB_HOST=your_db_host
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Option 3: Docker (Full Stack)

**Create docker-compose.yml**

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: trading_dz
      POSTGRES_USER: trading_dz_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_USER: trading_dz_user
      DB_PASSWORD: secure_password
      JWT_SECRET: your_secret
    depends_on:
      - postgres

  website:
    build: ./website
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:5000/api

volumes:
  postgres_data:
```

**Run with Docker**

```bash
docker-compose up -d
```

---

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run tests
npm test

# Test coverage
npm run test:coverage
```

### API Testing with Postman

1. **Import API Collection**
   - File: `backend/postman_collection.json`

2. **Register User**

   ```
   POST /api/auth/register
   Body: {
     "fullName": "Test User",
     "email": "test@example.com",
     "password": "Password123",
     "phoneNumber": "+1234567890",
     "country": "USA"
   }
   ```

3. **Login**

   ```
   POST /api/auth/login
   Body: {
     "email": "test@example.com",
     "password": "Password123"
   }
   ```

4. **Create Payment**
   ```
   POST /api/payments
   Headers: { "Authorization": "Bearer {token}" }
   Body: {
     "amount": 250,
     "paymentMethod": "Crypto",
     "type": "First Payment",
     "transactionId": "0x..."
   }
   ```

### Frontend Testing

```bash
cd website

# Run tests
npm test

# Test coverage
npm run test:coverage
```

---

## 📊 Monitoring

### Backend Monitoring

1. **Log Files**

```bash
# View logs
tail -f backend/logs/app.log
```

2. **Health Check**

```bash
curl http://localhost:5000/api/health
```

3. **Database Queries**

```sql
-- Check active connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Performance Metrics

Monitor these KPIs:

- User registrations per day
- Payment conversion rate
- Average time to payment verification
- Referral activation rate
- Withdrawal requests per day

### Error Monitoring

Use services like:

- **Sentry** - Error tracking
- **LogRocket** - Frontend monitoring
- **DataDog** - Full stack monitoring

---

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Failed**

```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U trading_dz_user -d trading_dz -h localhost
```

**JWT Token Invalid**

```bash
# Regenerate secret in .env
JWT_SECRET=new_random_secret_32_chars_minimum

# Restart backend
npm run dev
```

**Port Already in Use**

```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Frontend Issues

**CORS Error**

```
Access to XMLHttpRequest blocked by CORS policy
```

Solution: Backend must have CORS enabled

```javascript
// In backend/server.js
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

**API Timeout**

```
Request timeout at http://localhost:5000/api/...
```

Solution: Check backend is running

```bash
curl http://localhost:5000/api/health
```

**Token Expired**

```
{ "error": "Token expired" }
```

Solution: User must login again

```javascript
// Clear localStorage and redirect to /login
localStorage.clear();
window.location.href = "/login";
```

### Database Issues

**Connection Pool Exhausted**

```
connect ECONNREFUSED 127.0.0.1:5432
```

Solution: Increase pool size in backend/config/config.js

```javascript
pool: {
  max: 10,
  min: 2,
  acquire: 30000,
  idle: 10000
}
```

---

## 🔒 Security Checklist

Before production:

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup CSRF protection
- [ ] Enable helmet.js for headers
- [ ] Configure environment variables
- [ ] Setup database backups
- [ ] Enable admin 2FA
- [ ] Configure firewall rules
- [ ] Setup monitoring and logging
- [ ] Run security audit
- [ ] Update all dependencies

---

## 📞 Support

For issues or questions:

- **Email**: support@tradingdz.com
- **Telegram**: @TradingDZSupport
- **Documentation**: https://docs.tradingdz.com

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready

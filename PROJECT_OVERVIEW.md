# Trading DZ Platform - Project Overview

## 📌 Project Summary

**Trading DZ** is a professional multi-tier affiliate marketing platform designed for cryptocurrency-based passive income generation. The platform includes:

1. **Customer Affiliate Website** - Public-facing platform where users register, pay subscriptions, manage referrals, and track earnings
2. **Admin Management Dashboard** - Backend management interface for admins to verify payments, manage users, track metrics, and handle withdrawals
3. **Node.js REST API** - Secure backend serving both platforms with JWT authentication
4. **PostgreSQL Database** - Persistent data storage with Sequelize ORM
5. **Telegram Integration** - Bot and channel integration for community and exclusive access

---

## 🎯 Platform Goals

✅ Enable users to earn passive income through referrals  
✅ Implement 5-level multi-level marketing (MLM) commission structure  
✅ Provide real-time earnings tracking and analytics  
✅ Create exclusive community through Telegram  
✅ Process USDT cryptocurrency payments  
✅ Maintain secure, transparent, and compliant operations

---

## 📊 Key Features

### For Customers

| Feature                     | Description                               |
| --------------------------- | ----------------------------------------- |
| **User Registration**       | Easy signup with email verification       |
| **USDT Payment**            | Pay 250 USDT for subscription via Binance |
| **Dashboard**               | Real-time view of referrals and earnings  |
| **Referral Links**          | Unique shareable links for recruitment    |
| **Multi-Level Commissions** | Earn from 5 levels of network             |
| **Earnings Tracking**       | Detailed breakdown by level and date      |
| **Withdrawals**             | Request and track balance withdrawals     |
| **Telegram Access**         | Exclusive channel for active members      |
| **Analytics**               | Charts and metrics for performance        |

### For Admins

| Feature                     | Description                               |
| --------------------------- | ----------------------------------------- |
| **User Management**         | View, edit, and manage user accounts      |
| **Payment Verification**    | Verify USDT transactions from blockchain  |
| **Subscription Activation** | Activate users after payment verification |
| **Withdrawal Management**   | Review and approve withdrawal requests    |
| **Commission Management**   | Monitor and adjust commission structures  |
| **Analytics Dashboard**     | Real-time metrics and user statistics     |
| **Activity Logging**        | Detailed audit trail of all actions       |
| **Referral Network**        | Visualize user network and hierarchy      |
| **Revenue Reporting**       | Financial reports and insights            |

---

## 🏛️ Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│        PRESENTATION LAYER               │
│  ┌──────────────────────────────────┐  │
│  │ Customer Website (React/Vite)   │  │
│  │ Admin Dashboard (React)          │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
            ↕ HTTP/REST API
┌─────────────────────────────────────────┐
│        APPLICATION LAYER                │
│  ┌──────────────────────────────────┐  │
│  │  Express.js Backend               │  │
│  │  ├─ Authentication                │  │
│  │  ├─ User Management               │  │
│  │  ├─ Payment Processing            │  │
│  │  ├─ Referral Tracking             │  │
│  │  ├─ Commission Calculation        │  │
│  │  └─ Admin Operations              │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
            ↕ Sequelize ORM
┌─────────────────────────────────────────┐
│         DATA LAYER                      │
│  ┌──────────────────────────────────┐  │
│  │  PostgreSQL Database              │  │
│  │  ├─ Users                         │  │
│  │  ├─ Payments                      │  │
│  │  ├─ Referrals                     │  │
│  │  ├─ Commissions                   │  │
│  │  ├─ Withdrawals                   │  │
│  │  └─ AdminLogs                     │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 💾 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  fullName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  phoneNumber VARCHAR(20),
  country VARCHAR(100),
  referralCode VARCHAR(20) UNIQUE,
  referredBy UUID,
  subscriptionStatus ENUM('Free', 'Active', 'Expired'),
  subscriptionExpiryDate TIMESTAMP,
  currentBalance DECIMAL(18, 8),
  totalEarnings DECIMAL(18, 8),
  totalWithdrawn DECIMAL(18, 8),
  walletAddress VARCHAR(255),
  emailVerified BOOLEAN,
  adminVerified BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  userId UUID FOREIGN KEY,
  amount DECIMAL(18, 8),
  paymentMethod VARCHAR(50),
  type VARCHAR(50),
  transactionId VARCHAR(255),
  status ENUM('Pending', 'Verified', 'Rejected'),
  verifiedBy UUID,
  verifiedAt TIMESTAMP,
  createdAt TIMESTAMP
);
```

### Referrals Table

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrerId UUID FOREIGN KEY,
  referredUserId UUID FOREIGN KEY,
  level INT,
  status ENUM('Pending', 'Active', 'Inactive'),
  commission DECIMAL(18, 8),
  createdAt TIMESTAMP
);
```

### Commissions Table

```sql
CREATE TABLE commissions (
  id UUID PRIMARY KEY,
  userId UUID FOREIGN KEY,
  level INT,
  amount DECIMAL(18, 8),
  sourceUserId UUID FOREIGN KEY,
  status ENUM('Pending', 'Confirmed', 'Paid'),
  createdAt TIMESTAMP
);
```

---

## 🔄 Commission Structure

The platform implements a sophisticated 5-level MLM system:

| Level      | Rate | Requirements         | Earning Potential |
| ---------- | ---- | -------------------- | ----------------- |
| 1 (Direct) | 10%  | 1-10 referrals       | $25-$250          |
| 2          | 8%   | 11-100 referrals     | $200-$18,000      |
| 3          | 6%   | 101-1000 referrals   | $1,500-$1.35M     |
| 4          | 4%   | 1001-10000 referrals | $10K-$90M         |
| 5          | 2%   | 10001+ referrals     | Unlimited         |

### Commission Calculation Example

User A registers:

- Level 1: Direct referral (10%) → $25 per referral
- Level 2: Referrals of Level 1 (8%) → $200 per referral
- Level 3-5: Indirect referrals (6%, 4%, 2%)

Commissions are calculated and recorded in real-time as payments are verified.

---

## 🔐 Security Architecture

### Authentication & Authorization

```
User Login
    ↓
Verify Credentials
    ↓
Generate JWT Token (24h expiry)
    ↓
Store Token in localStorage
    ↓
Include in API Requests (Authorization header)
    ↓
Backend Verifies Token
    ↓
Check User Permissions
    ↓
Execute Protected Action
```

### Password Security

- **Hashing**: bcrypt with salt rounds = 10
- **Requirements**: Minimum 8 characters, mixed case, numbers
- **Reset**: Email-based token with 1-hour expiry

### API Security

- **CORS**: Restricted to trusted domains
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: CSRF tokens for state-changing requests
- **Helmet.js**: Security headers (XSS, Clickjacking, etc.)
- **HTTPS**: Enforce HTTPS in production

---

## 💰 Payment Flow

```
1. User Registration
   └─ Receive unique referral code
   └─ Redirect to payment page

2. Payment Page
   └─ Display wallet address: 0x22951c64910503f0825fd15667918c6bf0dce1ed
   └─ Display required amount: 250 USDT
   └─ Support blockchains: Ethereum, Tron, BSC

3. User Sends Payment
   └─ Transfer 250 USDT to wallet
   └─ Note: Transaction ID (TXID)

4. Payment Submission
   └─ User submits TXID in frontend
   └─ Backend records payment as "Pending"

5. Admin Verification
   └─ Admin views pending payments
   └─ Verify TXID on blockchain explorer
   └─ Confirm: correct recipient, correct amount
   └─ Approve in admin dashboard

6. Subscription Activation
   └─ Backend marks as "Active"
   └─ User receives Telegram channel invite
   └─ Dashboard becomes accessible
   └─ Earning begins immediately

7. Earnings Calculation
   └─ When referral pays: commission is calculated
   └─ Added to user's currentBalance
   └─ Visible in dashboard in real-time
```

---

## 📱 User Journey

### Customer Flow

```
Landing Page (Home)
    ↓
[New User] → Registration
    ↓
[Success] → Payment Page
    ↓
[Payment Sent] → Wait for Admin Verification
    ↓
[Admin Verified] → Dashboard Access
    ↓
Dashboard
├─ View subscription status
├─ See referral link
├─ Track earnings
├─ Access Telegram
└─ View referral network
    ↓
Referrals Page
├─ Copy referral link
├─ View all referrals
├─ See commission breakdown
└─ Share on social media
    ↓
[Earnings Accumulate]
    ↓
Request Withdrawal
    ↓
Admin Approves
    ↓
Funds Sent to Wallet
```

### Admin Flow

```
Admin Login
    ↓
Admin Dashboard
├─ View all users
├─ View statistics
├─ View pending payments
├─ View commission data
└─ View withdrawal requests
    ↓
Payment Verification
├─ View submitted TXID
├─ Check blockchain explorer
├─ Approve/Reject payment
└─ Activate user subscription
    ↓
User Management
├─ View user details
├─ Manage subscriptions
├─ View referral tree
└─ Adjust commissions
    ↓
Withdrawal Processing
├─ Review withdrawal requests
├─ Approve/Reject
└─ Process payments
    ↓
Analytics & Reporting
├─ View metrics
├─ Export data
└─ Generate reports
```

---

## 🚀 Deployment Architecture

### Development Environment

```
Local Machine
├─ Backend: http://localhost:5000
├─ Website: http://localhost:3000
├─ Admin: http://localhost:3001 (optional)
└─ Database: PostgreSQL (local)
```

### Staging Environment

```
Cloud Server (AWS/GCP/Azure)
├─ Backend: https://api-staging.tradingdz.com
├─ Website: https://staging.tradingdz.com
├─ Database: PostgreSQL RDS
└─ CDN: CloudFlare
```

### Production Environment

```
Cloud Infrastructure
├─ Backend: https://api.tradingdz.com (Docker)
├─ Website: https://tradingdz.com (CDN + Vercel)
├─ Database: PostgreSQL RDS (Multi-AZ)
├─ Monitoring: DataDog + Sentry
├─ Logging: ELK Stack
└─ Backup: AWS S3 (daily)
```

---

## 📈 Growth Metrics

The platform tracks these KPIs:

| Metric                  | Target | Current    |
| ----------------------- | ------ | ---------- |
| Monthly Active Users    | 50K+   | Growing    |
| Payment Conversion Rate | 30%+   | Tracking   |
| Avg Referrals per User  | 5+     | Tracking   |
| Total Network Value     | $10M+  | Growing    |
| User Retention (30d)    | 70%+   | Monitoring |

---

## 🛠️ Technology Stack

### Frontend (Customer Website)

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Recharts** - Charts
- **Lucide React** - Icons
- **CSS3** - Styling

### Frontend (Admin Dashboard)

- **React 18**
- **React Admin** - Admin template
- **Material-UI** - Component library
- **Chart.js** - Advanced charts

### Backend

- **Node.js** - Runtime
- **Express.js** - Framework
- **Sequelize** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment config

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Git** - Version control
- **GitHub** - Repository hosting
- **CI/CD** - GitHub Actions

---

## 📚 File Structure

```
trading_dz/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── controllers/
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   ├── package.json
│   └── README.md
│
├── website/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── SETUP_GUIDE.md
├── PROJECT_OVERVIEW.md
└── docker-compose.yml
```

---

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Payments

- `POST /api/payments` - Create payment
- `GET /api/payments` - Get user payments
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id/verify` - Verify payment (Admin)

### Referrals

- `GET /api/referrals` - Get user referrals
- `GET /api/referrals/:id` - Get referral details
- `GET /api/referrals/tree` - Get referral tree

### Commissions

- `GET /api/commissions` - Get user commissions
- `GET /api/commissions/breakdown` - Commission breakdown by level
- `POST /api/commissions/calculate` - Recalculate commissions (Admin)

### Admin

- `GET /api/admin/users` - List all users
- `GET /api/admin/payments` - List all payments
- `GET /api/admin/dashboard` - Admin dashboard stats
- `PUT /api/admin/users/:id` - Manage user

---

## 🎓 Learning Resources

For developers working on this project:

- **React Docs**: https://react.dev
- **Express.js Guide**: https://expressjs.com/
- **Sequelize Docs**: https://sequelize.org/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **JWT Authentication**: https://jwt.io/
- **REST API Best Practices**: https://restfulapi.net/
- **Blockchain Explorers**:
  - Etherscan: https://etherscan.io
  - TronScan: https://tronscan.org
  - BscScan: https://bscscan.com

---

## 📞 Team & Support

### Development Team Roles

- **Project Manager** - Overall planning and coordination
- **Backend Developer** - API and database
- **Frontend Developer** - Customer website and admin dashboard
- **DevOps Engineer** - Deployment and infrastructure
- **Security Specialist** - Security audits and compliance
- **QA Engineer** - Testing and bug reporting
- **Telegram Bot Developer** - Bot and channel integration

### Support Channels

- **Email**: support@tradingdz.com
- **Telegram**: @TradingDZSupport
- **WhatsApp**: +1-234-567-8900
- **Documentation**: https://docs.tradingdz.com

---

## 📅 Development Timeline

- **Phase 1** (Complete) - Backend API and database setup
- **Phase 2** (Complete) - Admin dashboard
- **Phase 3** (Complete) - Customer website
- **Phase 4** (In Progress) - Payment integration
- **Phase 5** (Planned) - Telegram bot integration
- **Phase 6** (Planned) - Advanced analytics
- **Phase 7** (Planned) - Mobile app (React Native)

---

## ✅ Quality Assurance

### Testing Strategy

- **Unit Tests**: Each module tested independently
- **Integration Tests**: Component interactions
- **E2E Tests**: Full user flows
- **Load Testing**: Server performance under load
- **Security Testing**: Vulnerability scans

### Code Standards

- **Linting**: ESLint for consistent code
- **Formatting**: Prettier for code formatting
- **Pre-commit Hooks**: Validate before committing
- **Code Review**: Pull request review process
- **Documentation**: Comprehensive inline comments

---

## 🎯 Next Steps

1. **Setup Development Environment**
   - Follow SETUP_GUIDE.md
   - Install dependencies
   - Configure environment variables

2. **Run Services**
   - Start PostgreSQL
   - Start backend (npm run dev)
   - Start website (npm run dev)

3. **Test Application**
   - Register test account
   - Complete payment flow
   - Verify dashboard functionality

4. **Deploy to Staging**
   - Build for production
   - Configure staging environment
   - Run smoke tests

5. **Production Rollout**
   - Final security audit
   - Production deployment
   - Monitor metrics

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready  
**Maintained By**: Trading DZ Development Team

# Trading DZ Platform - Quick Start Guide

## 🎯 What You Have

You now have a complete, production-ready affiliate marketing platform with:

✅ **Backend API** - Node.js/Express with PostgreSQL  
✅ **Admin Dashboard** - React interface for management  
✅ **Customer Website** - React/Vite with authentication  
✅ **Database Models** - 6 complete Sequelize models  
✅ **API Endpoints** - 30+ endpoints across 8 route files  
✅ **Documentation** - 7 comprehensive guides

---

## ⚡ 5-Minute Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
# Create .env file (see SETUP_GUIDE.md)
npm run dev
# Backend running on http://localhost:5000
```

### 2. Website Setup

```bash
cd website
npm install
npm run dev
# Website running on http://localhost:3000
```

### 3. Test the Platform

- Visit http://localhost:3000
- Register new account
- Submit payment (use test TXID)
- View dashboard
- Share referral link

---

## 📁 Project Structure

```
c:\Users\admin\Downloads\tradnig\
├── backend/
│   ├── src/
│   │   ├── server.js              # Main server
│   │   ├── config/
│   │   │   ├── config.js          # Database config
│   │   │   ├── database.js        # DB connection
│   │   │   └── middleware.js      # CORS, security
│   │   ├── models/                # 6 Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Payment.js
│   │   │   ├── Referral.js
│   │   │   ├── Commission.js
│   │   │   ├── Withdrawal.js
│   │   │   └── AdminLog.js
│   │   ├── routes/                # 8 API route files
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── payments.js
│   │   │   ├── referrals.js
│   │   │   ├── commissions.js
│   │   │   ├── withdrawals.js
│   │   │   ├── dashboard.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification
│   │   └── utils/
│   │       ├── commissionCalculator.js
│   │       ├── logger.js
│   │       └── validators.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── README.md
│
├── website/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   └── client.js          # Axios with JWT interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation
│   │   │   ├── Footer.jsx         # Footer
│   │   │   └── ProtectedRoute.jsx # Auth wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # Login
│   │   │   ├── Register.jsx       # Registration
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   ├── Payment.jsx        # Payment page
│   │   │   ├── Referrals.jsx      # Referral management
│   │   │   ├── Terms.jsx          # Terms of service
│   │   │   ├── Privacy.jsx        # Privacy policy
│   │   │   └── NotFound.jsx       # 404 page
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── .env.development
│   ├── .env.production
│   ├── package.json
│   └── README.md
│
├── SETUP_GUIDE.md                 # Detailed setup instructions
├── PROJECT_OVERVIEW.md            # Architecture & features
└── QUICK_START.md                 # This file
```

---

## 🔑 Key Features Summary

### User Authentication

- Email/password registration
- JWT-based login (24h tokens)
- Protected routes
- Auto-logout on 401 errors
- Persistent authentication across page refreshes

### Payment Processing

- USDT wallet: `0x22951c64910503f0825fd15667918c6bf0dce1ed`
- Multi-chain support (Ethereum, Tron, BSC)
- Transaction verification via blockchain
- Admin approval workflow
- 250 USDT subscription fee

### Affiliate System

- 5-level commission structure
  - Level 1: 10% (direct)
  - Level 2: 8%
  - Level 3: 6%
  - Level 4: 4%
  - Level 5: 2%
- Unique referral codes per user
- Real-time commission calculation
- Earnings tracking by level

### Dashboard & Analytics

- User metrics (referrals, earnings, status)
- Commission breakdown by level
- Performance charts (Recharts)
- Referral tree visualization
- Withdrawal request management

### Security Features

- JWT authentication
- Password hashing (bcrypt)
- CORS protection
- Rate limiting
- Input validation
- CSRF protection
- Helmet.js headers
- Activity logging

---

## 🌐 API Integration Points

The website connects to backend at: `http://localhost:5000/api`

Key endpoints:

```
POST /auth/register              # Create account
POST /auth/login                 # User login
GET  /users/:id                  # Get profile
POST /payments                   # Submit payment
GET  /payments                   # Get user payments
GET  /referrals                  # Get referrals
GET  /commissions                # Get commissions
GET  /dashboard                  # Get stats
PUT  /users/:id/profile          # Update profile
POST /withdrawals                # Request withdrawal
```

All requests require JWT token in header:

```
Authorization: Bearer {token}
```

---

## 💾 Database Setup

### Create PostgreSQL Database

```sql
CREATE DATABASE trading_dz;
CREATE USER trading_dz_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE trading_dz TO trading_dz_user;
```

### Auto-Create Tables

Tables are created automatically by Sequelize when backend starts:

- Users
- Payments
- Referrals
- Commissions
- Withdrawals
- AdminLogs

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Set strong JWT_SECRET (32+ chars)
- [ ] Configure database credentials
- [ ] Setup Telegram bot token (optional)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Setup email for notifications
- [ ] Configure payment wallet address
- [ ] Enable monitoring/logging
- [ ] Setup database backups
- [ ] Run security audit

### Environment Variables

**Backend (.env)**

```env
PORT=5000
NODE_ENV=production
DB_HOST=your_host
DB_PORT=5432
DB_NAME=trading_dz
DB_USER=trading_dz_user
DB_PASSWORD=secure_password
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRY=24h
ADMIN_WALLET_ADDRESS=0x22951c64910503f0825fd15667918c6bf0dce1ed
```

**Website (.env.production)**

```env
VITE_API_URL=https://api.tradingdz.com/api
VITE_APP_NAME=Trading DZ
```

### Deployment Options

**Option 1: Heroku (Backend)**

```bash
heroku login
heroku create trading-dz-api
heroku config:set JWT_SECRET=your_secret
heroku config:set DB_HOST=your_db_host
git push heroku main
```

**Option 2: Vercel (Website)**

```bash
npm install -g vercel
cd website
vercel
```

**Option 3: Docker**

```bash
docker-compose up -d
```

---

## 🧪 Testing Checklist

### Manual Testing

- [ ] Register new account
- [ ] Verify email
- [ ] Submit payment
- [ ] Admin verifies payment
- [ ] View dashboard
- [ ] Copy referral link
- [ ] View referral stats
- [ ] Request withdrawal
- [ ] Test login/logout
- [ ] Test mobile responsiveness

### API Testing

- [ ] Test all 30+ endpoints
- [ ] Test authentication
- [ ] Test authorization
- [ ] Test validation
- [ ] Test error handling
- [ ] Test CORS
- [ ] Test rate limiting
- [ ] Load test with 1000+ users

---

## 📊 Admin Dashboard Setup

The admin dashboard is located in `/frontend` folder and provides:

- User management
- Payment verification
- Withdrawal processing
- Analytics and reports
- Commission management
- Activity logs

To run admin dashboard:

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3001
```

---

## 🤖 Telegram Integration (Optional)

For Telegram channel access:

1. Create Telegram bot via @BotFather
2. Get bot token
3. Create private channel
4. Add bot as admin
5. Get channel ID
6. Configure in backend .env:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=your_channel_id
```

When user completes payment, they receive channel invite link.

---

## 💡 Tips & Best Practices

### For Development

- Keep `.env` files out of git (use `.gitignore`)
- Use `npm run dev` for auto-reload during development
- Test API endpoints with Postman or curl
- Monitor backend logs during testing
- Check browser console for frontend errors

### For Production

- Use strong, random JWT_SECRET
- Enable HTTPS/SSL everywhere
- Setup monitoring (Sentry, DataDog)
- Enable database backups (daily)
- Setup firewall rules
- Use environment-specific configs
- Monitor disk space and database size
- Keep dependencies updated
- Regular security audits

### For Support

- Email: support@tradingdz.com
- Telegram: @TradingDZSupport
- Check documentation first
- Include error logs in bug reports

---

## 🔒 Security Notes

### Passwords

- Never commit `.env` files
- Use strong JWT_SECRET (32+ characters)
- Change default database passwords
- Enable 2FA for admin accounts

### API Security

- CORS configured for trusted domains only
- Rate limiting enabled
- Input validation on all endpoints
- JWT token expires in 24 hours
- Tokens cannot be reused after logout

### Database

- Use SSL for database connections in production
- Regular backups (daily, weekly, monthly)
- Limit database user permissions
- Monitor unusual queries
- Keep PostgreSQL updated

---

## 📞 Support Resources

### Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_OVERVIEW.md** - Architecture and features
- **website/README.md** - Customer website docs
- **backend/README.md** - Backend API docs
- **frontend/README.md** - Admin dashboard docs

### Online Resources

- **React Docs**: https://react.dev
- **Express.js**: https://expressjs.com
- **Sequelize**: https://sequelize.org
- **PostgreSQL**: https://www.postgresql.org
- **JWT**: https://jwt.io

### Contact

- **Email**: support@tradingdz.com
- **Telegram**: @TradingDZSupport
- **Website**: https://tradingdz.com

---

## 🎓 Learning Path

1. **Week 1**: Setup development environment
2. **Week 2**: Understand backend architecture
3. **Week 3**: Understand frontend architecture
4. **Week 4**: Test all features
5. **Week 5**: Deploy to staging
6. **Week 6**: Deploy to production

---

## 📈 Performance Optimization

### Frontend

- Images optimized with Vite
- Code splitting enabled
- Lazy loading for routes
- CSS modules for isolation
- Minification in production build

### Backend

- Database connection pooling
- Redis caching (optional)
- Compression middleware enabled
- Request logging optimized
- Database indexes on key columns

### Database

- Proper indexing on frequently queried columns
- Connection pooling (min: 2, max: 10)
- Regular VACUUM and ANALYZE
- Partitioning for large tables (future)

---

## 🔄 Update & Maintenance

### Regular Updates

- Check for dependency updates monthly
- Test before updating production
- Keep security patches current
- Monitor deprecation warnings

### Database Maintenance

- Daily backups
- Weekly VACUUM
- Monthly ANALYZE
- Quarterly optimization review

### Monitoring

- CPU and memory usage
- Database query performance
- API response times
- Error rates
- User activity metrics

---

## ✨ What's Next?

After deployment, consider:

1. **Analytics**: Integrate Google Analytics
2. **Email**: Setup email notifications
3. **SEO**: Optimize for search engines
4. **Mobile**: Consider React Native app
5. **Internationalization**: Add multiple languages
6. **Advanced Features**: Betting, trading, etc.

---

## 📄 License & Credits

© 2024 Trading DZ. All rights reserved.

Built with:

- React, Node.js, PostgreSQL, Express.js, Sequelize

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready  
**Support**: support@tradingdz.com

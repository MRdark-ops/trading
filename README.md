# Trading Platform Admin Dashboard

A comprehensive admin dashboard for managing a trading platform with multi-level commission system, user management, referral tracking, payments, and withdrawals.

## 🚀 البدء السريع (Quick Start)

### في 5 دقائق فقط:

```bash
# 1️⃣ شغّل Backend:
cd backend && node mock-server.js

# 2️⃣ شغّل Frontend (في terminal جديد):
cd website && npm run dev

# 3️⃣ افتح:
http://localhost:5173

# 4️⃣ سجل دخول:
البريد: user@tradingdz.com
كلمة المرور: user123456
```

### 📝 الملفات المهمة:
- [QUICK_START_AR.md](QUICK_START_AR.md) - البدء السريع
- [WITHDRAWAL_PAYMENT_GUIDE_AR.md](WITHDRAWAL_PAYMENT_GUIDE_AR.md) - دليل شامل
- [TESTING_GUIDE_AR.md](TESTING_GUIDE_AR.md) - اختبار كامل
- [START_HERE_NOW.md](START_HERE_NOW.md) - ابدأ من هنا

---

## Features

### Dashboard
- Real-time overview of key metrics
- User growth charts
- Top referrers leaderboard
- Revenue and commission tracking

### User Management
- View all users with filters
- Detailed user profiles with statistics
- Edit user information
- Change user status (Active/Suspended/Banned)
- Change user type (External/Internal Member)
- Reset earnings and adjust balance

### Payment Management
- Track all payments and subscriptions
- Manual payment entry
- Payment status updates
- First payment vs renewal tracking

### Referral System
- View referral chains and conversions
- Referral code management
- Top referrer rankings
- Reset referral statistics

### Withdrawal Management
- Real-time pending withdrawals
- Approve/Reject withdrawals
- Mark as paid with transaction hash
- Track withdrawal history

### Commission System (5-Level MLM)
- Level 1: 10% (Up to 10 people)
- Level 2: 8% (11-100 people)
- Level 3: 6% (101-1,000 people)
- Level 4: 4% (1,001-10,000 people)
- Level 5: 2% (10,001-100,000 people)

### Security
- JWT authentication
- Admin-only access control
- Activity logging for all actions
- Two-factor authentication ready

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Sequelize** ORM
- **JWT** for authentication
- **Redis** for real-time stats (optional)

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Recharts** for charts
- **Axios** for API calls

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_platform_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard` - Overview stats
- `GET /api/dashboard/growth` - User growth data
- `GET /api/dashboard/top-referrers` - Top referrers

### Users
- `GET /api/users` - List all users
- `GET /api/users/:userId` - Get user details
- `PUT /api/users/:userId` - Update user
- `PATCH /api/users/:userId/status` - Change status
- `PATCH /api/users/:userId/type` - Change user type
- `POST /api/users/:userId/reset-earnings` - Reset earnings
- `POST /api/users/:userId/adjust-balance` - Adjust balance

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:paymentId` - Get payment details
- `PATCH /api/payments/:paymentId/status` - Update status

### Referrals
- `GET /api/referrals` - List all referrals
- `GET /api/referrals/user/:userId` - User's referrals
- `GET /api/referrals/tree/top` - Top referrer tree
- `POST /api/referrals/:userId/reset` - Reset referrals

### Withdrawals
- `GET /api/withdrawals` - List withdrawals
- `GET /api/withdrawals/pending/list` - Pending only
- `POST /api/withdrawals` - Request withdrawal
- `PATCH /api/withdrawals/:withdrawalId/approve` - Approve
- `PATCH /api/withdrawals/:withdrawalId/reject` - Reject
- `PATCH /api/withdrawals/:withdrawalId/paid` - Mark as paid

### Commissions
- `GET /api/commissions` - List commissions
- `GET /api/commissions/user/:userId` - User's commissions
- `GET /api/commissions/summary/all` - Summary

### Logs
- `GET /api/logs` - Activity logs
- `GET /api/logs/admin/:adminId` - Admin's logs

## Database Schema

The system uses PostgreSQL with the following main tables:
- **users** - User profiles and accounts
- **payments** - Payment records
- **referrals** - Referral relationships
- **commissions** - Commission tracking
- **withdrawals** - Withdrawal requests
- **admin_logs** - Activity audit logs

## Usage

1. Start the backend server (runs on port 5000)
2. Start the frontend dev server (runs on port 3000)
3. Login with admin credentials
4. Navigate through the dashboard to manage platform

## Security Notes

- All sensitive data is encrypted
- Admin actions are logged
- JWT tokens expire after 24 hours
- 2FA can be enabled for additional security
- SQL injection protected via Sequelize ORM
- CORS configured for production

## ✨ الميزات الجديدة (New Features v2.0)

### 🎁 نظام الإحالات المحسّن
- رابط إحالة فريد لكل مستخدم
- **$100 أرباح لكل شخص محضور**
- تتبع فوري للإحالات الجديدة

### 💰 نظام السحب الجديد
- **صفحة منفصلة:** `/withdrawal`
- طلب سحب بسيط وآمن
- حد أدنى: **$100**
- **لا توجد رسوم معالجة (مجاني)**
- وقت معالجة: 24-48 ساعة
- عرض سجل الطلبات السابقة

### 💳 نظام الاشتراك USDT
- **السعر:** 25 USDT/شهر
- **الشبكات:** TRON (TRC-20) أو Binance Smart Chain
- عملية دفع 3 خطوات:
  1. نسخ عنوان المحفظة
  2. إرسال المبلغ والتحقق بـ TX Hash
  3. تأكيد فوري + وصول مميز
- محتوى حصري و VIP

### 🔐 التحقق الآلي من الاشتراك
- يتم الفحص تلقائياً عند تسجيل الدخول
- إعادة توجيه تلقائي إذا انتهى الاشتراك
- إشعارات واضحة عند انتهاء الاشتراك

### 📱 قناة تليجرام الحصرية
- وصول فوري بعد الدفع
- محتوى حصري يومي
- تحديثات سريعة عن المنصة
- تواصل مباشر مع الفريق

### 🎨 تحسينات التصميم
- دعم كامل للعربية (RTL)
- تصميم احترافي ومظلم
- ألوان ذهبية مميزة (#d4af37)
- استجابة كاملة للأجهزة المحمولة
- رسوم توضيحية وأيقونات حديثة

---

## 📁 الملفات الجديدة المضافة

```
src/pages/
├── Withdrawal.jsx              # صفحة السحب مع إحصائيات
├── Withdrawal.css              # أنماط احترافية
├── SubscriptionPayment.jsx     # عملية الدفع 3 خطوات
└── SubscriptionPayment.css     # تصميم الدفع

backend/
└── mock-server.js              # 8 endpoints جديدة للاقتصاد
```

---

## 🔗 API الجديدة

### 💰 السحب:
```
POST   /api/withdrawal/request           # تقديم طلب سحب
GET    /api/withdrawal/requests          # عرض الطلبات السابقة
POST   /api/admin/withdrawal/approve/:id # موافقة الإدارة
POST   /api/admin/withdrawal/reject/:id  # رفض الإدارة
```

### 💳 الدفع:
```
GET    /api/payment/usdt-wallet          # عنوان المحفظة
POST   /api/payment/submit-subscription  # إرسال المبلغ
GET    /api/subscription/status          # فحص الاشتراك
```

### 📊 الإحالات:
```
GET    /api/referrals/user/:userId       # عرض الإحالات
POST   /api/referrals/track              # تتبع إحالة جديدة
GET    /api/admin/withdrawal-requests    # طلبات الإدارة
```

---

## 🧪 اختبار الميزات الجديدة

### حساب مستخدم عادي:
```
البريد: user@tradingdz.com
كلمة المرور: user123456
الأرباح: 300$ (3 إحالات)
```

### اختبار السحب:
1. سجل دخول
2. اذهب إلى `/withdrawal`
3. أدخل عنوان محفظة + المبلغ
4. اضغط إرسال

### اختبار الدفع:
1. اذهب إلى `/subscription-payment`
2. انسخ عنوان المحفظة
3. أدخل TX Hash (يمكن استخدام عشوائي)
4. اضغط تحقق

### التحقق الآلي:
- سجل دخول بعد انتهاء الاشتراك
- سيتم إعادة التوجيه تلقائياً للدفع

---

## 📚 التوثيق الكاملة

للحصول على دليل مفصل بالعربية:
📖 اقرأ: [WITHDRAWAL_PAYMENT_GUIDE_AR.md](./WITHDRAWAL_PAYMENT_GUIDE_AR.md)

---

## Future Enhancements

- Real-time notifications via WebSocket
- Advanced analytics and reporting
- Automated payouts
- Email notifications
- SMS alerts
- Mobile app
- API rate limiting
- Advanced fraud detection
- Multi-language support
- Two-factor authentication
- API documentation with Swagger

## License

Proprietary - All Rights Reserved © 2025

## Support

For issues or questions, contact the development team.
- 📧 support@tradingdz.com
- 💬 @TradingDzSupport (Telegram)

# Trading DZ - Customer Affiliate Platform

Professional affiliate marketing platform for "Trading DZ VIP" - a multi-level commission system with real-time tracking, Telegram integration, and USDT crypto payments.

## 🌟 Features

- **User Authentication** - Secure registration, email verification, and JWT-based login
- **USDT Payments** - Binance USDT integration for subscription activation
- **Multi-Level Commissions** - 5-level affiliate system with decreasing commission rates
- **Real-Time Dashboard** - Track referrals, earnings, and subscription status
- **Referral Management** - Unique referral links, sharing tools, and referral tree visualization
- **Telegram Integration** - Exclusive channel access for active members
- **Responsive Design** - Mobile-first luxury UI with gold and black theme
- **Security** - JWT authentication, XSS protection, CSRF tokens

## 📁 Project Structure

```
website/
├── public/
├── src/
│   ├── api/
│   │   └── client.js                 # Axios HTTP client with JWT interceptors
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation with user menu
│   │   ├── Footer.jsx               # Footer links
│   │   └── ProtectedRoute.jsx       # HOC for authenticated routes
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Home.css
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Auth.css                 # Auth pages styling
│   │   ├── Dashboard.jsx            # User dashboard
│   │   ├── Dashboard.css
│   │   ├── Payment.jsx              # Payment/subscription page
│   │   ├── Payment.css
│   │   ├── Referrals.jsx            # Referral management
│   │   ├── Referrals.css
│   │   ├── NotFound.jsx             # 404 page
│   │   └── NotFound.css
│   ├── App.jsx                      # Main app with routing
│   ├── App.css
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── index.html
├── vite.config.js
├── package.json
├── .env.development
├── .env.production
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend server running on http://localhost:5000
- PostgreSQL database configured

### Installation

```bash
cd website
npm install
```

### Development

```bash
# Start development server (opens at http://localhost:3000)
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔑 Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **CSS3** - Custom styling with gold/black theme

## 🔐 Authentication Flow

1. **Registration** (`/register`)
   - User creates account with full details
   - Automatic login after registration
   - Redirect to payment page

2. **Login** (`/login`)
   - Email and password authentication
   - JWT token stored in localStorage
   - Automatic redirect to dashboard if authenticated

3. **Protected Routes**
   - Dashboard, Payment, and Referrals require authentication
   - Automatic logout on 401 errors
   - Redirect to login if not authenticated

## 💳 Payment Integration

### Subscription Process

1. User registers and completes profile
2. Directed to `/payment` page
3. Shown Binance wallet address: `0x22951c64910503f0825fd15667918c6bf0dce1ed`
4. User sends 250 USDT (ERC20/TRC20/BEP20)
5. User submits transaction ID for verification
6. Backend admin verifies and activates subscription
7. User gains access to Telegram channel and full features

### Payment States

- **Free/Inactive** - Can register but limited access
- **Pending** - Payment submitted, waiting for verification
- **Active** - Full access to all features and Telegram

## 📊 Dashboard Features

### Metrics

- Direct referrals count
- Total earnings
- Paid referrals
- Available balance for withdrawal

### Commission Structure

- **Level 1**: 10% commission (direct referrals)
- **Level 2**: 8% commission (referrals of Level 1)
- **Level 3**: 6% commission (referrals of Level 2)
- **Level 4**: 4% commission (referrals of Level 3)
- **Level 5**: 2% commission (referrals of Level 4)

### Performance Charts

- Bar chart showing earnings per level
- Progress bars toward level targets
- Real-time updates

## 👥 Referral System

### Referral Link

- Unique code per user: `/register?ref={referralCode}`
- One-click copy to clipboard
- Share buttons for Telegram, WhatsApp, Twitter

### Referral Tracking

- View all referrals with details (name, email, level, status, date, earnings)
- Referral hierarchy visualization
- Commission breakdown by level

## 🎨 Design System

### Color Palette

- **Primary Gold**: `#d4af37` - CTAs, highlights, accents
- **Secondary Black**: `#0a0a0a` - Main background
- **Accent Dark**: `#1a1a1a` - Cards, secondary backgrounds
- **Border**: `#333` - Borders and dividers
- **Text**: `#fff` - Primary text
- **Muted**: `#888` - Secondary text
- **Success**: `#2ed573` - Active status
- **Warning**: `#e67e22` - Pending/warning
- **Error**: `#e74c3c` - Errors/inactive

### Typography

- **Headings**: Bold, 600+ weight
- **Body**: Regular weight, 14-16px
- **Labels**: 12px, uppercase, muted color
- **Monospace**: Courier New for wallet addresses and code

### Spacing

- Padding: 16px, 24px, 32px
- Gaps: 8px, 12px, 16px, 20px, 24px
- Border radius: 6px (inputs), 8px (cards), 12px (sections)

## 🔧 API Integration

The website connects to backend endpoints:

### Authentication

- `POST /auth/register` - Create new account
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### User

- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile

### Payments

- `POST /payments` - Create payment record
- `GET /payments/wallet` - Get wallet address for payment

### Referrals

- `GET /referrals/user/:id` - Get user's referrals
- `GET /referrals/:id` - Get referral details

### Commissions

- `GET /commissions/user/:id` - Get commission breakdown by level
- `GET /commissions` - Get all commissions for user

### Dashboard

- `GET /dashboard` - Get overall statistics

## 📱 Responsive Design

- **Desktop** (1024px+): Full grid layouts, 2-3 columns
- **Tablet** (768px-1023px): 2 columns, adjusted spacing
- **Mobile** (<768px): Single column, stacked layouts, mobile-optimized buttons

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTPS** - Force HTTPS in production
- **CSRF Protection** - Token validation on state-changing requests
- **XSS Prevention** - Content escaping and sanitization
- **Password Hashing** - Backend uses bcrypt
- **Rate Limiting** - Backend rate limits authentication attempts
- **Input Validation** - Client and server-side validation

## 🌐 Deployment

### Environment Variables

```env
# Development
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Trading DZ

# Production
VITE_API_URL=https://api.tradingdz.com/api
VITE_APP_NAME=Trading DZ
```

### Hosting Options

- **Vercel** (recommended for React/Vite)
- **Netlify**
- **AWS S3 + CloudFront**
- **Docker + Custom Server**

### Build Process

```bash
npm run build
# dist/ folder contains production files
```

## 📊 Monitoring & Analytics

Track:

- User registrations
- Payment conversion rates
- Referral activation rates
- Average earnings per level
- User engagement metrics

## 🐛 Troubleshooting

### CORS Issues

- Backend should have CORS enabled for frontend origin
- Check `VITE_API_URL` in environment files

### Token Expiration

- Tokens expire after 24 hours
- Users automatically redirected to login
- Clear localStorage if stuck in auth loop

### Payment Verification

- Admin must manually verify USDT transactions
- User needs admin confirmation to access dashboard
- Support email for payment issues

## 📞 Support

- **Email**: support@tradingdz.com
- **Telegram**: @TradingDZSupport
- **WhatsApp**: +1234567890

## 📄 License

© 2024 Trading DZ. All rights reserved.

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready

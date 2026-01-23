# Gold Trading DZ VIP Platform - Complete Setup Guide

## 🎯 Quick Overview

This platform has **3 separate services** that communicate with each other:

| Service | Port | Purpose |
|---------|------|---------|
| 📱 Customer Website | 3000 | Affiliate marketing platform |
| 🛠️ Admin Dashboard | 5173 | Admin management panel |
| 🔌 Mock API Server | 5001 | Backend with all endpoints |

**No database setup required** - everything uses an in-memory mock database!

## 🚀 Quick Start (2 Minutes)

### Prerequisites
- Node.js 16+ installed
- 3 Terminal windows (or tabs in VS Code)

### Step 1: Install Dependencies

```bash
# Terminal 1 - Backend
cd backend
npm install

# Terminal 2 - Website
cd website
npm install

# Terminal 3 - Admin Dashboard
cd frontend
npm install
```

### Step 2: Start All Servers

```bash
# Terminal 1 - Backend API (Port 5001)
cd backend
node mock-server.js

# Terminal 2 - Customer Website (Port 3000)
cd website
npm run dev

# Terminal 3 - Admin Dashboard (Port 5173)
cd frontend
npm run dev
```

All servers will start automatically! Watch the terminals for confirmations.

## 🎨 Access Your Applications

Open these in your browser:

| Application | URL | Login Credentials |
|-------------|-----|-------------------|
| **Customer Website** | http://localhost:3000 | Create new account |
| **Admin Dashboard** | http://localhost:5173 | admin@tradingdz.com / admin123 |
| **API Server** | http://localhost:5001 | (Backend only) |

## 🔐 Admin Login (Pre-filled in Form)

When you open the Admin Dashboard at http://localhost:5173, you'll see:

- **Email:** admin@tradingdz.com  
- **Password:** admin123
- **Status:** Pre-filled for quick testing ✨

The login form displays these credentials in a highlighted box so you don't need to memorize them!

## 💡 Test Features

### 1. Customer Registration
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in your details
4. Submit - you'll be registered!

### 2. Customer Login
1. Use the credentials you registered with
2. Access your dashboard
3. View referral links
4. Manage payments

### 3. Admin Access
1. Go to http://localhost:5173
2. Credentials are pre-filled
3. Manage all users and payments
4. View system statistics

### 4. Check API Logs
Watch the Terminal 1 (Backend) - every request is logged with emojis!

## 📁 Project Structure

```
tradnig/
├── backend/
│   ├── mock-server.js      # Main API server (all endpoints)
│   ├── package.json
│   └── node_modules/
│
├── website/                # Customer Website
│   ├── src/
│   │   ├── pages/          # 9 pages (Home, Login, Register, etc.)
│   │   ├── components/     # Navbar, Footer, ProtectedRoute
│   │   └── api/            # API client
│   ├── vite.config.js      # Port: 3000
│   └── package.json
│
├── frontend/               # Admin Dashboard
│   ├── src/
│   │   ├── pages/          # 8 pages (Dashboard, Users, Payments, etc.)
│   │   ├── components/     # Sidebar navigation
│   │   └── api/            # API client
│   ├── vite.config.js      # Port: 5173
│   └── package.json
│
└── SETUP_IMPROVED.md       # This file
```

## 🔌 How Everything Connects

```
Customer Website (3000)     Admin Dashboard (5173)
        ↓                           ↓
        └─────→ Mock API (5001) ←──┘
              
              In-Memory Database
```

Both frontends send requests to port 5001. Responses come back with:
- User data
- Payment information
- Referral statistics
- Commission calculations

## 📝 Key Features

### ✅ Customer Website
- 📱 Responsive design (mobile-first)
- 🔐 User authentication with JWT
- 💳 Payment management
- 🎁 Referral system with shareable links
- 📊 User dashboard
- 📄 Terms & Privacy pages
- 🌐 Arabic language support

### ✅ Admin Dashboard
- 👥 User management (view, edit, delete)
- 💰 Payment tracking & verification
- 📈 Commission calculations
- 🔗 Referral monitoring
- 💸 Withdrawal requests
- 📋 System logs
- 🔍 Statistics & analytics
- 🎨 Luxury gold/black theme
- 🌍 Arabic labels on login page

### ✅ Mock API Server
- 15+ RESTful endpoints
- JWT authentication
- User registration & login
- Payment processing
- Referral tracking
- Commission calculation
- CORS enabled
- Console logging for debugging

## 🔄 API Endpoints (Quick Reference)

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/dashboard              - Customer stats
GET    /api/dashboard/admin        - Admin stats

GET    /api/users                  - List all users
GET    /api/users/:id              - Get user details
PUT    /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user

GET    /api/payments               - List payments
POST   /api/payments               - Create payment
PUT    /api/payments/:id/verify    - Verify payment

GET    /api/referrals              - Get referral data
POST   /api/referrals/check        - Check referral link

GET    /api/commissions            - View commissions
GET    /api/commissions/calculate  - Calculate commissions
```

## 🛠️ Troubleshooting

### Issue: "Cannot connect to API"
**Solution:** 
- Make sure backend is running on port 5001
- Check Terminal 1 for error messages
- Refresh your browser (Ctrl+F5)

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :3000

# Kill it (replace PID with the number)
taskkill /PID <PID> /F
```

### Issue: "Login not working"
**Solution:**
- Check browser console (F12)
- Ensure backend is running
- Try refreshing the page
- Check the credentials are correct

### Issue: "CORS error"
**Solution:**
- Backend has CORS enabled by default
- Make sure you're using `http://localhost` (not 127.0.0.1)

### Issue: "Dependencies not installed"
**Solution:**
```bash
# In each folder (backend, website, frontend)
rm -rf node_modules package-lock.json
npm install
```

## 🔍 Debugging Tips

### Enable Browser Console Logging
- Open browser DevTools (F12)
- Go to Console tab
- You'll see detailed logs when:
  - Logging in
  - Making API requests
  - Receiving responses

### Watch Backend Logs
- Terminal 1 shows all API requests
- Look for emoji indicators (✅ for success, ❌ for errors)
- Useful for debugging authentication issues

### Check Network Requests
- DevTools → Network tab
- Click on API requests
- View request/response headers and body

## 📦 Technology Stack

### Frontend (Customer Website)
- React 18
- Vite build tool
- React Router v6
- Axios for API calls
- Custom CSS3 styling

### Frontend (Admin Dashboard)
- React 18
- Vite build tool
- React Router v6
- Axios for API calls
- Tailwind CSS
- Recharts for analytics
- Lucide React icons

### Backend
- Node.js
- Express.js
- In-memory database (mock)
- JWT authentication
- CORS support

## 🚀 Next Steps

After running everything successfully:

1. **Test Customer Flow**
   - Register on website
   - Login and verify dashboard
   - Test payment creation
   - Generate referral link

2. **Test Admin Flow**
   - Login to admin panel
   - View all users
   - Verify payments
   - Check statistics

3. **Advanced Testing**
   - Open DevTools Network tab
   - Watch API calls in real-time
   - Check token in localStorage
   - Monitor backend logs

4. **Customization Ideas**
   - Change colors in CSS files
   - Add more admin users to backend
   - Create new pages
   - Add more API endpoints

## 💾 Data Storage

All data is stored **in-memory only**. This means:
- ✅ Fast performance
- ✅ No database setup needed
- ✅ Perfect for testing
- ❌ Data resets when backend restarts
- ❌ Not suitable for production

To make it persistent, you'd need to:
1. Install PostgreSQL
2. Update backend to use real database
3. Create migrations
4. Update API endpoints

## 📞 Quick Answers

**Q: Can I access from my phone?**  
A: Yes! Replace `localhost` with your computer's IP address (e.g., `192.168.x.x:3000`)

**Q: How long do tokens last?**  
A: 24 hours. After that, you need to login again.

**Q: What if I forgot the admin password?**  
A: Restart the backend. The mock database resets with default admin credentials.

**Q: Can I have multiple windows?**  
A: Yes! Open multiple browser tabs/windows for each URL.

**Q: How do I change the theme colors?**  
A: Edit the CSS files in `website/src/` and `frontend/src/pages/`

## 🎓 Learning & Development

This project demonstrates:
- JWT authentication flows
- React hooks and state management
- API integration patterns
- Error handling strategies
- Responsive design principles
- Form validation
- Protected routes
- Role-based access

Perfect for learning full-stack development!

## ✅ Checklist

- [ ] Node.js installed
- [ ] Downloaded all files
- [ ] Opened 3 terminals
- [ ] Ran `npm install` in all 3 folders
- [ ] Started backend on port 5001
- [ ] Started website on port 3000
- [ ] Started admin on port 5173
- [ ] Opened http://localhost:3000 in browser
- [ ] Opened http://localhost:5173 in browser
- [ ] Successfully logged in as admin
- [ ] Successfully registered as customer

---

**Status:** ✅ Ready to Use  
**Version:** 1.0.0  
**Last Updated:** 2024

Need help? Check the browser console (F12) and backend logs in Terminal 1!

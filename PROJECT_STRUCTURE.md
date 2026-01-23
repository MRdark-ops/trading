# 📁 Complete Project Structure Guide

## 🏗️ Full Folder Layout

```
tradnig/
│
├── 📄 GETTING_STARTED.md              ← START HERE! (How to run everything)
├── 📄 SETUP_IMPROVED.md               ← Detailed setup instructions
├── 📄 ADMIN_LOGIN_IMPROVEMENTS.md     ← What's new in admin login
├── 📄 README.md                       ← (Original readme)
├── 📄 SETUP.md                        ← (Original setup)
│
├── 🔙 backend/                        ← Backend API Server
│   ├── mock-server.js                 ← Main API (start this first!)
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
├── 🌐 website/                        ← Customer Website (port 3000)
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── Register.css
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── Payment.jsx
│   │   │   ├── Payment.css
│   │   │   ├── Referrals.jsx
│   │   │   ├── Referrals.css
│   │   │   ├── Terms.jsx
│   │   │   ├── Terms.css
│   │   │   ├── Privacy.jsx
│   │   │   ├── Privacy.css
│   │   │   ├── NotFound.jsx
│   │   │   └── NotFound.css
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── 📁 api/
│   │   │   └── client.js              ← API client with interceptors
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js                 ← Port 3000 config
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── node_modules/
│
├── 🛠️ frontend/                       ← Admin Dashboard (port 5173)
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── Users.jsx
│   │   │   ├── Users.css
│   │   │   ├── UserDetail.jsx
│   │   │   ├── UserDetail.css
│   │   │   ├── Payments.jsx
│   │   │   ├── Payments.css
│   │   │   ├── Referrals.jsx
│   │   │   ├── Referrals.css
│   │   │   ├── Withdrawals.jsx
│   │   │   ├── Withdrawals.css
│   │   │   ├── Commissions.jsx
│   │   │   ├── Commissions.css
│   │   │   ├── Logs.jsx
│   │   │   ├── Logs.css
│   │   │   ├── Login.jsx              ← ✨ Improved with Arabic labels!
│   │   │   └── Login.css
│   │   ├── 📁 components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── 📁 api/
│   │   │   └── client.js              ← API client with interceptors
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js                 ← Port 5173 config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── node_modules/
│
└── 🔧 Other files
    ├── Dockerfile                     ← For containerization (if needed)
    ├── .gitignore
    ├── docker-compose.yml             ← For Docker setup (optional)
    └── ... (various config files)
```

---

## 📝 What Each Service Does

### 🔙 Backend: `mock-server.js`

**Port:** 5001  
**Purpose:** API server with all endpoints

**Provides:**
- User authentication (register/login)
- User management
- Payment tracking
- Referral system
- Commission calculation
- Dashboard statistics
- System logs

**Key Features:**
- In-memory database (no PostgreSQL)
- JWT token generation
- CORS support
- Detailed console logging
- Test data pre-loaded

### 🌐 Website: `website/`

**Port:** 3000  
**Purpose:** Customer-facing affiliate platform

**Pages:**
1. **Home** - Landing page with features
2. **Register** - New user registration
3. **Login** - User authentication
4. **Dashboard** - User profile & stats
5. **Payment** - Make/manage payments
6. **Referrals** - Referral link sharing
7. **Terms** - Terms of service
8. **Privacy** - Privacy policy
9. **NotFound** - 404 error page

**Components:**
- **Navbar** - Navigation & user menu
- **Footer** - Footer section
- **ProtectedRoute** - Auth wrapper

**Technology:**
- React 18
- Vite build tool
- React Router v6
- Axios HTTP client
- Custom CSS3

### 🛠️ Admin Dashboard: `frontend/`

**Port:** 5173  
**Purpose:** Admin management panel

**Pages:**
1. **Login** - ✨ NEW! With Arabic labels & pre-filled creds
2. **Dashboard** - Overview & statistics
3. **Users** - User management
4. **UserDetail** - Individual user details
5. **Payments** - Payment tracking
6. **Referrals** - Referral monitoring
7. **Withdrawals** - Withdrawal requests
8. **Commissions** - Commission management
9. **Logs** - System logs viewer

**Components:**
- **Sidebar** - Navigation menu

**Technology:**
- React 18
- Vite build tool
- React Router v6
- Axios HTTP client
- Tailwind CSS
- Recharts (analytics)
- Lucide React (icons)

---

## 🔗 How They Connect

```
┌─────────────────────────────────────────────────────────┐
│                   User's Browser                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Customer (3000)          Admin (5173)                 │
│  ├── Home page            ├── Login ✨                 │
│  ├── Register             ├── Dashboard                │
│  ├── Login                ├── Users                     │
│  ├── Dashboard            ├── Payments                  │
│  ├── Payment              ├── Referrals                │
│  └── Referrals            └── Logs                     │
│         ↓                        ↓                      │
└─────────┼────────────────────────┼─────────────────────┘
          │                        │
          └──────────┬─────────────┘
                     ↓
          ┌──────────────────────┐
          │  Mock API (5001)     │
          │                      │
          │ - Authentication     │
          │ - Users              │
          │ - Payments           │
          │ - Referrals          │
          │ - Commissions        │
          │ - Statistics         │
          └──────────────────────┘
                     ↓
          ┌──────────────────────┐
          │ In-Memory Database   │
          │ (no PostgreSQL)      │
          │                      │
          │ Users, Payments,     │
          │ Referrals, etc.      │
          └──────────────────────┘
```

---

## 📋 Core Files Explained

### Backend Core
- **`backend/mock-server.js`**
  - Main API server
  - All 15+ endpoints defined here
  - In-memory database
  - Start with: `node mock-server.js`

### Website Core
- **`website/src/App.jsx`** - Main app component
- **`website/src/api/client.js`** - API client for requests
- **`website/vite.config.js`** - Build config (port 3000)

### Admin Core
- **`frontend/src/App.jsx`** - Main app component
- **`frontend/src/pages/Login.jsx`** - ✨ Improved login form
- **`frontend/src/pages/Login.css`** - Beautiful styling
- **`frontend/src/api/client.js`** - API client for requests
- **`frontend/vite.config.js`** - Build config (port 5173)

---

## 🎨 CSS Files

### Website Styling
```
website/src/
├── App.css              - Main app styles
├── index.css            - Global styles
└── pages/
    ├── Home.css         - Home page
    ├── Login.css        - Login form
    ├── Register.css     - Registration form
    ├── Dashboard.css    - User dashboard
    ├── Payment.css      - Payment page
    ├── Referrals.css    - Referrals page
    ├── Terms.css        - Terms page
    ├── Privacy.css      - Privacy page
    └── NotFound.css     - 404 page
```

### Admin Styling
```
frontend/src/
├── App.css              - Main app styles
├── index.css            - Global styles
└── pages/
    ├── Login.css        - ✨ Improved login
    ├── Dashboard.css    - Dashboard page
    ├── Users.css        - Users list
    ├── UserDetail.css   - User details
    ├── Payments.css     - Payments list
    ├── Referrals.css    - Referrals page
    ├── Withdrawals.css  - Withdrawals page
    ├── Commissions.css  - Commissions page
    └── Logs.css         - Logs viewer
```

---

## 🔐 Authentication Flow

1. **User visits login page**
   - Admin: http://localhost:5173
   - Customer: http://localhost:3000/login

2. **User enters credentials**
   - Admin: Pre-filled (admin@tradingdz.com / admin123)
   - Customer: Their registered credentials

3. **App sends POST request**
   - `POST /api/auth/login`
   - With email & password

4. **Backend validates**
   - Checks in-memory database
   - Returns JWT token if valid

5. **App stores token**
   - Saves to `localStorage`
   - Key: `authToken`

6. **Future requests include token**
   - Added to header: `Authorization: Bearer <token>`
   - Interceptor does this automatically

7. **Token expiration (24 hours)**
   - After 24 hours: logout required
   - 401 response: auto-redirect to login

---

## 📊 Database Schema (In-Memory)

### Users Table
```javascript
{
  id: number,
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string,
  role: 'customer' | 'admin',
  referralCode: string,
  createdAt: timestamp
}
```

### Payments Table
```javascript
{
  id: number,
  userId: number,
  amount: number,
  status: 'pending' | 'verified' | 'failed',
  paymentMethod: string,
  createdAt: timestamp
}
```

### Referrals Table
```javascript
{
  id: number,
  referrerId: number,
  referredId: number,
  commission: number,
  status: string,
  createdAt: timestamp
}
```

---

## 🚀 Startup Sequence

**Terminal 1 (Backend):**
```bash
cd backend
node mock-server.js
```
✅ Result: `🚀 Mock API Server running on http://localhost:5001`

**Terminal 2 (Website):**
```bash
cd website
npm run dev
```
✅ Result: `➜  Local:   http://localhost:3000/`

**Terminal 3 (Admin):**
```bash
cd frontend
npm run dev
```
✅ Result: `➜  Local:   http://localhost:5173/`

---

## 🔧 Configuration Files

### Vite Configs
- **`backend/vite.config.js`** - N/A (Express, not Vite)
- **`website/vite.config.js`** - Port 3000
- **`frontend/vite.config.js`** - Port 5173

### Tailwind Config (Admin Only)
- **`frontend/tailwind.config.js`** - Tailwind CSS setup

### PostCSS Config (Admin Only)
- **`frontend/postcss.config.js`** - CSS preprocessing

### Package Files
- **`backend/package.json`** - Backend dependencies
- **`website/package.json`** - Website dependencies
- **`frontend/package.json`** - Admin dependencies

---

## 📦 Dependencies Summary

### Backend
- express (web framework)
- cors (cross-origin support)
- jsonwebtoken (JWT tokens)

### Website & Admin
- react (UI library)
- react-router-dom (routing)
- axios (HTTP client)
- vite (build tool)
- tailwindcss (admin styling)
- recharts (admin charts)
- lucide-react (admin icons)

---

## 🎯 Quick Navigation

Need to...

**Change the port?**
- Website: Edit `website/vite.config.js` line with `port: 3000`
- Admin: Edit `frontend/vite.config.js` line with `port: 5173`
- Backend: Edit `backend/mock-server.js` line with `5001`

**Add a new page?**
- Website: Create file in `website/src/pages/`
- Admin: Create file in `frontend/src/pages/`
- Update router in `App.jsx`

**Change theme colors?**
- Website: Edit CSS files in `website/src/`
- Admin: Edit CSS files or `frontend/tailwind.config.js`

**Add test data?**
- Edit `backend/mock-server.js` users array

**Change admin credentials?**
- Edit `frontend/src/pages/Login.jsx` state values

---

## 🔍 Important Files

| File | Purpose | Modify to... |
|------|---------|-------------|
| `backend/mock-server.js` | All endpoints | Add/change API behavior |
| `website/src/App.jsx` | Website routing | Add/remove pages |
| `frontend/src/App.jsx` | Admin routing | Add/remove pages |
| `website/src/api/client.js` | API communication | Change API base URL |
| `frontend/src/api/client.js` | API communication | Change API base URL |
| `frontend/src/pages/Login.jsx` | Admin login ✨ | Change credentials |
| `website/vite.config.js` | Website config | Change port 3000 |
| `frontend/vite.config.js` | Admin config | Change port 5173 |

---

## ✅ Verification Checklist

After startup, verify:

- [ ] Backend shows `🚀 Mock API Server running on http://localhost:5001`
- [ ] Website shows `Local: http://localhost:3000/`
- [ ] Admin shows `Local: http://localhost:5173/`
- [ ] Can access http://localhost:3000 in browser
- [ ] Can access http://localhost:5173 in browser
- [ ] Can login to admin with pre-filled credentials
- [ ] Can see "🔒 بيانات الاختبار" box with test credentials
- [ ] Can register on website
- [ ] Browser DevTools (F12) shows API logs
- [ ] Backend Terminal 1 shows detailed request logs

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `GETTING_STARTED.md` | Quick start guide |
| `SETUP_IMPROVED.md` | Detailed setup instructions |
| `ADMIN_LOGIN_IMPROVEMENTS.md` | What's new in login page |
| `PROJECT_STRUCTURE.md` | This file |
| `README.md` | Original readme |
| `SETUP.md` | Original setup guide |

---

## 🎓 Learning Path

1. **Start with** `GETTING_STARTED.md`
2. **Then read** `ADMIN_LOGIN_IMPROVEMENTS.md`
3. **Explore** `backend/mock-server.js` for API
4. **Check** `website/src/App.jsx` for routing
5. **Review** `frontend/src/pages/Login.jsx` for React
6. **Study** CSS files for styling patterns

---

## 🚀 Ready to Go!

Everything is organized and documented. You can:

✅ Start all servers simultaneously  
✅ Access both platforms  
✅ Login as admin  
✅ Register as customer  
✅ Test all features  
✅ Monitor logs  
✅ Customize as needed  

Perfect for development, testing, and learning!

---

**Version:** 1.0.0  
**Status:** ✅ Complete  
**Last Updated:** 2024

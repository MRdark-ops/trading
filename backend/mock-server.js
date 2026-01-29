const express = require('express')
const cors = require('cors')
const app = express()
const {
  DigitalFingerprint,
  ActivityLogger,
  SecurityMonitor,
  InputValidator,
  TokenManager,
  RateLimiter
} = require('./security')

// ============================================
// Security Middleware & Configuration
// ============================================

// Initialize security systems
const activityLogger = new ActivityLogger()
const securityMonitor = new SecurityMonitor()
const tokenManager = new TokenManager()
const loginLimiter = new RateLimiter(5, 60 * 1000) // 5 attempts per minute
const apiLimiter = new RateLimiter(100, 60 * 1000) // 100 requests per minute

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}

app.use(cors(corsOptions))
app.use(express.json())

// Security Headers Middleware
app.use((req, res, next) => {
  // Prevent XSS
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  )

  // Prevent MIME sniffing
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  next()
})

// IP Blocking Middleware
app.use((req, res, next) => {
  const ip = DigitalFingerprint.getClientIP(req)

  if (securityMonitor.isIPBlocked(ip)) {
    return res.status(403).json({
      success: false,
      error:
        '🚫 Your IP has been temporarily blocked due to suspicious activity'
    })
  }

  next()
})

// Rate Limiting Middleware
app.use((req, res, next) => {
  const ip = DigitalFingerprint.getClientIP(req)

  if (apiLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      error: '⏰ Too many requests. Please try again later.'
    })
  }

  next()
})

// Digital Fingerprint Middleware
app.use((req, res, next) => {
  req.fingerprint = DigitalFingerprint.generate(req)
  req.clientIP = DigitalFingerprint.getClientIP(req)
  next()
})

// Token Validation Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Missing authentication token'
    })
  }

  const validation = tokenManager.validateToken(token)

  if (!validation.isValid) {
    return res.status(401).json({
      success: false,
      error: validation.reason
    })
  }

  req.user = validation.data
  next()
}

// Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    securityMonitor.addSuspiciousActivity(
      users[req.user.userId]?.email,
      req.clientIP,
      'ADMIN_ACCESS_DENIED',
      { userId: req.user.userId }
    )

    return res.status(403).json({
      success: false,
      error: 'Admin access only'
    })
  }

  next()
}

// Mock database - Enhanced with multiple users and admins
const users = {
  // Regular Users
  1: {
    id: 1,
    email: 'user@tradingdz.com',
    password: 'user123456',
    fullName: 'محمد أحمد',
    phoneNumber: '+213555123456',
    country: 'Algeria',
    role: 'user',
    balance: 5000,
    earnings: 12500,
    referralCode: 'REF123ABC',
    subscriptionStatus: 'Active',
    subscriptionExpiry: '2025-01-31T23:59:59Z',
    createdAt: '2024-11-15T10:30:00Z'
  },
  3: {
    id: 3,
    email: 'test@example.com',
    password: 'password',
    fullName: 'Test User',
    phoneNumber: '1234567890',
    country: 'Algeria',
    role: 'user',
    balance: 3500,
    earnings: 8200,
    referralCode: 'REFTEST001',
    subscriptionStatus: 'Active',
    createdAt: '2024-10-20T14:15:00Z'
  },
  4: {
    id: 4,
    email: 'ahmed.hassan@example.com',
    password: 'pass1234',
    fullName: 'أحمد حسن',
    phoneNumber: '+213554789012',
    country: 'Algeria',
    role: 'user',
    balance: 7200,
    earnings: 15600,
    referralCode: 'REFAH001',
    subscriptionStatus: 'Active',
    createdAt: '2024-09-10T08:45:00Z'
  },
  5: {
    id: 5,
    email: 'fatima.lee@example.com',
    password: 'secure456',
    fullName: 'فاطمة لي',
    phoneNumber: '+213556234567',
    country: 'Algeria',
    role: 'user',
    balance: 4800,
    earnings: 9800,
    referralCode: 'REFFAT001',
    subscriptionStatus: 'Active',
    createdAt: '2024-08-25T16:20:00Z'
  },
  6: {
    id: 6,
    email: 'karim.ben@example.com',
    password: 'benpass789',
    fullName: 'كريم بن علي',
    phoneNumber: '+213553456789',
    country: 'Algeria',
    role: 'user',
    balance: 6100,
    earnings: 14300,
    referralCode: 'REFKAR001',
    subscriptionStatus: 'Inactive',
    createdAt: '2024-07-12T11:00:00Z'
  },
  7: {
    id: 7,
    email: 'sarah.gold@example.com',
    password: 'goldpass123',
    fullName: 'سارة ذهب',
    phoneNumber: '+213557890123',
    country: 'Algeria',
    role: 'user',
    balance: 8900,
    earnings: 21500,
    referralCode: 'REFSAR001',
    subscriptionStatus: 'Active',
    createdAt: '2024-06-30T09:30:00Z'
  },
  8: {
    id: 8,
    email: 'omar.trading@example.com',
    password: 'omarpass456',
    fullName: 'عمر التاجر',
    phoneNumber: '+213558901234',
    country: 'Algeria',
    role: 'user',
    balance: 2300,
    earnings: 5600,
    referralCode: 'REFOMAR001',
    subscriptionStatus: 'Active',
    createdAt: '2024-05-18T13:45:00Z'
  },
  9: {
    id: 9,
    email: 'layla.invest@example.com',
    password: 'laylapass789',
    fullName: 'ليلى المستثمرة',
    phoneNumber: '+213559012345',
    country: 'Algeria',
    role: 'user',
    balance: 11200,
    earnings: 28700,
    referralCode: 'REFLAY001',
    subscriptionStatus: 'Active',
    createdAt: '2024-04-05T15:15:00Z'
  },
  10: {
    id: 10,
    email: 'nabil.finance@example.com',
    password: 'nabilpass123',
    fullName: 'نبيل المالي',
    phoneNumber: '+213551234567',
    country: 'Algeria',
    role: 'user',
    balance: 9500,
    earnings: 19200,
    referralCode: 'REFNAB001',
    subscriptionStatus: 'Active',
    createdAt: '2024-03-22T10:00:00Z'
  },

  // Admin Accounts
  2: {
    id: 2,
    email: 'admin@tradingdz.com',
    password: 'admin123456',
    fullName: 'مسؤول الموقع',
    phoneNumber: '0123456789',
    country: 'Algeria',
    role: 'admin',
    permissions: ['all'],
    balance: 0,
    earnings: 50000,
    referralCode: 'ADMIN001',
    subscriptionStatus: 'Active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  11: {
    id: 11,
    email: 'support@tradingdz.com',
    password: 'support1234',
    fullName: 'فريق الدعم',
    phoneNumber: '0987654321',
    country: 'Algeria',
    role: 'admin',
    permissions: ['users', 'support', 'logs'],
    balance: 0,
    earnings: 30000,
    referralCode: 'ADMIN002',
    subscriptionStatus: 'Active',
    createdAt: '2024-01-05T08:00:00Z'
  },
  12: {
    id: 12,
    email: 'manager@tradingdz.com',
    password: 'manager1234',
    fullName: 'مدير النظام',
    phoneNumber: '0556789123',
    country: 'Algeria',
    role: 'admin',
    permissions: ['users', 'payments', 'withdrawals'],
    balance: 0,
    earnings: 45000,
    referralCode: 'ADMIN003',
    subscriptionStatus: 'Active',
    createdAt: '2024-01-10T12:00:00Z'
  }
}

// Mock Referrals System
const referrals = {
  1: [3, 4, 5], // user 1 referred users 3, 4, 5
  4: [7, 8],
  7: [9]
}

// Withdrawal Requests
const withdrawalRequests = {
  1: {
    id: 1,
    userId: 1,
    amount: 500,
    referralsCount: 3,
    earnings: 12500,
    status: 'pending', // pending, approved, rejected, completed
    walletAddress: 'TU7jf7QZ3K...',
    requestedAt: '2024-12-20T10:30:00Z',
    completedAt: null
  }
}

// Payment Records (Subscriptions)
const paymentRecords = {
  1: {
    id: 1,
    userId: 1,
    amount: 25,
    currency: 'USDT',
    status: 'completed', // pending, processing, completed, failed
    txHash: '0x1234567890abcdef',
    paymentMethod: 'binance',
    subscriptionExpiry: '2025-01-31T23:59:59Z',
    paidAt: '2024-12-31T10:00:00Z'
  }
}

// Telegram Channel Access
const telegramAccess = {
  1: {
    userId: 1,
    telegramId: null,
    channelName: '@trading_dz_vip',
    accessGrantedAt: '2024-12-31T10:05:00Z'
  }
}

const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAzNzM5MTQwLCJleHAiOjE3MDM4MjU1NDB9.test'

// Helper function to generate token with user info
function generateToken (user) {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    })
  ).toString('base64')}.test`
}

// Auth Routes - with Security
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, fullName, phoneNumber, country } = req.body

    // Input Validation
    const validation = InputValidator.validateRequest({ email, password })
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors[0]
      })
    }

    console.log('📝 Register request:', { email, fullName, ip: req.clientIP })

    // Check required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      })
    }

    // Check if email already exists
    const existingUser = Object.values(users).find((u) => u.email === email)
    if (existingUser) {
      securityMonitor.addSuspiciousActivity(
        email,
        req.clientIP,
        'DUPLICATE_EMAIL',
        {}
      )
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      })
    }

    // Create new user
    const newUserId = Math.max(0, ...Object.keys(users).map(Number)) + 1
    const newRefCode =
      'REF' + Math.random().toString(36).substr(2, 9).toUpperCase()

    const newUser = {
      id: newUserId,
      email,
      password, // In production, use bcrypt!
      fullName,
      phoneNumber: phoneNumber || '',
      country: country || '',
      role: 'user',
      balance: 0,
      earnings: 0,
      referralCode: newRefCode,
      subscriptionStatus: 'Pending',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loginAttempts: 0,
      registeredIP: req.clientIP,
      fingerprint: req.fingerprint.hash
    }

    users[newUserId] = newUser

    // Log activity
    const token = tokenManager.generateToken(newUserId, 'user')
    activityLogger.log(
      newUserId,
      'REGISTRATION',
      { email, ip: req.clientIP },
      req.fingerprint.hash
    )

    console.log('✅ User registered successfully:', {
      id: newUserId,
      email,
      ip: req.clientIP
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        referralCode: newUser.referralCode,
        role: 'user',
        subscriptionStatus: 'Pending'
      }
    })
  } catch (err) {
    console.error('❌ Register error:', err)
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    })
  }
})

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body
    const ip = req.clientIP

    // Rate limiting
    if (loginLimiter.isLimited(ip)) {
      securityMonitor.blockIP(ip, 15 * 60 * 1000) // Block for 15 minutes
      return res.status(429).json({
        success: false,
        error: '⏰ Too many login attempts. Please try again later.'
      })
    }

    // Check if account is locked
    if (securityMonitor.isAccountLocked(email, ip)) {
      return res.status(429).json({
        success: false,
        error:
          '🔒 Account temporarily locked due to suspicious activity. Try again later.'
      })
    }

    // Input Validation
    const validation = InputValidator.validateRequest({ email, password })
    if (!validation.isValid) {
      securityMonitor.addSuspiciousActivity(email, ip, 'INVALID_INPUT', {
        errors: validation.errors
      })
      return res.status(400).json({
        success: false,
        error: validation.errors[0]
      })
    }

    const safeEmail = email.replace(/[\n\r]/g, '')
    const safeIp = ip.replace(/[\n\r]/g, '')
    console.log('🔐 Login attempt:', { email: safeEmail, ip: safeIp })

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    // Find user
    const user = Object.values(users).find((u) => u.email === email)

    if (!user) {
      securityMonitor.recordFailedAttempt(email, ip)
      console.log('❌ User not found:', safeEmail)
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Verify password
    if (user.password !== password) {
      const allowed = securityMonitor.recordFailedAttempt(email, ip)
      console.log('❌ Wrong password for:', safeEmail)

      if (!allowed) {
        return res.status(429).json({
          success: false,
          error: '🔒 Account locked. Too many failed attempts.'
        })
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Successful login - clear failed attempts
    securityMonitor.clearFailedAttempts(email, ip)

    // Generate token
    const token = tokenManager.generateToken(user.id, user.role || 'user')

    // Update user login info
    user.lastLogin = new Date().toISOString()
    user.loginAttempts = 0

    // Log activity
    activityLogger.log(
      user.id,
      'LOGIN',
      {
        email,
        ip,
        userAgent: req.headers['user-agent']
      },
      req.fingerprint.hash
    )

    console.log('✅ Login successful:', user.email, `(${user.role || 'user'})`)

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role || 'user',
        isAdmin: user.role === 'admin',
        referralCode: user.referralCode,
        subscriptionStatus: user.subscriptionStatus || 'Active',
        currentBalance: user.balance,
        totalEarnings: user.earnings
      }
    })
  } catch (err) {
    console.error('❌ Login error:', err)
    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
})

app.post('/api/auth/logout', verifyToken, (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    tokenManager.revokeToken(token)

    const userId = req.user.userId
    activityLogger.log(
      userId,
      'LOGOUT',
      { ip: req.clientIP },
      req.fingerprint.hash
    )

    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (err) {
    console.error('❌ Logout error:', err)
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    })
  }
})

// Payment Routes
app.post('/api/payment/submit', (req, res) => {
  const { amount, txid, userEmail } = req.body

  console.log('Payment submitted:', { amount, txid, userEmail })

  res.json({
    success: true,
    message: 'Payment submitted successfully. Waiting for verification.',
    paymentId: 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    status: 'Pending'
  })
})

app.get('/api/payment/wallet-address', (req, res) => {
  res.json({
    walletAddress: 'TNpBtVMSJwXvwEJdFZeYCKWWGq5LKxxxx', // USDT Binance Wallet
    network: 'Tron (TRC-20) / Binance Smart Chain',
    currency: 'USDT',
    amount: 25,
    purpose: 'Monthly Subscription'
  })
})

// ============================================
// NEW: Withdrawal & Payment Routes
// ============================================

// Request Withdrawal
app.post('/api/withdrawal/request', verifyToken, (req, res) => {
  try {
    const userId = req.user.userId
    const user = users[userId]
    const userReferrals = referrals[userId] || []

    console.log(`💰 Withdrawal request from user ${userId}`)
    console.log(`👥 Referrals count: ${userReferrals.length}`)
    console.log(`💵 Total earnings: ${user.earnings}`)

    // Calculate available balance
    const referralsCount = userReferrals.length
    const totalEarnings = user.earnings

    if (totalEarnings < 100) {
      return res.status(400).json({
        success: false,
        error: 'Minimum withdrawal amount is $100'
      })
    }

    // Sanitize wallet address input
    const rawWalletAddress = req.body.walletAddress || 'User_Wallet_Address'
    const walletAddress = rawWalletAddress.replace(/[\n\r]/g, '')

    // Create withdrawal request
    const withdrawalId =
      Math.max(0, ...Object.keys(withdrawalRequests).map(Number)) + 1
    const withdrawal = {
      id: withdrawalId,
      userId,
      amount: totalEarnings,
      referralsCount,
      earnings: totalEarnings,
      status: 'pending',
      walletAddress,
      requestedAt: new Date().toISOString(),
      completedAt: null
    }

    withdrawalRequests[withdrawalId] = withdrawal

    console.log('✅ Withdrawal request created:', withdrawal)

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: withdrawalId,
        amount: totalEarnings,
        referralsCount,
        status: 'pending',
        requestedAt: withdrawal.requestedAt
      }
    })
  } catch (err) {
    console.error('❌ Withdrawal error:', err)
    res.status(500).json({
      success: false,
      error: 'Failed to submit withdrawal request'
    })
  }
})

// Get User Withdrawal Requests
app.get('/api/withdrawal/requests', verifyToken, (req, res) => {
  try {
    const userId = req.user.userId
    const userWithdrawals = Object.values(withdrawalRequests).filter(
      (w) => w.userId === userId
    )

    res.json({
      success: true,
      withdrawals: userWithdrawals
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch withdrawals'
    })
  }
})

// Submit Payment (USDT Subscription)
app.post('/api/payment/submit-subscription', verifyToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { txHash, amount } = req.body
    const user = users[userId]

    const sanitizedTxHash =
      typeof txHash === 'string' ? txHash.replace(/[\n\r]/g, '') : txHash
    const sanitizedAmount =
      typeof amount === 'string' ? amount.replace(/[\n\r]/g, '') : amount
    const sanitizedUserId =
      typeof userId === 'string' ? userId.replace(/[\n\r]/g, '') : userId

    console.log(`💳 Payment submission from user ${sanitizedUserId}`, {
      txHash: sanitizedTxHash,
      amount: sanitizedAmount
    })

    if (amount !== 25) {
      return res.status(400).json({
        success: false,
        error: 'Subscription amount must be 25 USDT'
      })
    }

    // Create payment record
    const paymentId =
      Math.max(0, ...Object.keys(paymentRecords).map(Number)) + 1
    const payment = {
      id: paymentId,
      userId,
      amount,
      currency: 'USDT',
      status: 'completed',
      txHash,
      paymentMethod: 'binance',
      subscriptionExpiry: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days
      paidAt: new Date().toISOString()
    }

    paymentRecords[paymentId] = payment

    // Update user subscription
    user.subscriptionStatus = 'Active'
    user.subscriptionExpiry = payment.subscriptionExpiry

    // Grant Telegram access
    telegramAccess[userId] = {
      userId,
      telegramId: null,
      channelName: '@trading_dz_vip',
      accessGrantedAt: new Date().toISOString()
    }

    const sanitizedPaymentForLog = { ...payment, txHash: sanitizedTxHash }
    console.log(
      `✅ Payment completed for user ${sanitizedUserId}`,
      sanitizedPaymentForLog
    )

    res.json({
      success: true,
      message:
        'Payment verified successfully! You now have access to the VIP channel.',
      payment: {
        id: paymentId,
        status: 'completed',
        subscriptionExpiry: payment.subscriptionExpiry
      },
      telegramAccess: {
        channel: '@trading_dz_vip',
        accessGranted: true
      }
    })
  } catch (err) {
    console.error('❌ Payment error:', err)
    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    })
  }
})

// Check Subscription Status
app.get('/api/subscription/status', verifyToken, (req, res) => {
  try {
    const userId = req.user.userId
    const user = users[userId]
    const userPayments = Object.values(paymentRecords).filter(
      (p) => p.userId === userId
    )
    const hasPaid =
      userPayments.length > 0 &&
      userPayments[userPayments.length - 1].status === 'completed'
    const subscriptionExpiry = user.subscriptionExpiry || null

    const isExpired = subscriptionExpiry
      ? new Date(subscriptionExpiry) < new Date()
      : false

    res.json({
      success: true,
      subscription: {
        status: user.subscriptionStatus || 'Pending',
        hasPaid,
        isExpired,
        expiry: subscriptionExpiry,
        requiresPayment: !hasPaid || isExpired
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to check subscription status'
    })
  }
})

// Get All Withdrawal Requests (Admin Only)
app.get(
  '/api/admin/withdrawal-requests',
  verifyToken,
  adminOnly,
  (req, res) => {
    try {
      const allWithdrawals = Object.values(withdrawalRequests)

      res.json({
        success: true,
        withdrawals: allWithdrawals.map((w) => ({
          ...w,
          userName: users[w.userId]?.fullName,
          userEmail: users[w.userId]?.email
        })),
        total: allWithdrawals.length,
        pending: allWithdrawals.filter((w) => w.status === 'pending').length
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch withdrawal requests'
      })
    }
  }
)

// Approve Withdrawal (Admin Only)
app.post(
  '/api/admin/withdrawal/approve/:withdrawalId',
  verifyToken,
  adminOnly,
  (req, res) => {
    try {
      const { withdrawalId } = req.params
      const withdrawal = withdrawalRequests[withdrawalId]

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          error: 'Withdrawal request not found'
        })
      }

      withdrawal.status = 'completed'
      withdrawal.completedAt = new Date().toISOString()

      console.log('✅ Admin approved withdrawal:', withdrawal)

      res.json({
        success: true,
        message: 'Withdrawal approved successfully',
        withdrawal
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Failed to approve withdrawal'
      })
    }
  }
)

// Reject Withdrawal (Admin Only)
app.post(
  '/api/admin/withdrawal/reject/:withdrawalId',
  verifyToken,
  adminOnly,
  (req, res) => {
    try {
      const { withdrawalId } = req.params
      const { reason } = req.body
      const withdrawal = withdrawalRequests[withdrawalId]

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          error: 'Withdrawal request not found'
        })
      }

      withdrawal.status = 'rejected'
      withdrawal.reason = reason || 'No reason provided'
      withdrawal.rejectedAt = new Date().toISOString()

      console.log('❌ Admin rejected withdrawal:', withdrawal)

      res.json({
        success: true,
        message: 'Withdrawal rejected',
        withdrawal
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Failed to reject withdrawal'
      })
    }
  }
)

// Get Payment Wallet USDT Address
app.get('/api/payment/usdt-wallet', (req, res) => {
  res.json({
    success: true,
    wallet: {
      address: 'TNpBtVMSJwXvwEJdFZeYCKWWGq5LKxxxx',
      network: 'TRON (TRC-20)',
      amount: 25,
      currency: 'USDT',
      purpose: 'Monthly VIP Subscription',
      binanceLink: 'https://www.binance.com' // User will transfer USDT from Binance
    }
  })
})

// Referral Routes
app.get('/api/referrals', (req, res) => {
  const referrals = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      level: 1,
      joinDate: '2024-12-20',
      status: 'Active',
      earnings: 500
    },
    {
      id: 2,
      name: 'Fatima Mohammed',
      level: 1,
      joinDate: '2024-12-18',
      status: 'Active',
      earnings: 750
    },
    {
      id: 3,
      name: 'Ali Ibrahim',
      level: 2,
      joinDate: '2024-12-15',
      status: 'Active',
      earnings: 250
    }
  ]

  res.json({
    success: true,
    referrals,
    totalReferrals: 3
  })
})

// Get referrals for a specific user
app.get('/api/referrals/user/:userId', (req, res) => {
  const { userId } = req.params
  const sanitizedUserId = userId.replace(/[\n\r]/g, '')
  console.log(`📊 Fetching referrals for user ${sanitizedUserId}`)

  const referrals = [
    {
      id: 1,
      referredUserName: 'Ahmed Hassan',
      referredUserEmail: 'ahmed@example.com',
      level: 1,
      status: 'Active',
      createdAt: '2024-12-20',
      commission: 500
    },
    {
      id: 2,
      referredUserName: 'Fatima Mohammed',
      referredUserEmail: 'fatima@example.com',
      level: 1,
      status: 'Active',
      createdAt: '2024-12-18',
      commission: 750
    },
    {
      id: 3,
      referredUserName: 'Ali Ibrahim',
      referredUserEmail: 'ali@example.com',
      level: 2,
      status: 'Active',
      createdAt: '2024-12-15',
      commission: 250
    }
  ]

  const statistics = {
    directReferrals: 2,
    totalReferrals: 3,
    activeReferrals: 3,
    totalEarningsFromReferrals: 1500
  }

  res.json({
    success: true,
    referrals,
    statistics
  })
})

// Dashboard Routes
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalReferrals: 25,
      activeMembers: 18,
      totalEarnings: 12500,
      pendingEarnings: 2300,
      currentBalance: 5000,
      commissionRate: '20%'
    }
  })
})

app.get('/api/dashboard/chart-data', (req, res) => {
  res.json({
    success: true,
    chartData: [
      { date: 'Jan 1', earnings: 500 },
      { date: 'Jan 2', earnings: 750 },
      { date: 'Jan 3', earnings: 600 },
      { date: 'Jan 4', earnings: 1200 },
      { date: 'Jan 5', earnings: 900 },
      { date: 'Jan 6', earnings: 1500 },
      { date: 'Jan 7', earnings: 2000 }
    ]
  })
})

// Commission Routes
app.get('/api/commissions', (req, res) => {
  res.json({
    success: true,
    commissions: [
      { level: 1, rate: '20%', earnings: 8000 },
      { level: 2, rate: '10%', earnings: 2500 },
      { level: 3, rate: '5%', earnings: 1200 },
      { level: 4, rate: '3%', earnings: 600 },
      { level: 5, rate: '2%', earnings: 200 }
    ]
  })
})

// User Profile
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      referralCode: 'REF123ABC',
      subscriptionStatus: 'Active',
      currentBalance: 5000,
      totalEarnings: 12500,
      pendingEarnings: 2300
    }
  })
})

// Admin Dashboard endpoints
// Dashboard overview
app.get('/api/dashboard', (req, res) => {
  res.json({
    success: true,
    overview: {
      totalUsers: 156,
      activeUsers: 89,
      totalRevenue: 45320.5,
      totalReferrals: 342,
      totalWithdrawals: 12500,
      totalCommissions: 8750,
      pendingWithdrawals: 3200,
      platformFee: 4532.05
    }
  })
})

app.get('/api/dashboard/growth', (req, res) => {
  res.json({
    success: true,
    data: [
      { date: '2024-12-20', users: 120, revenue: 3400, referrals: 25 },
      { date: '2024-12-21', users: 130, revenue: 4200, referrals: 32 },
      { date: '2024-12-22', users: 140, revenue: 3800, referrals: 28 },
      { date: '2024-12-23', users: 150, revenue: 5100, referrals: 35 },
      { date: '2024-12-24', users: 156, revenue: 4600, referrals: 40 },
      { date: '2024-12-25', users: 150, revenue: 3900, referrals: 22 },
      { date: '2024-12-26', users: 160, revenue: 5320, referrals: 38 }
    ]
  })
})

app.get('/api/dashboard/top-referrers', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Ahmed Hassan', referrals: 45, earnings: 4500 },
      { id: 2, name: 'Fatima Ali', referrals: 38, earnings: 3800 },
      { id: 3, name: 'Mohamed Ibrahim', referrals: 32, earnings: 3200 },
      { id: 4, name: 'Layla Ahmed', referrals: 28, earnings: 2800 },
      { id: 5, name: 'Hassan Karim', referrals: 22, earnings: 2200 }
    ]
  })
})

// Users Management
app.get('/api/admin/users', (req, res) => {
  res.json({
    success: true,
    users: [
      {
        id: 1,
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        status: 'Active',
        joinDate: '2024-12-01',
        balance: 5000,
        referrals: 12
      },
      {
        id: 2,
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        status: 'Active',
        joinDate: '2024-12-05',
        balance: 3200,
        referrals: 8
      },
      {
        id: 3,
        name: 'Mohamed Ibrahim',
        email: 'mohamed@example.com',
        status: 'Active',
        joinDate: '2024-12-10',
        balance: 7500,
        referrals: 15
      },
      {
        id: 4,
        name: 'Layla Ahmed',
        email: 'layla@example.com',
        status: 'Inactive',
        joinDate: '2024-12-12',
        balance: 1200,
        referrals: 3
      },
      {
        id: 5,
        name: 'Hassan Karim',
        email: 'hassan@example.com',
        status: 'Active',
        joinDate: '2024-12-15',
        balance: 4500,
        referrals: 10
      }
    ],
    total: 156,
    active: 89
  })
})

app.get('/api/admin/users/:userId', (req, res) => {
  const { userId } = req.params
  res.json({
    success: true,
    user: {
      id: userId,
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '0612345678',
      status: 'Active',
      joinDate: '2024-12-01',
      country: 'Algeria',
      balance: 5000,
      totalEarnings: 12500,
      referrals: 12,
      referralCode: 'REF123ABC',
      subscriptionStatus: 'Premium',
      lastLogin: '2024-12-29 10:30 AM'
    }
  })
})

// Payments Management
app.get('/api/admin/payments', (req, res) => {
  res.json({
    success: true,
    payments: [
      {
        id: 1,
        userId: 1,
        userName: 'Ahmed Hassan',
        amount: 500,
        method: 'Bank Transfer',
        status: 'Completed',
        date: '2024-12-20',
        reference: 'PAY-001'
      },
      {
        id: 2,
        userId: 2,
        userName: 'Fatima Ali',
        amount: 300,
        method: 'Cryptocurrency',
        status: 'Completed',
        date: '2024-12-21',
        reference: 'PAY-002'
      },
      {
        id: 3,
        userId: 3,
        userName: 'Mohamed Ibrahim',
        amount: 1000,
        method: 'Bank Transfer',
        status: 'Pending',
        date: '2024-12-22',
        reference: 'PAY-003'
      },
      {
        id: 4,
        userId: 4,
        userName: 'Layla Ahmed',
        amount: 200,
        method: 'Cryptocurrency',
        status: 'Failed',
        date: '2024-12-23',
        reference: 'PAY-004'
      },
      {
        id: 5,
        userId: 5,
        userName: 'Hassan Karim',
        amount: 750,
        method: 'Bank Transfer',
        status: 'Completed',
        date: '2024-12-24',
        reference: 'PAY-005'
      }
    ],
    total: 45320.5,
    completed: 32450,
    pending: 8900,
    failed: 4200
  })
})

// Withdrawals Management
app.get('/api/admin/withdrawals', (req, res) => {
  res.json({
    success: true,
    withdrawals: [
      {
        id: 1,
        userId: 1,
        userName: 'Ahmed Hassan',
        amount: 2000,
        method: 'Bank Transfer',
        status: 'Completed',
        requestDate: '2024-12-20',
        processedDate: '2024-12-21'
      },
      {
        id: 2,
        userId: 2,
        userName: 'Fatima Ali',
        amount: 1500,
        method: 'Cryptocurrency',
        status: 'Completed',
        requestDate: '2024-12-21',
        processedDate: '2024-12-22'
      },
      {
        id: 3,
        userId: 3,
        userName: 'Mohamed Ibrahim',
        amount: 3000,
        method: 'Bank Transfer',
        status: 'Pending',
        requestDate: '2024-12-25',
        processedDate: null
      },
      {
        id: 4,
        userId: 4,
        userName: 'Layla Ahmed',
        amount: 500,
        method: 'Cryptocurrency',
        status: 'Pending',
        requestDate: '2024-12-26',
        processedDate: null
      },
      {
        id: 5,
        userId: 5,
        userName: 'Hassan Karim',
        amount: 2500,
        method: 'Bank Transfer',
        status: 'Completed',
        requestDate: '2024-12-24',
        processedDate: '2024-12-25'
      }
    ],
    total: 12500,
    completed: 9500,
    pending: 3200
  })
})

// Activity Logs
app.get('/api/admin/logs', verifyToken, adminOnly, (req, res) => {
  res.json({
    success: true,
    logs: [
      {
        id: 1,
        timestamp: '2024-12-29 10:30:45',
        user: 'Ahmed Hassan',
        action: 'Login',
        details: 'Successful login from 192.168.1.1',
        type: 'LOGIN'
      },
      {
        id: 2,
        timestamp: '2024-12-29 10:35:20',
        user: 'Fatima Ali',
        action: 'Payment Submitted',
        details: 'Payment of 500 USD submitted',
        type: 'PAYMENT'
      },
      {
        id: 3,
        timestamp: '2024-12-29 10:40:15',
        user: 'Mohamed Ibrahim',
        action: 'Withdrawal Request',
        details: 'Withdrawal of 3000 USD requested',
        type: 'WITHDRAWAL'
      },
      {
        id: 4,
        timestamp: '2024-12-29 10:45:30',
        user: 'Layla Ahmed',
        action: 'Referral Added',
        details: '2 new referrals added',
        type: 'REFERRAL'
      },
      {
        id: 5,
        timestamp: '2024-12-29 11:00:00',
        user: 'Hassan Karim',
        action: 'Commission Earned',
        details: 'Commission of 250 USD earned',
        type: 'COMMISSION'
      },
      {
        id: 6,
        timestamp: '2024-12-29 11:15:30',
        user: 'Admin',
        action: 'User Suspended',
        details: 'User ID 6 suspended for violation',
        type: 'ADMIN'
      }
    ],
    total: 542
  })
})

// ============================================
// Security & Monitoring Endpoints (Admin Only)
// ============================================

// Get activity logs for a specific user
app.get(
  '/api/security/user-activities/:userId',
  verifyToken,
  adminOnly,
  (req, res) => {
    const { userId } = req.params
    const logs = activityLogger.getLog(parseInt(userId))

    res.json({
      success: true,
      userId,
      activities: logs.map((log) => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        details: log.details,
        fingerprint: log.fingerprint.substring(0, 16) + '...' // Masked for privacy
      })),
      total: logs.length
    })
  }
)

// Get suspicious activities
app.get(
  '/api/security/suspicious-activities',
  verifyToken,
  adminOnly,
  (req, res) => {
    const activities = securityMonitor.getSuspiciousActivities()
    const recent = activities.slice(-100) // Last 100

    res.json({
      success: true,
      activities: recent.map((activity) => ({
        id: activity.id,
        email: activity.email,
        ip: activity.ip,
        type: activity.type,
        severity: activity.severity,
        details: activity.details,
        timestamp: activity.timestamp
      })),
      total: activities.length,
      critical: activities.filter((a) => a.severity === 'CRITICAL').length,
      high: activities.filter((a) => a.severity === 'HIGH').length
    })
  }
)

// Get system security status
app.get('/api/security/status', verifyToken, adminOnly, (req, res) => {
  const suspiciousActivities = securityMonitor.getSuspiciousActivities()
  const blockedIPCount = securityMonitor.blockedIPs.size
  const totalLogs = Object.keys(activityLogger.logs).reduce(
    (sum, key) => sum + activityLogger.logs[key].length,
    0
  )

  res.json({
    success: true,
    status: {
      totalActivities: totalLogs,
      suspiciousActivities: suspiciousActivities.length,
      blockedIPs: blockedIPCount,
      criticalThreats: suspiciousActivities.filter(
        (a) => a.severity === 'CRITICAL'
      ).length,
      highThreat: suspiciousActivities.filter((a) => a.severity === 'HIGH')
        .length,
      activeSessions: Object.keys(tokenManager.tokens).length,
      revokedTokens: tokenManager.revokedTokens.size
    },
    recentThreats: suspiciousActivities.slice(-10)
  })
})

// Get user fingerprint info
app.get(
  '/api/security/fingerprint/:userId',
  verifyToken,
  adminOnly,
  (req, res) => {
    const { userId } = req.params
    const user = users[userId]

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    const userActivities = activityLogger.getLog(parseInt(userId))
    const fingerprints = [...new Set(userActivities.map((a) => a.fingerprint))]

    res.json({
      success: true,
      userId,
      user: {
        email: user.email,
        fullName: user.fullName,
        registeredIP: user.registeredIP,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      fingerprints: fingerprints.map((fp) => fp.substring(0, 16) + '...'),
      totalUniqueFingerprints: fingerprints.length,
      suspiciousSignIns: userActivities.filter((a) => a.action === 'LOGIN')
        .length
    })
  }
)

// Clear suspicious activity logs
app.post('/api/security/clear-logs', verifyToken, adminOnly, (req, res) => {
  securityMonitor.suspiciousActivities = []

  res.json({
    success: true,
    message: 'Suspicious activity logs cleared'
  })
})

// Block IP manually
app.post('/api/security/block-ip', verifyToken, adminOnly, (req, res) => {
  const { ip, duration } = req.body

  if (!ip) {
    return res.status(400).json({
      success: false,
      error: 'IP address is required'
    })
  }

  securityMonitor.blockIP(ip, duration || 24 * 60 * 60 * 1000)

  res.json({
    success: true,
    message: `IP ${ip} has been blocked`
  })
})

// Get token info
app.get('/api/security/tokens/:token', verifyToken, adminOnly, (req, res) => {
  const { token } = req.params
  const tokenInfo = tokenManager.getTokenInfo(token)

  if (!tokenInfo) {
    return res.status(404).json({
      success: false,
      error: 'Token not found'
    })
  }

  res.json({
    success: true,
    token: token.substring(0, 16) + '...',
    info: tokenInfo
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API server running' })
})

// Root endpoint with API info
app.get('/', (req, res) => {
  res.json({
    name: '🚀 Trading DZ Mock API Server',
    version: '1.0.0',
    status: 'running',
    description: 'Mock API for Testing - No Database Required',
    baseUrl: 'http://localhost:5001',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user'
      },
      payment: {
        'POST /api/payment/submit': 'Submit payment',
        'GET /api/payment/wallet-address': 'Get wallet address'
      },
      referrals: {
        'GET /api/referrals': 'Get user referrals',
        'GET /api/referrals/user/:userId': 'Get user referrals with stats'
      },
      dashboard: {
        'GET /api/dashboard': 'Get dashboard overview',
        'GET /api/dashboard/stats': 'Get dashboard statistics',
        'GET /api/dashboard/chart-data': 'Get chart data',
        'GET /api/dashboard/growth': 'Get growth data',
        'GET /api/dashboard/top-referrers': 'Get top referrers'
      },
      adminUsers: {
        'GET /api/admin/users': 'Get all users (admin)',
        'GET /api/admin/users/:userId': 'Get specific user details'
      },
      adminPayments: {
        'GET /api/admin/payments': 'Get all payments (admin)'
      },
      adminWithdrawals: {
        'GET /api/admin/withdrawals': 'Get all withdrawals (admin)'
      },
      adminLogs: {
        'GET /api/admin/logs': 'Get activity logs (admin)'
      },
      commissions: {
        'GET /api/commissions': 'Get commission details'
      },
      user: {
        'GET /api/user/profile': 'Get user profile'
      }
    },
    adminDashboard: 'http://localhost:5173',
    customerWebsite: 'http://localhost:3000',
    testCredentials: {
      admin: {
        email: 'admin@tradingdz.com',
        password: 'admin123'
      },
      customer: {
        email: 'test@example.com',
        password: 'password',
        referralCode: 'REF123ABC'
      }
    }
  })
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 TRADING DZ MOCK API SERVER         ║
║  Running on http://localhost:${PORT}     ║
║  (No Database Required)                ║
╚════════════════════════════════════════╝
  `)
})

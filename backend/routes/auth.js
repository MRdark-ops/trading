const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authMiddleware } = require('../middleware/auth')

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Only allow admin login
    if (user.userType !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    )

    await user.update({ lastLoginAt: new Date() })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    })
    return null
  } catch (err) {
    res.status(500).json({ error: err.message })
    return null
  }
})

// Register (Admin only - during setup)
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      username: email.split('@')[0],
      userType: 'Admin'
    })

    res.status(201).json({
      message: 'Admin created successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    })
    return null
  } catch (err) {
    res.status(500).json({ error: err.message })
    return null
  }
})

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  // In a real app, you might blacklist the token or clear sessions
  res.json({ message: 'Logged out successfully' })
})

module.exports = router

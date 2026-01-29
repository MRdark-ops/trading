const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Payment = require('../models/Payment')
const Referral = require('../models/Referral')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const { logAdminAction } = require('../utils/logger')
const { calculateTotalEarnings } = require('../utils/commissionCalculator')
const { Sequelize } = require('sequelize')

// Get all users with pagination
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      userType,
      subscriptionStatus
    } = req.query
    const offset = (page - 1) * limit

    const where = {}
    if (status) where.status = status
    if (userType) where.userType = userType
    if (subscriptionStatus) where.subscriptionStatus = subscriptionStatus

    const { count, rows } = await User.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      attributes: { exclude: ['password', 'twoFactorSecret'] },
      order: [['registrationDate', 'DESC']]
    })

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      users: rows
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single user with detailed info
router.get('/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'twoFactorSecret'] }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get user's payments
    const payments = await Payment.findAll({ where: { userId } })

    // Get user's referrals
    const referrals = await Referral.findAll({ where: { referrerId: userId } })

    // Get direct referrals who paid
    const paidReferrals = referrals.filter(
      (r) => r.paymentStatus !== 'Not Paid'
    )

    // Get downline count (all people referred directly and indirectly)
    // Simplified - in production use recursive CTE
    const directDownline = referrals.length

    const earnings = calculateTotalEarnings(directDownline)

    res.json({
      user,
      statistics: {
        totalPayments: payments.length,
        firstPaymentDate: payments.find((p) => p.type === 'First Payment')
          ?.paymentDate,
        renewalCount: payments.filter((p) => p.type === 'Renewal').length,
        totalReferrals: referrals.length,
        paidReferrals: paidReferrals.length,
        directDownline,
        estimatedEarnings: earnings
      },
      payments,
      referrals
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update user information
router.put('/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const previousValues = user.toJSON()
    await user.update(updates)

    await logAdminAction(
      req.userId,
      'UPDATE_USER',
      'User',
      userId,
      previousValues,
      updates,
      req
    )

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Change user type
router.patch(
  '/:userId/type',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params
      const { userType } = req.body

      if (!['External Member', 'Internal Member'].includes(userType)) {
        return res.status(400).json({ error: 'Invalid user type' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const previousType = user.userType
      await user.update({ userType })

      await logAdminAction(
        req.userId,
        'CHANGE_USER_TYPE',
        'User',
        userId,
        { userType: previousType },
        { userType },
        req
      )

      res.json({ message: 'User type updated', user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// Change user status
router.patch(
  '/:userId/status',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params
      const { status } = req.body

      if (!['Active', 'Suspended', 'Banned'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const previousStatus = user.status
      await user.update({ status })

      await logAdminAction(
        req.userId,
        'CHANGE_USER_STATUS',
        'User',
        userId,
        { status: previousStatus },
        { status },
        req
      )

      res.json({ message: 'User status updated', user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// Reset user earnings
router.post(
  '/:userId/reset-earnings',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const previousBalance = user.currentBalance
      const previousEarnings = user.totalEarnings

      await user.update({
        currentBalance: 0,
        totalEarnings: 0
      })

      await logAdminAction(
        req.userId,
        'RESET_EARNINGS',
        'User',
        userId,
        { currentBalance: previousBalance, totalEarnings: previousEarnings },
        { currentBalance: 0, totalEarnings: 0 },
        req
      )

      res.json({ message: 'User earnings reset', user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// Adjust user balance
router.post(
  '/:userId/adjust-balance',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params
      const { amount, reason } = req.body

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const previousBalance = user.currentBalance
      const newBalance = parseFloat(previousBalance) + parseFloat(amount)

      await user.update({ currentBalance: newBalance })

      await logAdminAction(
        req.userId,
        'ADJUST_BALANCE',
        'User',
        userId,
        { currentBalance: previousBalance, reason },
        { currentBalance: newBalance, reason },
        req
      )

      res.json({ message: 'Balance adjusted', user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// Send message to user
router.post(
  '/:userId/message',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params
      const { message } = req.body
      const sanitizedMessage = message.replace(/[\r\n]/g, '')

      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Here you would typically send the message via email, SMS, or in-app notification
      // For now, we'll log it and simulate sending
      console.log(`Message to user ${user.email}: ${sanitizedMessage}`)

      // Log the admin action
      await logAdminAction(
        req.userId,
        'SEND_MESSAGE',
        'User',
        userId,
        null,
        { message: sanitizedMessage },
        req
      )

      res.json({ message: 'Message sent successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

module.exports = router

const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Referral = require('../models/Referral');
const Withdrawal = require('../models/Withdrawal');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Dashboard overview
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: 'Active' } });
    const internalMembers = await User.count({ where: { userType: 'Internal Member' } });
    const externalMembers = await User.count({ where: { userType: 'External Member' } });

    // Subscription stats
    const totalPaidSubscriptions = await Payment.count({ where: { type: 'First Payment', status: 'Completed' } });
    const totalRenewals = await Payment.count({ where: { type: 'Renewal', status: 'Completed' } });

    // Revenue
    const revenues = await Payment.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
      ],
      where: { status: 'Completed' },
      raw: true
    });
    const totalRevenue = revenues[0]?.totalAmount || 0;

    // Pending withdrawals
    const pendingWithdrawals = await Withdrawal.count({ where: { status: 'Pending' } });

    // Referral commissions paid
    const totalEarnings = await User.sum('totalEarnings');

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        internalMembers,
        externalMembers,
        totalPaidSubscriptions,
        totalRenewals,
        totalRevenue: parseFloat(totalRevenue) || 0,
        totalReferralCommissionsPaid: parseFloat(totalEarnings) || 0,
        pendingWithdrawals
      },
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent payments
router.get('/payments/recent', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      limit: 10,
      order: [['paymentDate', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'email', 'fullName'] }
      ]
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Growth chart data
router.get('/growth', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const dailyGrowth = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('registrationDate')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['date'],
      order: [['date', 'ASC']],
      limit: 30,
      raw: true,
      subQuery: false
    });

    res.json(dailyGrowth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top referrers
router.get('/top-referrers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const topReferrers = await Referral.findAll({
      attributes: [
        'referrerId',
        [Sequelize.fn('COUNT', Sequelize.col('referrerId')), 'totalReferrals']
      ],
      group: ['referrerId'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('referrerId')), 'DESC']],
      limit: 10,
      include: [
        {
          model: User,
          as: 'referrer',
          attributes: ['id', 'email', 'fullName']
        }
      ],
      raw: true,
      subQuery: false
    });

    res.json(topReferrers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Commission = require('../models/Commission');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getCommissionBreakdown, calculateTotalEarnings } = require('../utils/commissionCalculator');

// Get commission data for a user
router.get('/user/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get downline count
    const downlineCount = await Referral.count({ where: { referrerId: userId } });

    // Get commission breakdown
    const breakdown = getCommissionBreakdown(downlineCount);

    // Get total earnings
    const totalEarnings = calculateTotalEarnings(downlineCount);

    res.json({
      userId,
      downlineCount,
      totalEarnings,
      breakdown
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all commissions
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, payoutStatus } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (payoutStatus) where.payoutStatus = payoutStatus;

    const { count, rows } = await Commission.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        { model: User, attributes: ['id', 'email', 'fullName'] }
      ],
      order: [['lastCalculatedAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      commissions: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get commission breakdown for all users (summary)
router.get('/summary/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const commissions = await Commission.findAll({
      include: [
        { model: User, attributes: ['id', 'email', 'fullName'] }
      ],
      order: [['totalEarnings', 'DESC']],
      limit: 50
    });

    const totalCommissionsPaid = await User.sum('totalEarnings');

    res.json({
      totalCommissionsPaid: parseFloat(totalCommissionsPaid) || 0,
      topEarners: commissions,
      count: commissions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

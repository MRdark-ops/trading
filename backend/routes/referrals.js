const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get referral data for a user
router.get('/user/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all referrals made by this user
    const referrals = await Referral.findAll({
      where: { referrerId: userId },
      include: [
        { model: User, as: 'referee', attributes: ['id', 'email', 'fullName', 'status'] }
      ],
      order: [['registrationDate', 'DESC']]
    });

    // Count paid referrals
    const paidReferrals = referrals.filter(r => r.paymentStatus !== 'Not Paid').length;

    // Count renewed referrals
    const renewedReferrals = referrals.filter(r => r.paymentStatus === 'Renewed').length;

    res.json({
      referrerId: userId,
      referralCode: user.referralCode,
      totalReferrals: referrals.length,
      paidReferrals,
      renewedReferrals,
      referrals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset referral statistics
router.post('/:userId/reset', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete all referrals for this user
    const deletedCount = await Referral.destroy({ where: { referrerId: userId } });

    await logAdminAction(
      req.userId,
      'RESET_REFERRALS',
      'User',
      userId,
      { referralCount: deletedCount },
      { referralCount: 0 },
      req
    );

    res.json({ message: 'Referral statistics reset', deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get referral tree (simplified - top referrers and their referrals)
router.get('/tree/top', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const topReferrers = await User.findAll({
      attributes: ['id', 'email', 'fullName', 'referralCode'],
      order: [[Sequelize.literal('(SELECT COUNT(*) FROM referrals WHERE referrals.referrer_id = "User".id)'), 'DESC']],
      limit: 20
    });

    const tree = await Promise.all(
      topReferrers.map(async (referrer) => {
        const referrals = await Referral.count({ where: { referrerId: referrer.id } });
        const paidReferrals = await Referral.count({
          where: { referrerId: referrer.id, paymentStatus: { [Sequelize.Op.ne]: 'Not Paid' } }
        });

        return {
          referrer: referrer.toJSON(),
          totalReferrals: referrals,
          paidReferrals,
          conversionRate: referrals > 0 ? ((paidReferrals / referrals) * 100).toFixed(2) + '%' : '0%'
        };
      })
    );

    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all referrals with filters
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, paymentStatus } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const { count, rows } = await Referral.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        { model: User, as: 'referrer', attributes: ['id', 'email', 'fullName'] },
        { model: User, as: 'referee', attributes: ['id', 'email', 'fullName', 'subscriptionStatus'] }
      ],
      order: [['registrationDate', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      referrals: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

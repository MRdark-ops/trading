const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { logAdminAction } = require('../utils/logger');

// Get all withdrawals with filters
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Withdrawal.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        { model: User, attributes: ['id', 'email', 'fullName', 'currentBalance'] }
      ],
      order: [['requestedAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      withdrawals: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get pending withdrawals (real-time)
router.get('/pending/list', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pending = await Withdrawal.findAll({
      where: { status: 'Pending' },
      include: [
        { model: User, attributes: ['id', 'email', 'fullName', 'currentBalance'] }
      ],
      order: [['requestedAt', 'ASC']]
    });

    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single withdrawal
router.get('/:withdrawalId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findByPk(withdrawalId, {
      include: [
        { model: User, attributes: ['id', 'email', 'fullName', 'currentBalance', 'totalEarnings'] }
      ]
    });

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    res.json(withdrawal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Request withdrawal (user endpoint)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, method, note, walletAddress } = req.body;

    // Validation: required fields
    if (!amount || !method) {
      return res.status(400).json({ error: 'Amount and method are required' });
    }

    // Validation: min amount $100
    if (parseFloat(amount) < 100) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is $100' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validation: sufficient balance
    if (parseFloat(user.currentBalance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Validation: no duplicate pending requests
    const existingPending = await Withdrawal.findOne({
      where: {
        userId: req.userId,
        status: 'Pending'
      }
    });

    if (existingPending) {
      return res.status(400).json({ error: 'You already have a pending withdrawal request' });
    }

    const withdrawal = await Withdrawal.create({
      userId: req.userId,
      amount,
      method,
      note,
      walletAddress,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      status: 'Pending'
    });

    res.status(201).json(withdrawal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve withdrawal
router.patch('/:withdrawalId/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findByPk(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending withdrawals can be approved' });
    }

    await withdrawal.update({
      status: 'Approved',
      approvedAt: new Date()
    });

    await logAdminAction(
      req.userId,
      'APPROVE_WITHDRAWAL',
      'Withdrawal',
      withdrawalId,
      { status: 'Pending' },
      { status: 'Approved' },
      req
    );

    res.json({ message: 'Withdrawal approved', withdrawal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject withdrawal
router.patch('/:withdrawalId/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { reason } = req.body;

    const withdrawal = await Withdrawal.findByPk(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending withdrawals can be rejected' });
    }

    await withdrawal.update({
      status: 'Rejected',
      rejectedAt: new Date(),
      rejectionReason: reason
    });

    await logAdminAction(
      req.userId,
      'REJECT_WITHDRAWAL',
      'Withdrawal',
      withdrawalId,
      { status: 'Pending' },
      { status: 'Rejected', reason },
      req
    );

    res.json({ message: 'Withdrawal rejected', withdrawal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as paid
router.patch('/:withdrawalId/paid', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { transactionHash } = req.body;

    const withdrawal = await Withdrawal.findByPk(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'Approved') {
      return res.status(400).json({ error: 'Only approved withdrawals can be marked as paid' });
    }

    // Deduct from user balance
    const user = await User.findByPk(withdrawal.userId);
    const newBalance = parseFloat(user.currentBalance) - parseFloat(withdrawal.amount);

    await user.update({
      currentBalance: newBalance,
      totalWithdrawals: parseFloat(user.totalWithdrawals) + parseFloat(withdrawal.amount)
    });

    await withdrawal.update({
      status: 'Paid',
      paidAt: new Date(),
      transactionHash
    });

    await logAdminAction(
      req.userId,
      'MARK_WITHDRAWAL_PAID',
      'Withdrawal',
      withdrawalId,
      { status: 'Approved' },
      { status: 'Paid', transactionHash },
      req
    );

    res.json({ message: 'Withdrawal marked as paid', withdrawal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update withdrawal status (Generic endpoint for Admin)
router.patch('/:withdrawalId/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, reason, transactionHash } = req.body;

    const withdrawal = await Withdrawal.findByPk(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    const oldStatus = withdrawal.status;

    // Handle specific status logic
    if ((status === 'Paid' || status === 'Completed') && (oldStatus !== 'Paid' && oldStatus !== 'Completed')) {
      // Deduct from user balance if not already paid
      const user = await User.findByPk(withdrawal.userId);
      const newBalance = parseFloat(user.currentBalance) - parseFloat(withdrawal.amount);

      await user.update({
        currentBalance: newBalance,
        totalWithdrawals: parseFloat(user.totalWithdrawals) + parseFloat(withdrawal.amount)
      });

      await withdrawal.update({
        status: status,
        paidAt: new Date(),
        transactionHash: transactionHash || withdrawal.transactionHash
      });
    } else if ((status === 'Rejected' || status === 'Failed') && (oldStatus !== 'Rejected' && oldStatus !== 'Failed')) {
      // If it was previously paid, we might need to refund, but for now let's assume rejection happens before payment
      // or if we are just marking it as failed without refunding (e.g. invalid transaction)
      // For safety, if it was Paid, we should probably warn or handle refund. 
      // But let's stick to simple status update for now as per request.
      
      await withdrawal.update({
        status: status,
        rejectedAt: new Date(),
        rejectionReason: reason || withdrawal.rejectionReason
      });
    } else {
      // Just update status for other cases (Pending, Progress, Approved)
      await withdrawal.update({
        status: status
      });
    }

    await logAdminAction(
      req.userId,
      'UPDATE_WITHDRAWAL_STATUS',
      'Withdrawal',
      withdrawalId,
      { status: oldStatus },
      { status: status },
      req
    );

    res.json({ message: `Withdrawal status updated to ${status}`, withdrawal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

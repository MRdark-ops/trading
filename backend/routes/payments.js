const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { logAdminAction } = require('../utils/logger');

// Get all payments
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, userId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const { count, rows } = await Payment.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['paymentDate', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'email', 'fullName', 'userType'] }
      ]
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      payments: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create payment (manual entry by admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId, amount, paymentMethod, type, subscriptionValidUntil } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const payment = await Payment.create({
      userId,
      amount,
      paymentMethod,
      type,
      status: 'Completed',
      transactionId: `MAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subscriptionValidUntil: subscriptionValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Update user subscription status
    if (type === 'First Payment') {
      await user.update({
        subscriptionStatus: 'Active',
        userType: 'External Member',
        subscriptionExpiryDate: payment.subscriptionValidUntil
      });
    } else if (type === 'Renewal') {
      await user.update({
        subscriptionStatus: 'Active',
        userType: 'Internal Member',
        subscriptionExpiryDate: payment.subscriptionValidUntil
      });
    }

    await logAdminAction(
      req.userId,
      'CREATE_PAYMENT',
      'Payment',
      payment.id,
      null,
      { userId, amount, type },
      req
    );

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payment details
router.get('/:paymentId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: User, attributes: ['id', 'email', 'fullName', 'userType', 'status'] }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment status
router.patch('/:paymentId/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed', 'Failed', 'Refunded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const previousStatus = payment.status;
    await payment.update({ status });

    await logAdminAction(
      req.userId,
      'UPDATE_PAYMENT_STATUS',
      'Payment',
      paymentId,
      { status: previousStatus },
      { status },
      req
    );

    res.json({ message: 'Payment status updated', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

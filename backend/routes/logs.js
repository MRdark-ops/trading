const express = require('express');
const router = express.Router();
const AdminLog = require('../models/AdminLog');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get admin logs with filters
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50, action, entityType, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Sequelize.Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Sequelize.Op.lte] = new Date(endDate);
    }

    const { count, rows } = await AdminLog.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        { model: User, attributes: ['id', 'email', 'fullName'] }
      ],
      order: [['timestamp', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      logs: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logs for a specific user action
router.get('/admin/:adminId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { limit = 100 } = req.query;

    const logs = await AdminLog.findAll({
      where: { adminId },
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get action statistics
router.get('/stats/summary', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const actions = await AdminLog.findAll({
      attributes: [
        'action',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['action'],
      raw: true,
      subQuery: false
    });

    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

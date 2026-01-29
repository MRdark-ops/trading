const AdminLog = require('../models/AdminLog')

const logAdminAction = async (
  adminId,
  action,
  entityType,
  entityId,
  previousValues = null,
  newValues = null,
  req = null
) => {
  try {
    await AdminLog.create({
      adminId,
      action,
      entityType,
      entityId,
      previousValues,
      newValues,
      ipAddress: req?.ip || null,
      userAgent: req?.get('user-agent') || null
    })
  } catch (err) {
    console.error('Error logging admin action:', err)
  }
}

module.exports = { logAdminAction }

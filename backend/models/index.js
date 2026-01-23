const User = require('./User');
const Payment = require('./Payment');
const Referral = require('./Referral');
const Commission = require('./Commission');
const Withdrawal = require('./Withdrawal');
const AdminLog = require('./AdminLog');

// User associations
User.hasMany(Payment, { foreignKey: 'userId' });
User.hasMany(Referral, { as: 'referrals', foreignKey: 'referrerId' });
User.hasMany(Commission, { foreignKey: 'userId' });
User.hasMany(Withdrawal, { foreignKey: 'userId' });
User.hasMany(AdminLog, { as: 'adminActions', foreignKey: 'adminId' });

// Payment associations
Payment.belongsTo(User, { foreignKey: 'userId' });

// Referral associations
Referral.belongsTo(User, { as: 'referrer', foreignKey: 'referrerId' });
Referral.belongsTo(User, { as: 'referee', foreignKey: 'refereeId' });

// Commission associations
Commission.belongsTo(User, { foreignKey: 'userId' });

// Withdrawal associations
Withdrawal.belongsTo(User, { foreignKey: 'userId' });

// AdminLog associations
AdminLog.belongsTo(User, { foreignKey: 'adminId' });

module.exports = {
  User,
  Payment,
  Referral,
  Commission,
  Withdrawal,
  AdminLog
};

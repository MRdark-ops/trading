const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  referrerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  refereeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  paymentStatus: {
    type: DataTypes.ENUM('Not Paid', 'Paid', 'Renewed'),
    defaultValue: 'Not Paid'
  },
  firstPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  renewalCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastRenewalDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'referrals'
});

module.exports = Referral;

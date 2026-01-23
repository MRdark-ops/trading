const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referralCode: {
    type: DataTypes.STRING,
    defaultValue: () => uuidv4().substring(0, 8).toUpperCase(),
    unique: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Suspended', 'Banned'),
    defaultValue: 'Active'
  },
  userType: {
    type: DataTypes.ENUM('External Member', 'Internal Member'),
    defaultValue: 'External Member'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('Free', 'Active', 'Expired'),
    defaultValue: 'Free'
  },
  subscriptionExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  currentBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  totalWithdrawals: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  referredBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'users'
});

module.exports = User;

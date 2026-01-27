const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Withdrawal = sequelize.define(
  'Withdrawal',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    walletAddress: {
      type: DataTypes.STRING,
      allowNull: true // Can be null if method is Bank/PayPal etc and details are in note or separate field
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USDT'
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Paid',
        'Progress',
        'Completed',
        'Failed'
      ),
      defaultValue: 'Pending'
    },
    requestedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionHash: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'withdrawals'
  }
)

module.exports = Withdrawal

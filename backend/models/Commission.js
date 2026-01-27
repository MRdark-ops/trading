const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Commission = sequelize.define(
  'Commission',
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
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    downlineCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    lastCalculatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    payoutStatus: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Pending Reset'),
      defaultValue: 'Pending'
    }
  },
  {
    timestamps: true,
    tableName: 'commissions'
  }
)

module.exports = Commission

// Seed data for development and testing
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

const seedAdminUser = {
  id: uuidv4(),
  username: 'admin',
  email: 'admin@tradingdz.com',
  password: bcrypt.hashSync('Admin@123456', 10),
  fullName: 'Admin User',
  phoneNumber: '+213555000000',
  country: 'Algeria',
  userType: 'External Member',
  status: 'Active',
  subscriptionStatus: 'Active',
  currentBalance: 5000,
  totalEarnings: 0,
  totalWithdrawals: 0,
  registrationDate: new Date()
}

const seedUsers = [
  {
    id: uuidv4(),
    username: 'user1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('User@123456', 10),
    fullName: 'John Doe',
    phoneNumber: '+213555000001',
    country: 'Algeria',
    userType: 'External Member',
    status: 'Active',
    subscriptionStatus: 'Active',
    currentBalance: 100,
    totalEarnings: 250,
    totalWithdrawals: 0,
    registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: uuidv4(),
    username: 'user2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('User@123456', 10),
    fullName: 'Jane Smith',
    phoneNumber: '+213555000002',
    country: 'Algeria',
    userType: 'Internal Member',
    status: 'Active',
    subscriptionStatus: 'Active',
    currentBalance: 500,
    totalEarnings: 1500,
    totalWithdrawals: 250,
    registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  }
]

module.exports = {
  seedAdminUser,
  seedUsers
}

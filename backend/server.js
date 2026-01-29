require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const sequelize = require('./config/database')

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const dashboardRoutes = require('./routes/dashboard')
const paymentsRoutes = require('./routes/payments')
const referralRoutes = require('./routes/referrals')
const withdrawalRoutes = require('./routes/withdrawals')
const commissionsRoutes = require('./routes/commissions')
const logsRoutes = require('./routes/logs')

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/referrals', referralRoutes)
app.use('/api/withdrawals', withdrawalRoutes)
app.use('/api/commissions', commissionsRoutes)
app.use('/api/logs', logsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() })
})

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Database sync and server start
const PORT = process.env.PORT || 5000

sequelize
  .sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV}`)
    })
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err)
    process.exit(1)
  })

module.exports = app

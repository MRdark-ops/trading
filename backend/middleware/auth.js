const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.isAdmin = decoded.isAdmin
    next()
    return null
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
    return null
  }
}

const adminMiddleware = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
  return null
}

module.exports = { authMiddleware, adminMiddleware }

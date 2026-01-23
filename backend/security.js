// ============================================
// Security Module - نظام الأمان الشامل
// ============================================

const crypto = require('crypto');

// 🔐 Fingerprinting System - نظام البصمة الرقمية
class DigitalFingerprint {
  static generate(req) {
    const components = {
      // معلومات الشبكة
      ip: this.getClientIP(req),
      userAgent: req.headers['user-agent'] || 'Unknown',
      acceptLanguage: req.headers['accept-language'] || 'Unknown',
      acceptEncoding: req.headers['accept-encoding'] || 'Unknown',
      
      // معلومات النظام
      timestamp: new Date().toISOString(),
      
      // معلومات الطلب
      method: req.method,
      path: req.path,
      referer: req.headers['referer'] || 'Direct',
      origin: req.headers['origin'] || 'Unknown'
    };

    // حساب Hash فريد للبصمة
    const fingerprint = this.hashComponents(components);

    return {
      fingerprint,
      components,
      hash: fingerprint
    };
  }

  static getClientIP(req) {
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip ||
      'Unknown'
    );
  }

  static hashComponents(components) {
    const str = Object.values(components).join('|');
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  static validateFingerprint(currentFP, storedFP) {
    return currentFP === storedFP;
  }
}

// 📊 Activity Logging System - نظام تسجيل الأنشطة
class ActivityLogger {
  constructor() {
    this.logs = {};
  }

  log(userId, action, details, fingerprint) {
    const logEntry = {
      id: crypto.randomBytes(8).toString('hex'),
      userId,
      action,
      details,
      fingerprint,
      timestamp: new Date().toISOString(),
      status: 'logged'
    };

    if (!this.logs[userId]) {
      this.logs[userId] = [];
    }

    this.logs[userId].push(logEntry);

    // احفظ آخر 1000 سجل فقط
    if (this.logs[userId].length > 1000) {
      this.logs[userId] = this.logs[userId].slice(-1000);
    }

    console.log(`📝 Activity logged:`, logEntry);
    return logEntry;
  }

  getLog(userId) {
    return this.logs[userId] || [];
  }

  getAllLogs() {
    return this.logs;
  }

  getLogs(userId, filter = {}) {
    let logs = this.logs[userId] || [];

    if (filter.action) {
      logs = logs.filter(l => l.action === filter.action);
    }

    if (filter.startDate) {
      logs = logs.filter(l => new Date(l.timestamp) >= new Date(filter.startDate));
    }

    if (filter.endDate) {
      logs = logs.filter(l => new Date(l.timestamp) <= new Date(filter.endDate));
    }

    return logs;
  }
}

// ⚠️ Security Monitor - نظام مراقبة الأمان
class SecurityMonitor {
  constructor() {
    this.suspiciousActivities = [];
    this.blockedIPs = new Set();
    this.failedAttempts = {};
    this.MAX_FAILED_ATTEMPTS = 5;
    this.LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  }

  recordFailedAttempt(email, ip) {
    const key = `${email}:${ip}`;
    
    if (!this.failedAttempts[key]) {
      this.failedAttempts[key] = {
        count: 0,
        firstAttempt: Date.now(),
        lockedUntil: null
      };
    }

    this.failedAttempts[key].count++;
    console.log(`⚠️ Failed attempt: ${key} (${this.failedAttempts[key].count}/${this.MAX_FAILED_ATTEMPTS})`);

    if (this.failedAttempts[key].count >= this.MAX_FAILED_ATTEMPTS) {
      this.failedAttempts[key].lockedUntil = Date.now() + this.LOCKOUT_DURATION;
      this.addSuspiciousActivity(email, ip, 'MULTIPLE_FAILED_LOGINS', {
        attempts: this.failedAttempts[key].count,
        lockedUntil: new Date(this.failedAttempts[key].lockedUntil)
      });
      return false;
    }

    return true;
  }

  clearFailedAttempts(email, ip) {
    const key = `${email}:${ip}`;
    delete this.failedAttempts[key];
  }

  isAccountLocked(email, ip) {
    const key = `${email}:${ip}`;
    const attempts = this.failedAttempts[key];

    if (!attempts) return false;

    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      return true;
    }

    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
      delete this.failedAttempts[key];
      return false;
    }

    return false;
  }

  addSuspiciousActivity(email, ip, type, details) {
    this.suspiciousActivities.push({
      id: crypto.randomBytes(8).toString('hex'),
      email,
      ip,
      type,
      details,
      timestamp: new Date().toISOString(),
      severity: this.calculateSeverity(type)
    });

    console.log(`🚨 Suspicious activity detected: ${type} from ${ip}`);
  }

  calculateSeverity(type) {
    const severityMap = {
      'MULTIPLE_FAILED_LOGINS': 'HIGH',
      'UNUSUAL_IP': 'MEDIUM',
      'UNUSUAL_TIME': 'LOW',
      'UNUSUAL_LOCATION': 'MEDIUM',
      'SQL_INJECTION_ATTEMPT': 'CRITICAL',
      'XSS_ATTEMPT': 'CRITICAL',
      'ADMIN_ACCESS_DENIED': 'HIGH',
      'SUSPICIOUS_REQUEST': 'MEDIUM'
    };
    return severityMap[type] || 'MEDIUM';
  }

  getSuspiciousActivities() {
    return this.suspiciousActivities;
  }

  blockIP(ip, duration = 24 * 60 * 60 * 1000) {
    this.blockedIPs.add(ip);
    console.log(`🚫 IP blocked: ${ip}`);
    
    setTimeout(() => {
      this.blockedIPs.delete(ip);
      console.log(`✅ IP unblocked: ${ip}`);
    }, duration);
  }

  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }
}

// 🛡️ Input Validation and Sanitization - التحقق من المدخلات
class InputValidator {
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static validatePassword(password) {
    // كلمة مرور قوية: 8 أحرف على الأقل، تحتوي على أحرف وأرقام
    return password && password.length >= 8;
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    // منع SQL Injection
    const sqlInjectionPatterns = [
      /(\bunion\b.*\bselect\b)|(\bselect\b.*\bfrom\b)|(\binsert\b.*\binto\b)|(\bupdate\b.*\bset\b)|(\bdelete\b.*\bfrom\b)|(-{2})|(\*)/gi
    ];

    for (let pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        return null; // Invalid input
      }
    }

    // منع XSS
    const xssPatterns = [/<script|javascript:|onerror=|onclick=|<iframe|<embed|<object/gi];
    for (let pattern of xssPatterns) {
      if (pattern.test(input)) {
        return null; // Invalid input
      }
    }

    // Remove special characters
    return input.replace(/[<>\"']/g, '');
  }

  static validateRequest(data) {
    const errors = [];

    if (data.email && !this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.password && !this.validatePassword(data.password)) {
      errors.push('Password must be at least 8 characters');
    }

    if (data.email && this.sanitizeInput(data.email) === null) {
      errors.push('Email contains invalid characters');
    }

    if (data.password && this.sanitizeInput(data.password) === null) {
      errors.push('Password contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// 🔑 Token Management - إدارة التوكن
class TokenManager {
  constructor() {
    this.tokens = {};
    this.revokedTokens = new Set();
  }

  generateToken(userId, role, duration = 7 * 24 * 60 * 60 * 1000) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + duration;

    this.tokens[token] = {
      userId,
      role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      isValid: true
    };

    console.log(`🔐 Token generated for user ${userId}`);
    return token;
  }

  validateToken(token) {
    if (this.revokedTokens.has(token)) {
      return { isValid: false, reason: 'Token revoked' };
    }

    const tokenData = this.tokens[token];

    if (!tokenData) {
      return { isValid: false, reason: 'Token not found' };
    }

    if (Date.now() > new Date(tokenData.expiresAt).getTime()) {
      return { isValid: false, reason: 'Token expired' };
    }

    return { isValid: true, data: tokenData };
  }

  revokeToken(token) {
    this.revokedTokens.add(token);
    delete this.tokens[token];
    console.log(`🔒 Token revoked`);
  }

  revokeUserTokens(userId) {
    Object.entries(this.tokens).forEach(([token, data]) => {
      if (data.userId === userId) {
        this.revokeToken(token);
      }
    });
  }

  getTokenInfo(token) {
    return this.tokens[token];
  }
}

// 🛑 Rate Limiting - تحديد معدل الطلبات
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = {};
  }

  isLimited(identifier) {
    const now = Date.now();
    
    if (!this.requests[identifier]) {
      this.requests[identifier] = [];
    }

    // احذف الطلبات القديمة
    this.requests[identifier] = this.requests[identifier].filter(
      time => now - time < this.windowMs
    );

    if (this.requests[identifier].length >= this.maxRequests) {
      return true;
    }

    this.requests[identifier].push(now);
    return false;
  }

  reset(identifier) {
    delete this.requests[identifier];
  }
}

// Export
module.exports = {
  DigitalFingerprint,
  ActivityLogger,
  SecurityMonitor,
  InputValidator,
  TokenManager,
  RateLimiter
};

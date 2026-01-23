# Environment Configuration Guide

## Backend Environment (.env)

### Database Configuration
```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_platform_db
DB_USER=postgres
DB_PASSWORD=your_secure_password_here

# Connection Pool
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

### Authentication
```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Admin Setup
ADMIN_EMAIL=admin@tradingdz.com
ADMIN_PASSWORD=secure_password_change_this
```

### Server Configuration
```env
# Server
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Redis Configuration (Optional)
```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Email Configuration (Optional)
```env
# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@tradingdz.com
```

### Two-Factor Authentication (Optional)
```env
# 2FA
TWOFACTOR_ENABLED=false
TWOFACTOR_SECRET=your_2fa_secret_key
```

---

## Frontend Environment (.env)

### API Configuration
```env
# API Base URL
VITE_API_BASE=http://localhost:5000/api
```

### Application Configuration
```env
# App Configuration
VITE_APP_NAME=Trading Admin Dashboard
VITE_APP_VERSION=1.0.0
```

---

## Production Environment Variables

### Backend (.env.production)
```env
# Database (Production)
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=trading_platform_db
DB_USER=prod_user
DB_PASSWORD=very_secure_production_password

# JWT (Change these!)
JWT_SECRET=generate_a_long_random_string_for_production
JWT_EXPIRE=24h

# Server
PORT=5000
NODE_ENV=production
LOG_LEVEL=info

# CORS (Your Domain)
CORS_ORIGIN=https://yourdomain.com

# Redis (Production)
REDIS_HOST=redis-production-host
REDIS_PORT=6379
REDIS_PASSWORD=redis_production_password
```

### Frontend (.env.production)
```env
# Production API
VITE_API_BASE=https://api.yourdomain.com/api
VITE_APP_NAME=Trading Admin Dashboard
```

---

## Development Environment Variables

### Backend (.env.development)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_platform_dev
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=dev_secret_key_not_for_production
JWT_EXPIRE=24h

PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

CORS_ORIGIN=http://localhost:3000

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (.env.development)
```env
VITE_API_BASE=http://localhost:5000/api
VITE_APP_NAME=Trading Admin (Dev)
```

---

## Testing Environment Variables

### Backend (.env.test)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_platform_test
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=test_secret_key

PORT=5001
NODE_ENV=test
LOG_LEVEL=error

CORS_ORIGIN=http://localhost:3000
```

---

## Docker Environment Variables

### Docker (.env.docker)
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=trading_platform_db
DB_USER=postgres
DB_PASSWORD=postgres

# Backend
JWT_SECRET=docker_jwt_secret_change_in_production
PORT=5000
NODE_ENV=production

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Frontend
VITE_API_BASE=http://localhost:5000/api
```

---

## Environment Variable Security Best Practices

### ✅ DO:
- Store sensitive values in .env files (never commit to git)
- Use strong, random secrets for JWT
- Rotate secrets regularly
- Use environment-specific configs
- Document all required variables
- Keep .env.example updated

### ❌ DON'T:
- Commit .env files to version control
- Hardcode secrets in code
- Use weak passwords
- Share credentials across environments
- Log sensitive data
- Use same secrets for dev and production

---

## How to Generate Secrets

### JWT Secret (Linux/Mac)
```bash
openssl rand -hex 32
```

### JWT Secret (Windows PowerShell)
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32)))
```

### Using Node.js
```javascript
require('crypto').randomBytes(32).toString('hex')
```

---

## Configuration Validation

### Check Required Variables
```bash
# Backend
grep -E '^[A-Z_]+=.*' .env | wc -l
```

### Load Environment in Code
```javascript
// backend/config/env.js
require('dotenv').config();

const required = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'JWT_SECRET',
  'PORT'
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

---

## Docker Compose Variables

### Load from .env
```yaml
# docker-compose.yml
env_file:
  - .env
```

### Override in docker-compose.yml
```yaml
environment:
  - DB_HOST=postgres
  - NODE_ENV=production
```

---

## CI/CD Pipeline Variables

### GitHub Actions Example
```yaml
env:
  NODE_ENV: production
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  DB_HOST: ${{ secrets.DB_HOST }}
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

### GitLab CI Example
```yaml
variables:
  NODE_ENV: production
  JWT_SECRET: $JWT_SECRET
  DB_HOST: $DB_HOST
```

---

## Troubleshooting

### Variable Not Loading
1. Check .env file exists
2. Verify file is in correct directory
3. Check NODE_ENV is set correctly
4. Restart server after changing .env

### Port Already in Use
```bash
# Find what's using port 5000
lsof -i :5000
```

### Database Connection Failed
1. Check DB_HOST is correct
2. Verify DB_USER and DB_PASSWORD
3. Ensure PostgreSQL is running
4. Check database name exists

---

## Environment Checklist

### Before Development
- [ ] Copy .env.example to .env
- [ ] Update all required variables
- [ ] Set NODE_ENV=development
- [ ] Verify database connection
- [ ] Test JWT token generation

### Before Testing
- [ ] Use test database
- [ ] Set NODE_ENV=test
- [ ] Verify test-specific configs
- [ ] Clear test data before run

### Before Production
- [ ] Generate strong JWT_SECRET
- [ ] Use production database
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Review security headers

### Before Deployment
- [ ] All secrets set in hosting platform
- [ ] Database backups configured
- [ ] Monitoring and alerts enabled
- [ ] SSL certificates installed
- [ ] Environment variables documented
- [ ] Rollback plan in place

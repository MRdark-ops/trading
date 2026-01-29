# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis (optional)
- Docker & Docker Compose (for containerized deployment)
- Git
- A hosting provider (Heroku, AWS, DigitalOcean, etc.)

---

## Local Development Deployment

### 1. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

**Frontend (.env):**

```bash
echo 'VITE_API_BASE=http://localhost:5000/api' > frontend/.env
```

### 3. Database Setup

**Create Database:**

```bash
psql -U postgres
CREATE DATABASE trading_platform_db;
\q
```

**Initialize Schema:**

```bash
# Sequelize will auto-create tables on startup
cd backend
npm run dev
```

### 4. Run Applications

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## Docker Deployment (Recommended)

### 1. Ensure Docker is Installed

```bash
docker --version
docker-compose --version
```

### 2. Build Images

```bash
docker-compose build
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Initialize Database

```bash
docker-compose exec backend node scripts/seed.js
```

### 5. Access Application

- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- Database: localhost:5432

### 6. View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Production Deployment (Heroku)

### Backend Deployment

#### 1. Create Heroku App

```bash
heroku create your-app-name-api
```

#### 2. Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev -a your-app-name-api
```

#### 3. Set Environment Variables

```bash
heroku config:set -a your-app-name-api \
  JWT_SECRET=your_production_secret \
  NODE_ENV=production \
  DB_HOST=your_db_host \
  DB_USER=your_db_user \
  DB_PASSWORD=your_db_password
```

#### 4. Deploy Backend

```bash
cd backend
heroku git:remote -a your-app-name-api
git push heroku main
```

### Frontend Deployment

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

#### 2. Create Heroku App

```bash
heroku create your-app-name
```

#### 3. Add Buildpack

```bash
heroku buildpacks:add heroku/nodejs -a your-app-name
```

#### 4. Set Environment Variables

```bash
heroku config:set -a your-app-name \
  VITE_API_BASE=https://your-app-name-api.herokuapp.com/api
```

#### 5. Deploy Frontend

```bash
cd frontend
git push heroku main
```

---

## Production Deployment (AWS EC2)

### 1. Launch EC2 Instance

- Ubuntu 20.04 LTS
- t3.micro (free tier) or larger
- Open ports: 80, 443, 5000, 3000
- Security group with HTTPS enabled

### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### 3. Install Dependencies

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib redis-server nginx git

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Clone Repository

```bash
git clone https://github.com/your-repo/trading-platform.git
cd trading-platform
```

### 5. Configure PostgreSQL

```bash
sudo su - postgres
createdb trading_platform_db
psql
# Set password:
ALTER USER postgres PASSWORD 'your_password';
\q
exit
```

### 6. Deploy Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with production settings
npm run build  # if applicable
npm start
```

### 7. Setup Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/trading-api

# Add configuration:
server {
    listen 5000;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. Deploy Frontend

```bash
cd ../frontend
npm install
npm run build
# Serve dist folder
npx serve -s dist -l 3000
```

### 9. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### 10. Enable Systemd Services

```bash
# Backend service
sudo nano /etc/systemd/system/trading-backend.service

[Unit]
Description=Trading Platform Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/trading-platform/backend
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable trading-backend.service
sudo systemctl start trading-backend.service
```

---

## Production Deployment (DigitalOcean)

### 1. Create Droplet

- Ubuntu 20.04 LTS
- $5/month (1GB RAM, 1 vCPU)
- Enable backups
- Add SSH key

### 2. Initial Setup

```bash
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser ubuntu
usermod -aG sudo ubuntu

# Install dependencies
apt install -y nodejs npm postgresql postgresql-contrib redis-server nginx git curl

# Switch to user
su - ubuntu
```

### 3. Clone and Deploy

```bash
git clone https://github.com/your-repo/trading-platform.git
cd trading-platform

# Backend
cd backend
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run build
npx serve -s dist
```

### 4. Configure App Platform (Alternative)

- Use DigitalOcean App Platform for easier deployment
- Connect GitHub repository
- Automatic deployments on push
- Built-in SSL/HTTPS

---

## Production Deployment (AWS RDS + Lambda + S3)

### 1. Create RDS PostgreSQL Instance

- Multi-AZ enabled
- Automated backups
- Enhanced monitoring
- Security group with app access

### 2. Create Lambda Functions

- Backend API as Lambda functions
- API Gateway for routing
- Auto-scaling

### 3. Deploy Frontend to S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Create CloudFront distribution
# Point to S3 bucket
```

### 4. Configure Auto Scaling

- Target group health checks
- Load balancer
- Auto-scaling policies

---

## Monitoring & Maintenance

### 1. Setup Monitoring

```bash
# Install PM2 for process management
npm install -g pm2
pm2 start backend/server.js
pm2 save
pm2 startup
```

### 2. View Logs

```bash
pm2 logs
journalctl -u trading-backend.service
tail -f /var/log/nginx/access.log
```

### 3. Database Backups

```bash
# Automated backup script
sudo nano /usr/local/bin/backup-db.sh

#!/bin/bash
pg_dump trading_platform_db | gzip > /backups/db-$(date +%Y%m%d).sql.gz

# Schedule with cron
sudo crontab -e
0 2 * * * /usr/local/bin/backup-db.sh  # Daily at 2 AM
```

### 4. SSL Certificate Renewal

```bash
sudo certbot renew --quiet  # Automatic with systemd timer
```

---

## Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### 2. Cache Strategy

- Redis for sessions
- Cache dashboard stats
- Cache user counts
- Cache top referrers

### 3. API Optimization

- Pagination on all endpoints
- Field limiting in queries
- Compression (gzip)
- Connection pooling

### 4. Frontend Optimization

- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets

---

## Security Hardening

### 1. Firewall Rules

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
```

### 2. SSL/HTTPS

- Get certificate from Let's Encrypt
- Auto-renewal with certbot
- HTTP to HTTPS redirect

### 3. Database Security

- Change default password
- Use role-based access
- Enable SSL connections
- Regular backups

### 4. API Security

- Rate limiting
- CORS properly configured
- Input validation
- SQL injection prevention

### 5. Environment Variables

- Use `.env` files
- Never commit secrets
- Use environment management
- Rotate keys regularly

---

## CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

---

## Health Checks

### Backend Health Check

```bash
curl http://localhost:5000/api/health
# Response: { "status": "OK" }
```

### Monitor with Uptime Robot

- Add /api/health endpoint
- Check every 5 minutes
- Get alerts if down

---

## Disaster Recovery

### 1. Database Backup

```bash
# Automated daily backups
pg_dump trading_platform_db | gzip > /backups/backup-$(date +%Y%m%d).sql.gz

# Store to S3
aws s3 cp backup-20240115.sql.gz s3://your-bucket/backups/
```

### 2. Restore from Backup

```bash
gunzip < /backups/backup-20240115.sql.gz | psql trading_platform_db
```

### 3. Application Rollback

```bash
git revert <commit-hash>
git push
# Redeploy
```

---

## Troubleshooting Deployment

### Port Already in Use

```bash
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Connect to database
psql -U postgres -h localhost trading_platform_db
```

### Nginx Configuration Error

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Permission Denied Errors

```bash
sudo chown -R ubuntu:ubuntu /path/to/app
chmod -R 755 /path/to/app
```

---

## Deployment Checklist

- [ ] Database created and configured
- [ ] Environment variables set
- [ ] Backend deployed and running
- [ ] Frontend built and deployed
- [ ] SSL/HTTPS configured
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Logging configured
- [ ] Security hardened
- [ ] Performance tested
- [ ] Health checks active
- [ ] Documentation updated

---

## Support Resources

- Node.js Documentation: https://nodejs.org/docs/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Express.js Guide: https://expressjs.com/
- React Documentation: https://react.dev/
- Docker Guide: https://docs.docker.com/
- Heroku DevCenter: https://devcenter.heroku.com/
- AWS Documentation: https://aws.amazon.com/documentation/

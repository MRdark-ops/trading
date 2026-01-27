# Trading Admin Dashboard - Setup Guide

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis (optional, for real-time stats)

### Backend Setup

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=trading_platform_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=generate_a_secure_random_key
   PORT=5000
   NODE_ENV=development
   ```

3. **Create Database**

   ```bash
   psql -U postgres -c "CREATE DATABASE trading_platform_db;"
   ```

4. **Run Seeds (Optional)**

   ```bash
   node scripts/seed.js
   ```

5. **Start Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Create Environment File** (Optional)

   ```bash
   echo 'VITE_API_BASE=http://localhost:5000/api' > .env
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## Docker Setup

1. **Build Images**

   ```bash
   docker-compose build
   ```

2. **Start Services**

   ```bash
   docker-compose up
   ```

3. **Create Database** (First time)
   ```bash
   docker-compose exec backend node scripts/seed.js
   ```

Access dashboard at `http://localhost:3000`

## Default Admin Credentials (After Seed)

- **Email**: admin@tradingdz.com
- **Password**: Admin@123456

⚠️ **IMPORTANT**: Change these credentials immediately in production!

## Database Setup

The system uses PostgreSQL. Create the database:

```sql
CREATE DATABASE trading_platform_db;
\c trading_platform_db;
```

Tables are created automatically on first run using Sequelize migrations.

## API Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tradingdz.com","password":"Admin@123456"}'

# Get Dashboard
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

Import the API endpoints from the documentation in README.md

## Project Structure

```
tradnig/
├── backend/
│   ├── config/          # Database & middleware config
│   ├── models/          # Sequelize models
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & custom middleware
│   ├── utils/           # Helper functions
│   ├── scripts/         # Utility scripts
│   ├── seeds/           # Seed data
│   ├── server.js        # Main entry
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── api/         # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error

- Verify PostgreSQL is running
- Check credentials in .env
- Ensure database exists

### JWT Token Issues

- Verify JWT_SECRET is set
- Check token expiration (24h default)
- Ensure Authorization header format: `Bearer <token>`

### CORS Errors

- Update frontend URL in backend cors config
- Verify API_BASE in frontend .env

## Performance Optimization

1. **Database Indexing**

   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
   CREATE INDEX idx_payments_user ON payments(user_id);
   ```

2. **Redis Caching**
   - Enable Redis in .env
   - Cache dashboard stats
   - Cache user counts

3. **Pagination**
   - Implement on all list endpoints
   - Default limit: 20 items
   - Adjust for performance

## Security Checklist

- [ ] Change admin credentials
- [ ] Update JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable 2FA
- [ ] Configure rate limiting
- [ ] Review CORS settings
- [ ] Use environment variables
- [ ] Regular security audits

## Monitoring

### Logs

- Backend: Check console output
- Database: PostgreSQL logs
- Activity: Check `admin_logs` table

### Health Check

```bash
curl http://localhost:5000/api/health
```

## Deployment

### Production Build

```bash
# Backend
NODE_ENV=production npm start

# Frontend
npm run build
```

### Environment Variables

Set these in your hosting platform:

- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET
- NODE_ENV=production
- API URL for frontend

## Support & Troubleshooting

For more detailed information:

1. Check backend logs
2. Review README.md
3. Check database schema
4. Verify API endpoints in routes files
5. Enable debug mode for detailed logs

## Next Steps

1. Customize branding and colors
2. Integrate payment gateway
3. Set up email notifications
4. Configure backup strategy
5. Implement advanced analytics
6. Add mobile app
7. Set up CI/CD pipeline

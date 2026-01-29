require('dotenv').config();
const sequelize = require('../config/database');
const { User, Referral } = require('../models');
const { seedAdminUser, seedUsers } = require('../seeds/initial');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync models
    await sequelize.sync({ force: true });
    console.log('Models synced');

    // Seed admin user
    await User.create(seedAdminUser);
    console.log('Admin user created');

    // Seed regular users
    const createdUsers = await User.bulkCreate(seedUsers);
    console.log(`${createdUsers.length} test users created`);

    // Create sample referrals
    const referrer = createdUsers[0];
    const referee = createdUsers[1];
    
    await Referral.create({
      id: uuidv4(),
      referrerId: referrer.id,
      refereeId: referee.id,
      paymentStatus: 'Paid',
      firstPaymentDate: new Date()
    });
    console.log('Sample referral created');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

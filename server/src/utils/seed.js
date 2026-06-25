// Creates a demo user so you can log in immediately without registering.
// Run with: npm run seed (from the server/ directory)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const email = 'demo@leadfinderpro.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log(`Demo user already exists: ${email} / demo1234`);
  } else {
    await User.create({
      name: 'Demo User',
      email,
      password: 'demo1234',
    });
    console.log(`Demo user created: ${email} / demo1234`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

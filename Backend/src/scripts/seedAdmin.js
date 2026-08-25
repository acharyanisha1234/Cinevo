import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
dotenv.config();
connectDB();

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@cinevo.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  if (await User.findOne({ email })) {
    console.log('Admin already exists');
    process.exit(0);
  }
  await User.create({ name: 'Admin', email, password, role: 'admin' });
  console.log('Admin created');
  process.exit(0);
};
seedAdmin();
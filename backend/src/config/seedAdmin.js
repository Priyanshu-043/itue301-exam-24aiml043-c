const bcrypt = require('bcryptjs');
const Member = require('../models/Member');

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!email || !password) return;

  const existingAdmin = await Member.findOne({ email });
  if (existingAdmin) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Member.create({
    name: process.env.ADMIN_NAME || 'FitZone Admin',
    email,
    phone: process.env.ADMIN_PHONE || '0000000000',
    passwordHash,
    role: 'Admin',
    membershipType: 'platinum'
  });

  console.log(`Admin account created: ${email}`);
}

module.exports = seedAdmin;

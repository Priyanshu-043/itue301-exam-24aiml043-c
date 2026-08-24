const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

function createToken(member) {
  return jwt.sign(
    { memberId: member._id.toString(), role: 'Member' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

function memberResponse(member) {
  return {
    id: member._id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    membershipType: member.membershipType,
    role: member.role
  };
}

async function signup(req, res, next) {
  try {
    const { name, email, phone, password, membershipType } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email, phone and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'password must be at least 6 characters'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingMember = await Member.findOne({ email: normalizedEmail });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const member = new Member({
      name,
      email: normalizedEmail,
      phone,
      passwordHash,
      ...(membershipType !== undefined ? { membershipType } : {})
    });

    const savedMember = await member.save();
    const token = createToken(savedMember);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      member: memberResponse(savedMember)
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required'
      });
    }

    const member = await Member.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

    if (!member || !(await bcrypt.compare(password, member.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = createToken(member);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      member: memberResponse(member)
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };

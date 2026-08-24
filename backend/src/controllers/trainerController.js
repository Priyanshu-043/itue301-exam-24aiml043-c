const bcrypt = require('bcryptjs');
const Trainer = require('../models/Trainer');
const ClassBooking = require('../models/ClassBooking');

async function getTrainers(req, res, next) {
  try {
    const trainers = await Trainer.find().select('-passwordHash -__v').sort({ name: 1 });
    res.status(200).json({ success: true, count: trainers.length, trainers });
  } catch (err) { next(err); }
}

async function createTrainer(req, res, next) {
  try {
    const { name, email, specialization, password, available } = req.body;
    if (!name || !email || !specialization || !password) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [
        ...(!name ? ['name is required'] : []),
        ...(!email ? ['email is required'] : []),
        ...(!specialization ? ['specialization is required'] : []),
        ...(!password ? ['password is required'] : [])
      ] });
    }
    if (password.length < 6) return res.status(400).json({ success: false, message: 'password must be at least 6 characters' });
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Trainer.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ success: false, message: 'Trainer email is already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const trainer = new Trainer({ name, email: normalizedEmail, specialization, passwordHash, ...(available !== undefined ? { available } : {}) });
    const savedTrainer = await trainer.save();
    const cleanTrainer = await Trainer.findById(savedTrainer._id).select('-passwordHash -__v');
    return res.status(201).json({ success: true, message: 'Trainer added successfully', trainer: cleanTrainer });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Validation failed', errors: Object.values(err.errors).map((item) => item.message) });
    next(err);
  }
}

async function getTrainerCommitments(req, res, next) {
  try {
    const bookings = await ClassBooking.find({ trainerId: req.member._id })
      .populate('memberId', 'name email phone')
      .populate('trainerId', 'name specialization')
      .sort({ date: 1, timeSlot: 1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) { next(err); }
}

module.exports = { getTrainers, createTrainer, getTrainerCommitments };

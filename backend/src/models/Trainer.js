const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Trainer specialization is required'],
      trim: true
    },
    available: {
      type: Boolean,
      default: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Trainer password is required'],
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);

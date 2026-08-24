const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Member email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Member phone is required'],
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Member password is required'],
      select: false
    },
    membershipType: {
      type: String,
      enum: {
        values: ['basic', 'premium', 'platinum'],
        message: 'membershipType must be basic, premium, or platinum'
      },
      default: 'basic'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);

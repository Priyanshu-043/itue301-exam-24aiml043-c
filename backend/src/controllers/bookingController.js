const ClassBooking = require('../models/ClassBooking');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

async function createBooking(req, res, next) {
  try {
    const { trainerId, className, date, timeSlot, status } = req.body;

    const missingFields = ['trainerId', 'className', 'date', 'timeSlot'].filter(
      (field) => req.body[field] === undefined || req.body[field] === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: missingFields.map((field) => `${field} is required`)
      });
    }

    const [member, trainer] = await Promise.all([
      Member.findById(req.member._id),
      Trainer.findById(trainerId)
    ]);

    if (!member) {
      return res.status(400).json({
        success: false,
        message: 'Member does not exist'
      });
    }

    if (!trainer) {
      return res.status(400).json({
        success: false,
        message: 'Trainer does not exist'
      });
    }

    if (!trainer.available) {
      return res.status(400).json({
        success: false,
        message: 'Selected trainer is not available'
      });
    }

    const booking = new ClassBooking({
      memberId: req.member._id,
      trainerId,
      className,
      date,
      timeSlot,
      ...(status !== undefined ? { status } : {})
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: savedBooking
    });
  } catch (err) {
    next(err);
  }
}

async function getMyBookings(req, res, next) {
  try {
    const bookings = await ClassBooking.find({ memberId: req.member._id })
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const allowedStatuses = ['booked', 'attended', 'cancelled'];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'status must be booked, attended, or cancelled'
      });
    }

    const booking = await ClassBooking.findOneAndUpdate(
      { _id: req.params.id, memberId: req.member._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'Booking not found for this member'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};

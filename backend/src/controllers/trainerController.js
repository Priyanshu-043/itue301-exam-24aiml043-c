const Trainer = require('../models/Trainer');

async function getTrainers(req, res, next) {
  try {
    const trainers = await Trainer.find().select('-__v').sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      trainers
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTrainers };

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


async function createTrainer(req, res, next) {
  try {
    const { name, specialization, available } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          ...(!name ? ['name is required'] : []),
          ...(!specialization ? ['specialization is required'] : [])
        ]
      });
    }

    const trainer = new Trainer({
      name,
      specialization,
      ...(available !== undefined ? { available } : {})
    });

    const savedTrainer = await trainer.save();

    return res.status(201).json({
      success: true,
      message: 'Trainer added successfully',
      trainer: savedTrainer
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(err.errors).map((item) => item.message)
      });
    }
    next(err);
  }
}

module.exports = { getTrainers, createTrainer };

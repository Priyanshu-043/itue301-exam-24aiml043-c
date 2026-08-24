const express = require('express');
const { getTrainers } = require('../controllers/trainerController');

const router = express.Router();

router.get('/', getTrainers);

module.exports = router;

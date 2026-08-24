const express = require('express');
const { getTrainers, createTrainer } = require('../controllers/trainerController');
const authGuard = require('../middleware/authGuard');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

router.get('/', getTrainers);
router.post('/', authGuard, roleGuard('Admin'), createTrainer);

module.exports = router;

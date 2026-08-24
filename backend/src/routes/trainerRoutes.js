const express = require('express');
const { getTrainers, createTrainer, getTrainerCommitments } = require('../controllers/trainerController');
const authGuard = require('../middleware/authGuard');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();

router.get('/', getTrainers);
router.get('/me/commitments', authGuard, roleGuard('Trainer'), getTrainerCommitments);
router.post('/', authGuard, roleGuard('Admin'), createTrainer);

module.exports = router;

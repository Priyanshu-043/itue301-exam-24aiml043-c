const express = require('express');
const authGuard = require('../middleware/authGuard');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus
} = require('../controllers/bookingController');

const router = express.Router();

router.use(authGuard);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;

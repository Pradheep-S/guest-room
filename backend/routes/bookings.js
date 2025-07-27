const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBookings)
  .post(authorize('customer'), createBooking);

router.get('/stats', authorize('houseOwner', 'admin'), getBookingStats);

router.route('/:id')
  .get(getBooking);

router.put('/:id/status', authorize('houseOwner', 'admin'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

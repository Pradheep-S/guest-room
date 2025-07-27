const express = require('express');
const {
  getAllReviews,
  getPropertyReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/property/:propertyId', getPropertyReviews);

// Protected routes
router.use(protect);

router.route('/')
  .get(authorize('admin'), getAllReviews)
  .post(authorize('customer'), createReview);

router.get('/user', getUserReviews);

router.route('/:id')
  .put(authorize('customer'), updateReview)
  .delete(authorize('customer', 'admin'), deleteReview);

module.exports = router;

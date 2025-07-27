const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews by a user
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('property', 'name location')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Customer only)
const createReview = async (req, res) => {
  try {
    const { property, rating, comment } = req.body;

    // Validate required fields
    if (!property || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user has completed booking for this property
    const completedBooking = await Booking.findOne({
      user: req.user.id,
      property: property,
      status: 'completed'
    });

    if (!completedBooking) {
      return res.status(400).json({ 
        message: 'You can only review properties where you have completed a booking' 
      });
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
      user: req.user.id,
      property: property
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this property' 
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      property,
      rating: Number(rating),
      comment
    });

    // Update property average rating
    await updatePropertyRating(property);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('property', 'name location');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Customer who created the review)
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.updatedAt = Date.now();

    await review.save();

    // Update property average rating
    await updatePropertyRating(review.property);

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('property', 'name location');

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Customer who created the review or Admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const propertyId = review.property;
    await Review.findByIdAndDelete(req.params.id);

    // Update property average rating
    await updatePropertyRating(propertyId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Private (Admin only)
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('property', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments();

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to update property average rating
const updatePropertyRating = async (propertyId) => {
  try {
    const reviews = await Review.find({ property: propertyId });
    
    if (reviews.length === 0) {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: 0,
        totalReviews: 0
      });
    } else {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        totalReviews: reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating property rating:', error);
  }
};

module.exports = {
  getPropertyReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews
};

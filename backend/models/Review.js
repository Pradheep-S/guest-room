const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  categories: {
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    checkIn: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    accuracy: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    location: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  images: [{
    url: String,
    public_id: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  ownerResponse: {
    message: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Indexes for efficient queries
reviewSchema.index({ room: 1, isVisible: 1, createdAt: -1 });
reviewSchema.index({ property: 1, isVisible: 1, createdAt: -1 });
reviewSchema.index({ guest: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);

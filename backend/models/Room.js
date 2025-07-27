const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  floorSize: {
    type: Number,
    required: [true, 'Floor size is required'],
    min: [50, 'Floor size must be at least 50 sq ft']
  },
  numberOfBeds: {
    type: Number,
    required: [true, 'Number of beds is required'],
    min: [1, 'Must have at least 1 bed'],
    max: [10, 'Cannot exceed 10 beds']
  },
  bedType: {
    type: String,
    enum: ['Single', 'Double', 'Queen', 'King', 'Bunk'],
    default: 'Double'
  },
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [1, 'Price must be at least ₹1']
  },
  amenities: [{
    type: String,
    enum: [
      'Wi-Fi', 'AC', 'TV', 'Breakfast', 'Balcony', 'Kitchen Access', 
      'Private Bathroom', 'Shared Bathroom', 'Wardrobe', 'Study Table',
      'Mini Fridge', 'Microwave', 'Coffee Maker', 'Hair Dryer',
      'Iron', 'Safe', 'Heater', 'Fan', 'Intercom'
    ]
  }],
  images: [{
    url: String,
    public_id: String
  }],
  bookingRules: {
    minimumStay: {
      type: Number,
      default: 1,
      min: 1
    },
    maximumStay: {
      type: Number,
      default: 30,
      min: 1
    },
    advanceBookingDays: {
      type: Number,
      default: 365,
      min: 1
    },
    instantBooking: {
      type: Boolean,
      default: false
    }
  },
  availability: [{
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    reason: String // For blocked dates
  }],
  blockedDates: [{
    startDate: Date,
    endDate: Date,
    reason: String
  }],
  roomNumber: String,
  floor: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  lastBookedDate: Date
}, {
  timestamps: true
});

// Indexes for efficient queries
roomSchema.index({ property: 1, isActive: 1 });
roomSchema.index({ owner: 1, isActive: 1 });
roomSchema.index({ pricePerDay: 1 });
roomSchema.index({ numberOfBeds: 1 });
roomSchema.index({ averageRating: -1 });

// Virtual for calculating availability
roomSchema.virtual('isCurrentlyAvailable').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if room is blocked for today
  const isBlocked = this.blockedDates.some(block => {
    return today >= block.startDate && today <= block.endDate;
  });
  
  return this.isActive && !isBlocked;
});

module.exports = mongoose.model('Room', roomSchema);

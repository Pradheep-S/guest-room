const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Must have at least 1 guest']
  },
  guestDetails: [{
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120
    },
    idType: {
      type: String,
      enum: ['Aadhar', 'PAN', 'Passport', 'Driving License'],
      required: true
    },
    idNumber: {
      type: String,
      required: true
    }
  }],
  totalDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  taxes: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'Wallet'],
    default: 'Cash'
  },
  paymentId: String,
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed', 'No Show'],
    default: 'Pending'
  },
  cancellationReason: String,
  cancellationDate: Date,
  cancellationCharges: {
    type: Number,
    default: 0
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  specialRequests: String,
  checkInTime: String,
  checkOutTime: String,
  actualCheckInDate: Date,
  actualCheckOutDate: Date,
  isReviewed: {
    type: Boolean,
    default: false
  },
  bookingSource: {
    type: String,
    enum: ['Website', 'Mobile App', 'Phone', 'Walk-in'],
    default: 'Website'
  },
  confirmationCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate confirmation code before saving
bookingSchema.pre('save', function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'GR' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

// Indexes for efficient queries
bookingSchema.index({ guest: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, createdAt: -1 });
bookingSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ confirmationCode: 1 });
bookingSchema.index({ bookingStatus: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  return Math.ceil((this.checkOutDate - this.checkInDate) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Booking', bookingSchema);

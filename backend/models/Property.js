const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true,
    maxlength: [100, 'Property name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    public_id: String
  }],
  amenities: [{
    type: String,
    enum: [
      'Wi-Fi', 'AC', 'TV', 'Breakfast', 'Parking', 'Gym', 'Pool', 
      'Balcony', 'Kitchen', 'Laundry', 'Pet Friendly', 'Garden',
      'Security', 'Elevator', 'Housekeeping', 'Room Service'
    ]
  }],
  propertyType: {
    type: String,
    enum: ['House', 'Apartment', 'Villa', 'Hostel', 'Hotel', 'Resort'],
    required: true
  },
  totalRooms: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '11:00'
  },
  cancellationPolicy: {
    type: String,
    enum: ['Flexible', 'Moderate', 'Strict'],
    default: 'Moderate'
  }
}, {
  timestamps: true
});

// Index for location-based searches
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ 'address.coordinates': '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);

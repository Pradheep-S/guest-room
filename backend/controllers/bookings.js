const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Property = require('../models/Property');

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'admin') {
      // Admin can see all bookings
      bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('property', 'name location')
        .populate('room', 'name type')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'houseOwner') {
      // House owner can see bookings for their properties
      const properties = await Property.find({ owner: req.user.id });
      const propertyIds = properties.map(prop => prop._id);
      
      bookings = await Booking.find({ property: { $in: propertyIds } })
        .populate('user', 'name email')
        .populate('property', 'name location')
        .populate('room', 'name type')
        .sort({ createdAt: -1 });
    } else {
      // Customer can see only their bookings
      bookings = await Booking.find({ user: req.user.id })
        .populate('property', 'name location')
        .populate('room', 'name type')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('property', 'name location description images')
      .populate('room', 'name type description price amenities');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to view this booking
    if (req.user.role === 'customer' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'houseOwner') {
      const property = await Property.findById(booking.property._id);
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = async (req, res) => {
  try {
    const {
      property,
      room,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!property || !room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if room exists and is available
    const roomData = await Room.findById(room).populate('property');
    if (!roomData) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!roomData.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Check if dates are valid
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      room: room,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkIn }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // Calculate total amount
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = numberOfNights * roomData.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      property,
      room,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalAmount,
      specialRequests,
      status: 'pending'
    });

    // Populate the booking data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'name location')
      .populate('room', 'name type price');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (House Owner/Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'houseOwner') {
      const property = await Property.findById(booking.property);
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('property', 'name location')
      .populate('room', 'name type');

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer/House Owner/Admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'houseOwner') {
      const property = await Property.findById(booking.property);
      if (property.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('property', 'name location')
      .populate('room', 'name type');

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (House Owner/Admin only)
const getBookingStats = async (req, res) => {
  try {
    let matchCondition = {};

    if (req.user.role === 'houseOwner') {
      const properties = await Property.find({ owner: req.user.id });
      const propertyIds = properties.map(prop => prop._id);
      matchCondition.property = { $in: propertyIds };
    }

    const stats = await Booking.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(matchCondition);
    const totalRevenue = await Booking.aggregate([
      { $match: { ...matchCondition, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
};

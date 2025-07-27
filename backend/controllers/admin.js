const User = require('../models/User');
const Property = require('../models/Property');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalHouseOwners = await User.countDocuments({ role: 'houseOwner' });
    const totalProperties = await Property.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Get revenue statistics
    const revenueStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Get booking status breakdown
    const bookingStatusStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly booking trends (last 12 months)
    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      userStats: {
        totalUsers,
        totalCustomers,
        totalHouseOwners
      },
      propertyStats: {
        totalProperties,
        totalRooms
      },
      bookingStats: {
        totalBookings,
        statusBreakdown: bookingStatusStats
      },
      revenueStats: {
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        averageBookingValue: revenueStats[0]?.averageBookingValue || 0
      },
      reviewStats: {
        totalReviews
      },
      monthlyTrends: monthlyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const search = req.query.search;

    let query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin cannot deactivate themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot update your own status' });
    }

    user.isActive = isActive;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all properties for admin review
// @route   GET /api/admin/properties
// @access  Private (Admin only)
const getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status && status !== 'all') {
      query.isVerified = status === 'verified';
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProperties = await Property.countDocuments(query);

    res.json({
      properties,
      currentPage: page,
      totalPages: Math.ceil(totalProperties / limit),
      totalProperties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update property verification status
// @route   PUT /api/admin/properties/:id/verify
// @access  Private (Admin only)
const updatePropertyVerification = async (req, res) => {
  try {
    const { isVerified, verificationNotes } = req.body;
    
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isVerified = isVerified;
    property.verificationNotes = verificationNotes;
    property.verifiedAt = isVerified ? new Date() : null;
    property.verifiedBy = isVerified ? req.user.id : null;

    await property.save();

    const updatedProperty = await Property.findById(property._id)
      .populate('owner', 'name email')
      .populate('verifiedBy', 'name');

    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/activities
// @access  Private (Admin only)
const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .populate('property', 'name')
      .sort({ createdAt: -1 })
      .limit(limit / 4);

    // Get recent users
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(limit / 4);

    // Get recent properties
    const recentProperties = await Property.find()
      .populate('owner', 'name')
      .sort({ createdAt: -1 })
      .limit(limit / 4);

    // Get recent reviews
    const recentReviews = await Review.find()
      .populate('user', 'name')
      .populate('property', 'name')
      .sort({ createdAt: -1 })
      .limit(limit / 4);

    // Combine and format activities
    const activities = [];

    recentBookings.forEach(booking => {
      activities.push({
        type: 'booking',
        message: `${booking.user.name} made a booking for ${booking.property.name}`,
        timestamp: booking.createdAt,
        data: booking
      });
    });

    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        message: `New ${user.role} registered: ${user.name}`,
        timestamp: user.createdAt,
        data: user
      });
    });

    recentProperties.forEach(property => {
      activities.push({
        type: 'property',
        message: `${property.owner.name} added new property: ${property.name}`,
        timestamp: property.createdAt,
        data: property
      });
    });

    recentReviews.forEach(review => {
      activities.push({
        type: 'review',
        message: `${review.user.name} reviewed ${review.property.name}`,
        timestamp: review.createdAt,
        data: review
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, limit);

    res.json(limitedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin cannot delete themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // If deleting a house owner, handle their properties
    if (user.role === 'houseOwner') {
      await Property.deleteMany({ owner: user._id });
      await Room.deleteMany({ owner: user._id });
    }

    // Delete user's bookings and reviews
    await Booking.deleteMany({ user: user._id });
    await Review.deleteMany({ user: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  updatePropertyVerification,
  getRecentActivities,
  deleteUser
};

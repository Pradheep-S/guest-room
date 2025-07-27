const Room = require('../models/Room');
const Property = require('../models/Property');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    let query = Room.find({ isActive: true });

    // Filtering
    if (req.query.city) {
      // First get properties in the city
      const properties = await Property.find({ 
        'address.city': new RegExp(req.query.city, 'i'),
        isActive: true 
      }).select('_id');
      const propertyIds = properties.map(p => p._id);
      query = query.find({ property: { $in: propertyIds } });
    }

    if (req.query.beds) {
      query = query.find({ numberOfBeds: { $gte: parseInt(req.query.beds) } });
    }

    if (req.query.minPrice) {
      query = query.find({ pricePerDay: { $gte: parseInt(req.query.minPrice) } });
    }

    if (req.query.maxPrice) {
      query = query.find({ pricePerDay: { $lte: parseInt(req.query.maxPrice) } });
    }

    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities.split(',');
      query = query.find({ amenities: { $in: amenitiesArray } });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Room.countDocuments(query.getFilter());

    query = query.skip(startIndex).limit(limit);

    // Populate property and owner info
    query = query.populate('property', 'name address')
                 .populate('owner', 'name email mobile');

    const rooms = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      pagination,
      rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('property', 'name address amenities checkInTime checkOutTime cancellationPolicy')
      .populate('owner', 'name email mobile profileImage');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private/House Owner
exports.createRoom = async (req, res) => {
  try {
    // Verify property belongs to the user
    const property = await Property.findById(req.body.property);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to add rooms to this property'
      });
    }

    // Add owner to req.body
    req.body.owner = req.user.id;

    const room = await Room.create(req.body);

    // Update property's total rooms count
    property.totalRooms += 1;
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/House Owner
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Make sure user is room owner
    if (room.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Failed to update room',
      error: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/House Owner
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Make sure user is room owner
    if (room.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Soft delete
    room.isActive = false;
    await room.save();

    // Update property's total rooms count
    const property = await Property.findById(room.property);
    if (property) {
      property.totalRooms = Math.max(0, property.totalRooms - 1);
      await property.save();
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get rooms by owner
// @route   GET /api/rooms/owner/my-rooms
// @access  Private/House Owner
exports.getRoomsByOwner = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user.id })
      .populate('property', 'name address')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get rooms by property
// @route   GET /api/rooms/property/:propertyId
// @access  Public
exports.getRoomsByProperty = async (req, res) => {
  try {
    const rooms = await Room.find({ 
      property: req.params.propertyId,
      isActive: true 
    }).populate('owner', 'name email mobile');

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Check room availability
// @route   POST /api/rooms/:id/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.body;
    
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }

    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // TODO: Check for existing bookings in the date range
    // For now, assume room is available
    
    res.status(200).json({
      success: true,
      available: true,
      message: 'Room is available for the selected dates'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Block dates for room
// @route   POST /api/rooms/:id/block-dates
// @access  Private/House Owner
exports.blockDates = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Make sure user is room owner
    if (room.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to block dates for this room'
      });
    }

    const { startDate, endDate, reason } = req.body;

    room.blockedDates.push({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason || 'Maintenance'
    });

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Dates blocked successfully',
      room
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Failed to block dates',
      error: error.message
    });
  }
};

// @desc    Unblock dates for room
// @route   POST /api/rooms/:id/unblock-dates
// @access  Private/House Owner
exports.unblockDates = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Make sure user is room owner
    if (room.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to unblock dates for this room'
      });
    }

    const { blockId } = req.body;

    room.blockedDates.id(blockId).remove();
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Dates unblocked successfully',
      room
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Failed to unblock dates',
      error: error.message
    });
  }
};

// @desc    Upload room images
// @route   POST /api/rooms/:id/upload-images
// @access  Private/House Owner
exports.uploadRoomImages = async (req, res) => {
  try {
    // TODO: Implement image upload logic with Cloudinary
    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

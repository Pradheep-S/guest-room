const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    let query = Property.find({ isActive: true });

    // Filtering
    if (req.query.city) {
      query = query.find({ 'address.city': new RegExp(req.query.city, 'i') });
    }

    if (req.query.state) {
      query = query.find({ 'address.state': new RegExp(req.query.state, 'i') });
    }

    if (req.query.propertyType) {
      query = query.find({ propertyType: req.query.propertyType });
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
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments({ isActive: true });

    query = query.skip(startIndex).limit(limit);

    // Populate owner info
    query = query.populate('owner', 'name email mobile');

    const properties = await query;

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
      count: properties.length,
      pagination,
      properties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email mobile profileImage')
      .populate({
        path: 'rooms',
        match: { isActive: true }
      });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private/House Owner
exports.createProperty = async (req, res) => {
  try {
    // Add owner to req.body
    req.body.owner = req.user.id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/House Owner
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Failed to update property',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/House Owner
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    // Soft delete
    property.isActive = false;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get properties by owner
// @route   GET /api/properties/owner/my-properties
// @access  Private/House Owner
exports.getPropertiesByOwner = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload property images
// @route   POST /api/properties/:id/upload-images
// @access  Private/House Owner
exports.uploadPropertyImages = async (req, res) => {
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

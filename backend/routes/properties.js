const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByOwner,
  uploadPropertyImages
} = require('../controllers/properties');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getProperty);

// Protected routes
router.use(protect);

router.post('/', authorize('houseOwner', 'admin'), createProperty);
router.get('/owner/my-properties', authorize('houseOwner'), getPropertiesByOwner);
router.put('/:id', authorize('houseOwner', 'admin'), updateProperty);
router.delete('/:id', authorize('houseOwner', 'admin'), deleteProperty);
router.post('/:id/upload-images', authorize('houseOwner', 'admin'), uploadPropertyImages);

module.exports = router;

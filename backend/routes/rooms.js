const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByOwner,
  getRoomsByProperty,
  uploadRoomImages,
  checkAvailability,
  blockDates,
  unblockDates
} = require('../controllers/rooms');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoom);
router.get('/property/:propertyId', getRoomsByProperty);
router.post('/:id/check-availability', checkAvailability);

// Protected routes
router.use(protect);

router.post('/', authorize('houseOwner', 'admin'), createRoom);
router.get('/owner/my-rooms', authorize('houseOwner'), getRoomsByOwner);
router.put('/:id', authorize('houseOwner', 'admin'), updateRoom);
router.delete('/:id', authorize('houseOwner', 'admin'), deleteRoom);
router.post('/:id/upload-images', authorize('houseOwner', 'admin'), uploadRoomImages);
router.post('/:id/block-dates', authorize('houseOwner', 'admin'), blockDates);
router.post('/:id/unblock-dates', authorize('houseOwner', 'admin'), unblockDates);

module.exports = router;

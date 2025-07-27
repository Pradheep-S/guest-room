const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  updatePropertyVerification,
  getRecentActivities,
  deleteUser
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.get('/activities', getRecentActivities);

router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.put('/properties/:id/verify', updatePropertyVerification);

module.exports = router;

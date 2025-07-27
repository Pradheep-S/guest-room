const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;

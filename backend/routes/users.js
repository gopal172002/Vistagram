const express = require('express');
const {
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getSuggestedUsers,
  getSavedPosts,
  getUserPosts
} = require('../controllers/userController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes (with optional auth)
router.get('/profile/:username', optionalAuth, getUserProfile);
router.get('/search', optionalAuth, searchUsers);
router.get('/:username/posts', optionalAuth, getUserPosts);
router.get('/:username/followers', optionalAuth, getFollowers);
router.get('/:username/following', optionalAuth, getFollowing);

// Protected routes
router.get('/suggested', authenticateToken, getSuggestedUsers);
router.get('/saved', authenticateToken, getSavedPosts);
router.post('/:userId/follow', authenticateToken, followUser);
router.delete('/:userId/follow', authenticateToken, unfollowUser);

module.exports = router;


const express = require('express');
// const { body } = require('express-validator'); // Temporarily commented out
const {
  getPosts,
  getFeed,
  createPost,
  getPostById,
  toggleLike,
  toggleSave,
  sharePost,
  addComment,
  getComments,
  deletePost,
  searchPosts
} = require('../controllers/postController');
const { authenticateToken, optionalAuth, authorizeOwner } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Simple validation middleware (temporary replacement for express-validator)
const validateField = (field, validationFn, message) => {
  return (req, res, next) => {
    if (!validationFn(req.body[field])) {
      return res.status(400).json({ error: message });
    }
    next();
  };
};

// Validation middleware
const createPostValidation = [
  validateField('caption',
    (val) => val && val.trim().length >= 1 && val.trim().length <= 2000,
    'Caption must be 1-2000 characters long'
  ),
  (req, res, next) => {
    if (req.body.location && !isValidJSON(req.body.location)) {
      return res.status(400).json({ error: 'Location must be valid JSON' });
    }
    if (req.body.tags && typeof req.body.tags !== 'string') {
      return res.status(400).json({ error: 'Tags must be a comma-separated string' });
    }
    next();
  }
];

const commentValidation = [
  validateField('content',
    (val) => val && val.trim().length >= 1 && val.trim().length <= 1000,
    'Comment must be 1-1000 characters long'
  )
];

// Helper function to check if string is valid JSON
const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Public routes (with optional auth)
router.get('/', optionalAuth, getPosts);
router.get('/search', optionalAuth, searchPosts);
router.get('/:id', optionalAuth, getPostById);
router.get('/:id/comments', optionalAuth, getComments);

// Protected routes
router.get('/feed', authenticateToken, getFeed);
router.post('/', authenticateToken, upload.single('image'), createPostValidation, createPost);
router.post('/:id/like', authenticateToken, toggleLike);
router.post('/:id/save', authenticateToken, toggleSave);
router.post('/:id/share', authenticateToken, sharePost);
router.post('/:id/comments', authenticateToken, commentValidation, addComment);
router.delete('/:id', authenticateToken, authorizeOwner, deletePost);

module.exports = router;

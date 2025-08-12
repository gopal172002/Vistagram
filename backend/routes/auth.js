const express = require('express');
// const { body } = require('express-validator'); // Temporarily commented out
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteAccount,
  refreshToken
} = require('../controllers/authController');
const { authenticateToken, authRateLimit } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit(authRateLimit);

// Simple validation middleware (temporary replacement for express-validator)
const validateField = (field, validationFn, message) => {
  return (req, res, next) => {
    console.log(`Validating ${field}:`, req.body[field]);
    if (!validationFn(req.body[field])) {
      console.log(`Validation failed for ${field}:`, req.body[field]);
      return res.status(400).json({ error: message });
    }
    next();
  };
};

const registerValidation = [
  validateField('username', 
    (val) => {
      console.log('Username validation:', val, typeof val);
      return val && val.length >= 3 && val.length <= 30 && /^[a-zA-Z0-9_]+$/.test(val);
    },
    'Username must be 3-30 characters and contain only letters, numbers, and underscores'
  ),
  validateField('email',
    (val) => {
      console.log('Email validation:', val, typeof val);
      return val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    'Please provide a valid email'
  ),
  validateField('password',
    (val) => {
      console.log('Password validation:', val, typeof val);
      return val && val.length >= 6;
    },
    'Password must be at least 6 characters long'
  ),
  validateField('fullName',
    (val) => {
      console.log('FullName validation:', val, typeof val);
      return val && val.trim().length >= 2 && val.trim().length <= 100;
    },
    'Full name must be 2-100 characters long'
  )
];

const loginValidation = [
  validateField('email',
    (val) => {
      console.log('Email validation:', val, typeof val);
      return val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    'Please provide a valid email'
  ),
  validateField('password',
    (val) => val && val.trim().length > 0,
    'Password is required'
  )
];

const updateProfileValidation = [
  (req, res, next) => {
    if (req.body.fullName && (req.body.fullName.trim().length < 2 || req.body.fullName.trim().length > 100)) {
      return res.status(400).json({ error: 'Full name must be 2-100 characters long' });
    }
    if (req.body.bio && req.body.bio.trim().length > 500) {
      return res.status(400).json({ error: 'Bio must not exceed 500 characters' });
    }
    if (req.body.location && req.body.location.trim().length > 100) {
      return res.status(400).json({ error: 'Location must not exceed 100 characters' });
    }
    if (req.body.website && !/^https?:\/\/.+/.test(req.body.website)) {
      return res.status(400).json({ error: 'Please provide a valid website URL' });
    }
    next();
  }
];

const changePasswordValidation = [
  validateField('currentPassword',
    (val) => val && val.trim().length > 0,
    'Current password is required'
  ),
  validateField('newPassword',
    (val) => val && val.length >= 6,
    'New password must be at least 6 characters long'
  )
];

const deleteAccountValidation = [
  validateField('password',
    (val) => val && val.trim().length > 0,
    'Password is required'
  )
];

// Debug middleware to log request body
const debugBody = (req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
};

// Routes
router.post('/register', authLimiter, debugBody, registerValidation, register);
router.post('/login', authLimiter, debugBody, loginValidation, login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/password', authenticateToken, changePasswordValidation, changePassword);
router.post('/profile-picture', authenticateToken, upload.single('image'), uploadProfilePicture);
router.delete('/account', authenticateToken, deleteAccountValidation, deleteAccount);
router.post('/refresh', authenticateToken, refreshToken);

module.exports = router;

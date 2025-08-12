const express = require('express');
const router = express.Router();
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImageInfo
} = require('../controllers/uploadController');

// Upload single image
router.post('/single', uploadImage);

// Upload multiple images
router.post('/multiple', uploadMultipleImages);

// Get image info
router.get('/:filename', getImageInfo);

// Delete image
router.delete('/:filename', deleteImage);

module.exports = router;

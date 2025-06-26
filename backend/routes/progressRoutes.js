const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// Progress routes
router.get('/books-with-progress', protect, progressController.getBooksWithProgress);
router.get('/stats', protect, progressController.getReadingStats);
router.get('/book/:bookId', protect, progressController.getProgressByBook);
router.put('/book/:bookId', protect, progressController.updateProgress);

module.exports = router;
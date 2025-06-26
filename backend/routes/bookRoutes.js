const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

// Book routes
router.get('/', protect, bookController.getAllBooks);
router.get('/:id', protect, bookController.getBookById);
router.post('/', protect, upload.single('cover_image'), bookController.createBook); 
router.put('/:id', protect, upload.single('cover_image'), bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);

module.exports = router;
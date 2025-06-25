const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/upload');

// Book routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', upload.single('cover_image'), bookController.createBook); 
router.put('/:id', upload.single('cover_image'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
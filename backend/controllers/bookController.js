const Book = require("../models/Book");
const ReadingProgress = require("../models/ReadingProgress");

const bookController = {
  // Get all books
  async getAllBooks(req, res) {
    try {
      const books = await Book.getAll();
      res.json({
        success: true,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching books",
        error: error.message,
      });
    }
  },

  // Get book by ID
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      res.json({
        success: true,
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching book",
        error: error.message,
      });
    }
  },

  // Create new book
  async createBook(req, res) {
    try {
      const { title, author } = req.body;
      let cover_image_url;

      if (req.file) {
        cover_image_url = `${req.protocol}://${req.get(
          "host"
        )}/${req.file.path.replace(/\\/g, "/")}`;
      } else {
        cover_image_url =
          "https://raw.githubusercontent.com/putrifajarr/cover-book/main/no-cover.png";
      }

      if (!title || !author) {
        return res.status(400).json({
          success: false,
          message: "Judul dan penulis wajib diisi",
        });
      }
      const bookId = await Book.create({
        title,
        author,
        cover_image: cover_image_url,
      });
      await ReadingProgress.create({
        book_id: bookId,
        user_id: req.user.id,
        status: "not_started",
      });
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: { id: bookId },
      });
    } catch (error) {
      console.error("ERROR DI CREATE CONTROLLER:", error);
      res.status(500).json({
        success: false,
        message: "Error creating book",
      });
    }
  },

  // Update book
  async updateBook(req, res) {
    console.log("--- DEBUGGING UPDATE BOOK ---");
    console.log("Isi dari req.body:", req.body);
    console.log("Isi dari req.file:", req.file);
    console.log("----------------------------");
    try {
      const { id } = req.params;
      const { title, author } = req.body;
      const updateData = { title, author };

      if (req.file) {
        const cover_image_url = `${req.protocol}://${req.get(
          "host"
        )}/${req.file.path.replace(/\\/g, "/")}`;
        updateData.cover_image = cover_image_url;
      }

      const affectedRows = await Book.update(id, updateData);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
      res.json({
        success: true,
        message: "Book updated successfully",
      });
    } catch (error) {
      console.error("ERROR DI UPDATE CONTROLLER:", error);
      res.status(500).json({
        success: false,
        message: "Error updating book",
      });
    }
  },
  // Delete book
  async deleteBook(req, res) {
    try {
      const { id: bookId } = req.params;
      const userId = req.user.id;

      // Pengecekan keamanan: pastikan buku ini milik pengguna yang login
      const progress = await ReadingProgress.getByBookIdAndUserId(
        bookId,
        userId
      );
      if (!progress) {
        return res
          .status(403)
          .json({ success: false, message: "Akses ditolak" });
      }

      const affectedRows = await Book.delete(bookId); // Hapus dari tabel books
      // Entri di reading_progress akan terhapus otomatis karena ON DELETE CASCADE

      if (affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Book not found" });
      }
      res.json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting book",
        error: error.message,
      });
    }
  },
};

module.exports = bookController;

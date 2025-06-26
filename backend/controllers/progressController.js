const Book = require('../models/Book');
const ReadingProgress = require('../models/ReadingProgress');

const progressController = {

  async getBooksWithProgress(req, res) {
    try {
      const userId = req.user.id; // Ambil ID pengguna yang sedang login
      const books = await ReadingProgress.getBooksWithProgressForUser(userId); // Panggil fungsi baru
      res.json({ success: true, data: books });
    } catch (error) {
      console.error("ERROR DI GET BOOKS WITH PROGRESS:", error);
      res.status(500).json({ success: false, message: 'Error fetching books' });
    }
  },

  // Get reading progress for specific book
  async getProgressByBook(req, res) {
    try {
      const { bookId } = req.params;
      const progress = await ReadingProgress.getByBookId(bookId);
      
      if (!progress) {
        return res.status(404).json({
          success: false,
          message: 'Reading progress not found for this book'
        });
      }

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching reading progress',
        error: error.message
      });
    }
  },

  // Update reading progress (hanya status)
  async updateProgress(req, res) {
    try {
        const { bookId } = req.params;
        const { status } = req.body;
        const userId = req.user.id; // Ambil ID pengguna

        // Pengecekan keamanan: pastikan buku ini milik pengguna yang login
        const progress = await ReadingProgress.getByBookIdAndUserId(bookId, userId);
        if (!progress) {
            return res.status(403).json({ success: false, message: 'Akses ditolak: Anda tidak memiliki buku ini' });
        }

        const affectedRows = await ReadingProgress.update(bookId, userId, { status });
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Gagal memperbarui progres' });
        }
        res.json({ success: true, message: 'Progres berhasil diperbarui' });
    } catch (error) {
        console.error("ERROR DI UPDATE PROGRESS:", error);
        res.status(500).json({ success: false, message: 'Error updating progress' });
    }
  },

  // Get reading statistics
  async getReadingStats(req, res) {
    try {
      const stats = await ReadingProgress.getReadingStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching reading statistics',
        error: error.message
      });
    }
  }
};

module.exports = progressController;
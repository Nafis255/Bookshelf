const db = require("../database");

class ReadingProgress {
  static async getByBookIdAndUserId(bookId, userId) {
    const [rows] = await db.execute(
      "SELECT * FROM reading_progress WHERE book_id = ? AND user_id = ?",
      [bookId, userId]
    );
    return rows[0];
  }

  static async create(progressData) {
    const { book_id, user_id, status } = progressData;
    const [result] = await db.execute(
      "INSERT INTO reading_progress (book_id, user_id, status) VALUES (?, ?, ?)",
      [book_id, user_id, status || "not_started"]
    );
    return result.insertId;
  }

  static async update(bookId, userId, progressData) {
    const { status } = progressData;
    const [result] = await db.execute(
      "UPDATE reading_progress SET status = ? WHERE book_id = ? AND user_id = ?",
      [status, bookId, userId]
    );
    return result.affectedRows;
  }

  static async getBooksWithProgressForUser(userId) {
    const [rows] = await db.execute(
      `
      SELECT 
        b.*,
        rp.status
      FROM books b
      INNER JOIN reading_progress rp ON b.id = rp.book_id
      WHERE rp.user_id = ? -- <-- FILTER BERDASARKAN USER ID
      ORDER BY b.created_at DESC
    `,
      [userId]
    );
    return rows;
  }

  static async getReadingStats() {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_books,
        SUM(CASE WHEN rp.status = 'completed' THEN 1 ELSE 0 END) as completed_books,
        SUM(CASE WHEN rp.status = 'reading' THEN 1 ELSE 0 END) as currently_reading,
        SUM(CASE WHEN rp.status = 'not_started' THEN 1 ELSE 0 END) as not_started
      FROM books b
      LEFT JOIN reading_progress rp ON b.id = rp.book_id
    `);
    return rows[0];
  }

  static async getRecentlyCompleted(limit = 5) {
    const [rows] = await db.execute(
      `
      SELECT 
        b.title,
        b.author,
        b.cover_image
      FROM books b
      INNER JOIN reading_progress rp ON b.id = rp.book_id
      WHERE rp.status = 'completed'
      ORDER BY rp.updated_at DESC
      LIMIT ?
    `,
      [limit]
    );
    return rows;
  }

  static async getCurrentlyReading() {
    const [rows] = await db.execute(`
      SELECT 
        b.*,
        rp.status
      FROM books b
      INNER JOIN reading_progress rp ON b.id = rp.book_id
      WHERE rp.status = 'reading'
      ORDER BY rp.updated_at ASC
    `);
    return rows;
  }
}

module.exports = ReadingProgress;

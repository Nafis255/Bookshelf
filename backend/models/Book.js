const db = require('../database');

class Book {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM books ORDER BY created_at DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(bookData) {
    const { title, author, cover_image } = bookData;
    const [result] = await db.execute(
      'INSERT INTO books (title, author, cover_image) VALUES (?, ?, ?)',
      [title, author, cover_image]
    );
    return result.insertId;
  }

  static async update(id, bookData) {
    const fields = Object.keys(bookData);
    const values = Object.values(bookData);

    // Jika tidak ada data yang dikirim (seharusnya tidak terjadi, tapi untuk keamanan)
    if (fields.length === 0) {
        return 0;
    }

    // Membuat bagian "SET" dari kueri SQL secara otomatis
    // Contoh: "title = ?, author = ?"
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    // Membangun kueri SQL lengkap
    const sql = `UPDATE books SET ${setClause} WHERE id = ?`;

    // Menambahkan `id` ke akhir array `values` untuk klausa WHERE
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Book;
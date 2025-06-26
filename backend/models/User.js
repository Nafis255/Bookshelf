const db = require('../database');

class User {
  static async create(userData) {
    const { email, password, otp, otp_expires_at } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (email, password, otp, otp_expires_at) VALUES (?, ?, ?, ?)',
      [email, password, otp, otp_expires_at]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  // Fungsi baru untuk update OTP jika user sudah ada tapi belum verifikasi
  static async updateOtp(email, otp, otp_expires_at) {
    const [result] = await db.execute(
      'UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?',
      [otp, otp_expires_at, email]
    );
    return result.affectedRows;
  }

  // Fungsi baru untuk memverifikasi akun
  static async verify(email) {
    const [result] = await db.execute(
      'UPDATE users SET is_verified = 1, otp = NULL, otp_expires_at = NULL WHERE email = ?',
      [email]
    );
    return result.affectedRows;
  }
}

module.exports = User;
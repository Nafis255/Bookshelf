const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  // Fungsi untuk Registrasi User Baru
  async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
      }

      // Validasi kata sandi kuat
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'Kata sandi harus minimal 8 karakter, mengandung huruf kapital, huruf kecil, angka, dan simbol (!@#$%^&*)',
        });
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
      }

      // Hash password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user ke database
      await User.create({ email, password: hashedPassword });

      res.status(201).json({ success: true, message: 'Registrasi berhasil' });
    } catch (error) {
      console.error("ERROR DI REGISTER CONTROLLER:", error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
  },

  // Fungsi untuk Login User
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
      }

      // Cari user berdasarkan email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
      }

      // Bandingkan password yang diinput dengan yang ada di database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
      }

      // Buat JSON Web Token (JWT)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token berlaku selama 1 jam
      );

      res.json({ success: true, message: 'Login berhasil', token });
    } catch (error) {
      console.error("ERROR DI LOGIN CONTROLLER:", error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
  }
};

module.exports = authController;
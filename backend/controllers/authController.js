const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const authController = {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
            }

      // Validasi kata sandi yg aman
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
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = generateOtp();
            const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 menit dari sekarang

            if (existingUser) {
                await User.updateOtp(email, otp, otp_expires_at);
            } else {
                await User.create({ email, password: hashedPassword, otp, otp_expires_at });
            }

            await sendVerificationEmail(email, otp);

            res.status(201).json({ success: true, message: 'Kode OTP telah dikirim ke email Anda.' });
        } catch (error) {
            console.error("ERROR DI REGISTER CONTROLLER:", error);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        }
    },

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ success: false, message: 'Email dan OTP wajib diisi' });
            }

            const user = await User.findByEmail(email);
            if (!user || user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
                return res.status(400).json({ success: false, message: 'Kode OTP tidak valid atau telah kedaluwarsa' });
            }

            await User.verify(email);
            res.json({ success: true, message: 'Akun berhasil diverifikasi. Silakan login.' });

        } catch (error) {
            console.error("ERROR DI VERIFY OTP CONTROLLER:", error);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });

            const user = await User.findByEmail(email);
            if (!user) return res.status(401).json({ success: false, message: 'Email atau password salah' });

            if (!user.is_verified) {
                return res.status(401).json({ success: false, message: 'Akun belum diverifikasi. Silakan cek email Anda untuk OTP.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Email atau password salah' });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, message: 'Login berhasil', token });
        } catch (error) {
            console.error("ERROR DI LOGIN CONTROLLER:", error);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        }
    }
};
module.exports = authController;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Kode Verifikasi OTP untuk Readlist',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Verifikasi Email Anda</h2>
        <p>Terima kasih telah mendaftar. Gunakan kode OTP di bawah ini untuk memverifikasi akun Anda.</p>
        <div style="font-size: 36px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">
          ${otp}
        </div>
        <p>Kode ini akan kedaluwarsa dalam 10 menit.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email verifikasi terkirim ke:', to);
  } catch (error) {
    console.error('Gagal mengirim email verifikasi:', error);
    throw new Error('Gagal mengirim email verifikasi.');
  }
};

module.exports = { sendVerificationEmail };
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './otp.css';

// URL ke backend Anda
const API_URL = 'http://localhost:3000/api';

const Otp = () => {
    // State untuk menyimpan input OTP dari pengguna
    const [otp, setOtp] = useState('');
    // State untuk menampilkan pesan error
    const [error, setError] = useState('');
    // State untuk menandai proses loading saat API call
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Ambil email yang dikirim dari halaman registrasi
    // 'location.state?.email' adalah cara aman untuk mengaksesnya
    const email = location.state?.email;

    // Jika pengguna mengakses halaman ini tanpa melalui registrasi (tidak ada email),
    // kembalikan mereka ke halaman daftar.
    if (!email) {
        navigate('/daftar');
        return null; // Return null agar komponen tidak me-render apa pun sebelum navigasi
    }

    const handleVerify = async (e) => {
        e.preventDefault(); // Mencegah form refresh halaman
        setLoading(true);
        setError('');

        try {
            // Kirim email dan otp ke backend untuk diverifikasi
            const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });

            if (response.data.success) {
                alert(response.data.message); // Tampilkan pesan sukses dari backend
                navigate('/'); // Arahkan ke halaman login
            }
        } catch (err) {
            // Tangkap dan tampilkan pesan error dari backend
            const errorMessage = err.response?.data?.message || 'Verifikasi gagal. Silakan coba lagi.';
            setError(errorMessage);
        } finally {
            setLoading(false); // Hentikan loading, baik sukses maupun gagal
        }
    };

    return (
        <div className="otp-page">
            <div className="otp-container">
                {/* Gunakan tag <form> agar bisa di-submit dengan menekan Enter */}
                <form onSubmit={handleVerify}>
                    <div className="header">
                        <h1>Masukkan Kode OTP</h1>
                        <p>Kami telah mengirimkan kode OTP ke <strong>{email}</strong></p>
                    </div>

                    <div className="input-container">
                        <input
                            type="text" // Ubah ke text agar lebih fleksibel
                            className="input-otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6" // Batasi input hingga 6 karakter
                            required
                        />
                    </div>

                    {/* Tampilkan pesan error jika ada */}
                    {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

                    <div className="resend-container">
                        <p className="resend">Belum menerima kode OTP?<a href="#">Kirim ulang</a></p>
                    </div>

                    <div className="button-container">
                        {/* Ganti div menjadi button agar bisa di-disable */}
                        <button type="submit" className="button-verif" disabled={loading}>
                            {loading ? 'Memverifikasi...' : 'Verifikasi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Otp;
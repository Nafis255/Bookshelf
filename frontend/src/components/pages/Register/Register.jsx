import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!passwordRegex.test(password)) {
            setError('Kata sandi harus minimal 8 karakter, mengandung huruf kapital, huruf kecil, angka, dan simbol (!@#$%^&*)');
            return;
        }

        if (password !== confirmPassword) {
            setError('Kata sandi dan konfirmasi kata sandi tidak sama!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password
            });

            if (response.data.success) {
                alert(response.data.message); // Tampilkan pesan sukses dari backend
                // Arahkan ke halaman OTP dengan membawa email
                navigate('/kode-otp', { state: { email: email } }); 
            }
        } catch (err) {
            console.error('Registration error:', err); // Log untuk debugging
            
            // Handle different error types
            if (err.response) {
                // Server responded with error status
                const errorMessage = err.response.data?.message || 'Registrasi gagal, silakan coba lagi.';
                setError(errorMessage);
            } else if (err.request) {
                // Network error
                setError('Koneksi bermasalah, silakan periksa internet Anda.');
            } else {
                // Other error
                setError('Terjadi kesalahan, silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleRegister}>
                    <div className="title">
                        <h1>Daftar</h1>
                    </div>
                    
                    <div className="input-box">
                        <input 
                            type="email" 
                            placeholder='Email' 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder='Kata sandi' 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder='Konfirmasi kata sandi' 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginTop: '-10px' }}>{error}</p>}

                    <div className="submit-container">                   
                        <div className="submit black" onClick={() => navigate('/')}>Masuk</div>
                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Mendaftar...' : 'Daftar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

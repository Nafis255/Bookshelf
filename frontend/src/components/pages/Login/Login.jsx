import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

// Ganti dengan URL backend Anda
const API_URL = 'http://157.10.252.179:3000/api';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // validasi password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            setError('Kata sandi harus minimal 8 karakter, mengandung huruf kapital, huruf kecil, angka, dan simbol (!@#$%^&*)');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                // Ambil token dari response
                const { token } = response.data;

                // Simpan token ke localStorage
                localStorage.setItem('token', token);

                // Atur header Authorization untuk semua permintaan axios selanjutnya
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Arahkan ke halaman buku
                navigate('/books');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login gagal, silakan coba lagi.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <div className="title">
                        <h1>Masuk</h1>
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

                    {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

                    <div className="submit-container">                   
                        <div className="submit black" onClick={() => navigate('/daftar')}>Daftar</div>
                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Masuk...' : 'Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;

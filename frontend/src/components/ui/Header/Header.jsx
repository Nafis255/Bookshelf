import './header.css';
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../index.css';
 
const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Hapus token dari localStorage
        localStorage.removeItem('token');

        // Hapus header Authorization dari default axios
        delete axios.defaults.headers.common['Authorization'];

        // Arahkan ke halaman login
        navigate('/');
    };

    return(
        <header>
            <div className="nav-container">
                <div className="logout-container" id="logout" onClick={handleLogout} style={{cursor: 'pointer'}}>
                    <div className="logout">
                        <MdOutlineLogout className="icon-logout"/>
                        <p>Keluar</p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
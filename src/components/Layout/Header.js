import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 这里可以添加任何需要的登出逻辑，比如清除用户数据
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <header className="header">
            <div className="logo">HRMS</div>
            <nav className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/attendance">Attendance</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </nav>
        </header>
    );
};

export default Header;
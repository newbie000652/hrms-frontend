import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 这里可以添加任何需要的登出逻辑，比如清除用户数据
        navigate('/');
    };

    return (
        <header className="header">
            <div className="logo">HRMS</div>
            <nav className="nav-links">
                <a href="/dashboard">Dashboard</a>
                <a href="/attendance">Attendance</a>
                <a href="#" onClick={handleLogout}>Logout</a>
            </nav>
        </header>
    );
};

export default Header;
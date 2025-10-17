import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import roleRoutes from '../../config/roleRoutes';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('authToken');
        localStorage.removeItem('employeeId');
        navigate('/');
    };

    const role = localStorage.getItem('role');
    const allowed = new Set((roleRoutes[role] || []));

    const noLayoutRoutes = ['/', '/unauthorized'];
    const token = localStorage.getItem('authToken');
    if (!token || noLayoutRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-8 py-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.5 2H2.5v9h9V2zm10 0h-9v9h9V2zm-10 10h-9v9h9v-9zm10 0h-9v9h9v-9z" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-semibold text-gray-900">人事管理系统</h1>
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center gap-2">
                    {allowed.has('/dashboard') && (
                        <Link 
                            to="/dashboard" 
                            className="px-3 py-1.5 text-sm font-normal text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                            仪表盘
                        </Link>
                    )}
                    {allowed.has('/attendance') && (
                        <Link 
                            to="/attendance" 
                            className="px-3 py-1.5 text-sm font-normal text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                            考勤管理
                        </Link>
                    )}
                    
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="ml-4 flex items-center gap-1.5 text-gray-700 hover:text-gray-900 px-3 py-1.5 text-sm font-normal transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        退出登录
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;

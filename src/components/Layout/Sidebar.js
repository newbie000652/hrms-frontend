import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import roleRoutes from '../../config/roleRoutes';
import './Sidebar.css';

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const allowedRoutes = roleRoutes[role] || [];

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employees', label: '员工管理', icon: '👥' },
    { path: '/attendance', label: '考勤管理', icon: '⏰' },
    { path: '/salary', label: '工资管理', icon: '💰' },
    { path: '/resignation', label: '离职管理', icon: '🚪' },
    { path: '/accounts', label: '账户管理', icon: '🔐' },
    { path: '/performance', label: '绩效管理', icon: '📈' },
    { path: '/statistics', label: '数据统计', icon: '📊' },
    { path: '/logs', label: '日志管理', icon: '📝' },
  ];

  const filteredMenuItems = menuItems.filter((item) => 
    allowedRoutes.includes(item.path)
  );

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button 
        className="mobile-menu-toggle hidden-desktop"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* 侧边栏 */}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h3>导航菜单</h3>
          <button 
            className="mobile-close hidden-desktop"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {filteredMenuItems.map((item) => (
              <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path} onClick={closeMobileMenu}>
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 移动端遮罩 */}
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}
    </>
  );
};

export default Sidebar;

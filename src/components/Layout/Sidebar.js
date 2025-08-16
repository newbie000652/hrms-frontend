import React from 'react';
import { Link } from 'react-router-dom';
import roleRoutes from '../../config/roleRoutes';

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const allowedRoutes = roleRoutes[role] || [];

  const menuItems = [
    // { path: '/dashboard', label: 'Dashboard' },
    // { path: '/employees', label: 'Employees' },
    // { path: '/attendance', label: 'Attendance' },
    // { path: '/salary', label: 'Salary' },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems
          .filter((item) => allowedRoutes.includes(item.path))
          .map((item) => (
            <li key={item.path}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;

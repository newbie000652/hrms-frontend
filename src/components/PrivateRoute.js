import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import roleRoutes from '../config/roleRoutes'; // 确保正确引入权限配置

const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem('role'); // 从本地存储获取用户角色
    const token = localStorage.getItem('token'); // 从本地存储获取认证令牌
    const location = useLocation(); // 获取当前路径

    if (!token) {
        alert("请先登录！");
        return <Navigate to="/" state={{ from: location }} />;
    }

    const allowedRoutes = roleRoutes[role] || []; // 获取当前角色的可访问路由
    if (!allowedRoutes.includes(location.pathname)) {
        // 无访问权限，跳转到未授权页面
        alert("无权限访问此页面！");
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    // 通过验证，渲染子组件
    return children;
};

export default PrivateRoute;

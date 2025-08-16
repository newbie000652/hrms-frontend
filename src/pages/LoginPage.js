// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // 真实接口逻辑
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 正常登录逻辑
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(username, password);
      if (response.success) {
        localStorage.setItem('role', response.data.role); // 存储角色

        // 登录成功后跳转到仪表盘页面
        navigate('/dashboard');
      } else {
        setError(response.message || '用户名或密码错误，请重试。');
      }
    } catch (err) {
      setError('服务器错误，请稍后再试。');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>登录系统</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">登录</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
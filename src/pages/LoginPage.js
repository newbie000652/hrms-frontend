// src/pages/LoginPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(username, password);
      if (response.success) {
        localStorage.setItem('role', response.data.role);
        navigate('/dashboard');
      } else {
        setError(response.message || '用户名或密码错误，请重试。');
      }
    } catch (err) {
      setError('服务器错误，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* 登录卡片 */}
      <div className="w-full max-w-md">
        {/* 主卡片 */}
        <div className="bg-white rounded shadow-sm border border-gray-200 p-12">
          {/* Logo 和标题 */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.5 2H2.5v9h9V2zm10 0h-9v9h9V2zm-10 10h-9v9h9v-9zm10 0h-9v9h9v-9z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">登录</h1>
            <p className="text-sm text-gray-600 text-center">人事管理系统</p>
          </div>

          {/* 登录表单 */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* 用户名输入 */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 底部提示 */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} HRMS System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';

/**
 * 按钮组件库 - 微软 Fluent Design 风格
 */

// 主按钮 - 微软蓝 (#0078D4)
export const PrimaryButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
  >
    {children}
  </button>
);

// 次要按钮 - 浅灰背景
export const SecondaryButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm border border-gray-300 ${className}`}
  >
    {children}
  </button>
);

// 成功按钮 - 柔和的绿色
export const SuccessButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 active:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
  >
    {children}
  </button>
);

// 危险按钮 - 柔和的红色
export const DangerButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
  >
    {children}
  </button>
);

// 信息按钮 - 与主按钮相同
export const InfoButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
  >
    {children}
  </button>
);

// 小按钮 - 微软风格
export const SmallButton = ({ children, onClick, className = '', variant = 'primary', disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

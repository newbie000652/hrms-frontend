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
    className={`px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 active:bg-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
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
    className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm border border-gray-300 ${className}`}
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
    className={`px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 active:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
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
    className={`px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 active:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
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
    className={`px-4 py-2 bg-primary-500 text-white rounded-md shadow-sm hover:bg-primary-600 active:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-sm ${className}`}
  >
    {children}
  </button>
);

// 小按钮 - 微软风格
export const SmallButton = ({ children, onClick, className = '', variant = 'primary', disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100',
    secondary: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
    success: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    info: 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

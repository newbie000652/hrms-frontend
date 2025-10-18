import React from 'react';

// Reusable alert banner for error/info/success messages
export default function Alert({ type = 'error', children, className = '' }) {
  const styles = {
    error: 'bg-red-50 border border-red-200 text-red-600',
    success: 'bg-green-50 border border-green-200 text-green-700',
    info: 'bg-blue-50 border border-blue-200 text-blue-700',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
  };
  return (
    <div className={`${styles[type]} px-4 py-3 rounded-lg text-sm ${className}`}>
      {children}
    </div>
  );
}

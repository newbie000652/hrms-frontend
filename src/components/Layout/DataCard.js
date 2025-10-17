import React from 'react';

/**
 * DataCard - 统一的数据展示卡片容器
 * @param {object} props
 * @param {React.ReactNode} props.children - 卡片内容
 * @param {string} props.className - 额外的类名
 */
const DataCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default DataCard;

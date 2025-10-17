import React from 'react';

/**
 * SearchBar - 统一的搜索栏组件
 * @param {object} props
 * @param {React.ReactNode} props.children - 搜索输入字段
 * @param {React.ReactNode} props.actions - 操作按钮（搜索、重置等）
 * @param {string} props.className - 额外的类名
 */
const SearchBar = ({ children, actions, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {children}
        {actions && (
          <div className="flex items-end gap-2 sm:col-span-2 md:col-span-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

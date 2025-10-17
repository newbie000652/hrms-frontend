import React from 'react';

/**
 * PageHeader
 * Props:
 * - title: string
 * - description?: string
 * - actions?: ReactNode (right side action buttons)
 */
const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 leading-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="shrink-0 flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;

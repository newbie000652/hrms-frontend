/* Table.js - 通用表格组件 */
import React from 'react';
import { SmallButton } from './Buttons';

const Table = ({ columns, data, actions, emptyMessage = '暂无数据' }) => {
  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                style={col.width ? { width: col.width } : {}}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-gray-700">
                    {col.render ? col.render(row, rowIndex) : (row[col.field] ?? '-')}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {actions.map((action, actionIdx) => (
                        <SmallButton
                          key={actionIdx}
                          onClick={() => action.onClick(row)}
                          variant={
                            action.variant === 'primary'
                              ? 'primary'
                              : action.variant === 'danger'
                              ? 'danger'
                              : 'secondary'
                          }
                          className="shadow-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                        >
                          {action.label}
                        </SmallButton>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

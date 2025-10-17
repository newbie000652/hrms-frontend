import React from 'react';

const wrapperClasses = 'space-y-4';
const controlsClasses = 'flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm';
const labelClasses = 'text-sm font-medium text-gray-600';
const selectInputClasses = 'h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200';
const infoClasses = 'flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between';
const paginationClasses = 'flex flex-wrap items-center justify-center gap-2 pt-1';
const baseButtonClasses = 'inline-flex min-w-[42px] items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200';

const getButtonClasses = ({ isActive, disabled }) => {
  if (disabled) {
    return `${baseButtonClasses} cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400`;
  }

  if (isActive) {
    return `${baseButtonClasses} border-primary-600 bg-primary-600 text-white hover:bg-primary-700`;
  }

  return `${baseButtonClasses} border-gray-200 bg-white text-gray-600 hover:border-primary-400 hover:text-primary-600`;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showJumpToPage = true,
  showRecordInfo = true,
  pageSizeOptions = [5, 10, 20, 50]
}) => {
  const [jumpToPage, setJumpToPage] = React.useState('');

  // 计算当前页的记录序号范围
  const getRecordRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);
    return { start, end };
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPage('');
    } else {
      alert(`请输入1到${totalPages}之间的页码`);
    }
  };

  // 生成分页按钮数组
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // 最多显示5个页码按钮
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页数，显示所有页
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 如果总页数大于最大显示页数，显示当前页附近的页码
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // 调整起始页，确保显示maxVisiblePages个页码
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const { start, end } = getRecordRange();

  // 移除这个条件判断，让分页组件始终显示
  // if (totalPages <= 1) {
  //   return null;
  // }

  return (
    <div className={wrapperClasses}>
      {(showPageSizeSelector || showJumpToPage) && (
        <div className={controlsClasses}>
          {showPageSizeSelector && (
            <div className="flex items-center gap-3 min-w-[200px]">
              <label className={`${labelClasses} whitespace-nowrap shrink-0`} style={{ wordBreak: 'keep-all' }}>每页显示：</label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                className={`${selectInputClasses} w-auto`}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}条
                  </option>
                ))}
              </select>
            </div>
          )}

          {showJumpToPage && (
            <div className="flex items-center gap-3 min-w-[260px]">
              <label className={`${labelClasses} whitespace-nowrap shrink-0`} style={{ wordBreak: 'keep-all' }}>跳转到：</label>
              <input
                type="number"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="页码"
                min="1"
                max={totalPages}
                className={`${selectInputClasses} w-20 text-center`}
              />
              <button type="button" onClick={handleJumpToPage} className={`${baseButtonClasses} border-primary-500 bg-primary-500 text-white hover:bg-primary-600`}>
                跳转
              </button>
            </div>
          )}
        </div>
      )}

      {showRecordInfo && (
        <div className={infoClasses}>
          <span>共 {totalRecords || 0} 条记录，第 {currentPage || 1} 页，共 {Math.max(totalPages || 1, 1)} 页</span>
          <span>显示第 {start || 1} - {end || (totalRecords || 0)} 条记录</span>
        </div>
      )}

      {totalPages > 1 && (
        <div className={paginationClasses}>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={getButtonClasses({ disabled: currentPage === 1 })}
            title="第一页"
          >
            首页
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={getButtonClasses({ disabled: currentPage === 1 })}
          >
            上一页
          </button>

          {generatePageNumbers().map((pageNum) => (
            <button
              type="button"
              key={pageNum}
              className={getButtonClasses({ isActive: currentPage === pageNum })}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={getButtonClasses({ disabled: currentPage === totalPages })}
          >
            下一页
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={getButtonClasses({ disabled: currentPage === totalPages })}
            title="最后一页"
          >
            末页
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;

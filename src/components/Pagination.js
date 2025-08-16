import React from 'react';
import './Pagination.css';

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
    <div className="pagination-wrapper">
      {/* 分页控制区域 */}
      {(showPageSizeSelector || showJumpToPage) && (
        <div className="pagination-controls">
          {showPageSizeSelector && (
            <div className="page-size-selector">
              <label>每页显示：</label>
              <select value={pageSize} onChange={(e) => onPageSizeChange(parseInt(e.target.value))}>
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}条</option>
                ))}
              </select>
            </div>
          )}
          
          {showJumpToPage && (
            <div className="jump-to-page">
              <label>跳转到：</label>
              <input
                type="number"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="页码"
                min="1"
                max={totalPages}
              />
              <button onClick={handleJumpToPage}>跳转</button>
            </div>
          )}
        </div>
      )}
      
      {/* 分页信息 */}
      {showRecordInfo && (
        <div className="pagination-info">
          <span>共 {totalRecords || 0} 条记录，第 {currentPage || 1} 页，共 {Math.max(totalPages || 1, 1)} 页</span>
          <span>显示第 {start || 1} - {end || (totalRecords || 0)} 条记录</span>
        </div>
      )}
      
      {/* 分页控件 - 只有当总页数大于1时才显示 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="page-btn"
            title="第一页"
          >
            首页
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            上一页
          </button>
          
          {generatePageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            下一页
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="page-btn"
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

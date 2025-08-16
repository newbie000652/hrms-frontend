// src/pages/LogsPage.js
import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/logService';
import Pagination from '../components/Pagination';
import './LogsPage.css';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getLogs(currentPage, pageSize);
      setLogs(data.records);
      setTotalPages(data.pages || Math.ceil(data.total / pageSize));
      setTotalRecords(data.total);
    } catch (err) {
      setError('加载日志信息失败，请稍后重试。');
      setLogs([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置到第一页
  };

  // 计算当前页的记录序号范围
  const getRecordRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);
    return { start, end };
  };

  const { start, end } = getRecordRange();

  return (
    <div className="logs-page">
      <h1>系统日志</h1>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <>
          <table className="logs-table">
            <thead>
              <tr>
                <th width="60">序号</th>
                <th>账户ID</th>
                <th>操作</th>
                <th>操作对象</th>
                <th>操作时间</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td className="record-number">{start + index}</td>
                    <td>{log.accountId}</td>
                    <td>{log.action}</td>
                    <td>{log.target}</td>
                    <td>{log.actionTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    暂无日志数据。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* 使用通用分页组件 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
            showJumpToPage={true}
            showRecordInfo={true}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </>
      )}
    </div>
  );
};

export default LogsPage;
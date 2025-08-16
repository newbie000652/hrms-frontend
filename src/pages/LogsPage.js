// src/pages/LogsPage.js
import React, { useEffect, useState } from 'react';
import { getLogs } from '../services/logService';
import './LogsPage.css';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getLogs(currentPage);
      setLogs(data.records);
      setTotalPages(data.pages);
    } catch (err) {
      setError('加载日志信息失败，请稍后重试。');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
                    <td>{log.accountId}</td>
                    <td>{log.action}</td>
                    <td>{log.target}</td>
                    <td>{log.actionTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    暂无日志数据。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              &larr;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={index + 1 === currentPage ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LogsPage;
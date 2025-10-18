// src/pages/LogsPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { getLogs } from '../services/logService';
import PageHeader from '../components/Layout/PageHeader';
import Table from '../components/Layout/Table';
import Alert from '../components/Layout/Alert';
import Pagination from '../components/Pagination';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLogs(currentPage, pageSize);
      setLogs(data.records);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
      setTotalRecords(data.total);
    } catch (err) {
      setError('加载日志信息失败，请稍后重试。');
      setLogs([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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

  const { start } = getRecordRange();

  const columns = [
    { label: '序号', field: 'index', width: '60px', render: (row, index) => start + index },
    { label: '账户ID', field: 'accountId' },
    { label: '操作', field: 'action' },
    { label: '操作对象', field: 'target' },
    { label: '操作时间', field: 'actionTime' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="系统日志" />

      {error && <Alert>{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : (
        <>
          <Table columns={columns} data={logs} emptyMessage="暂无日志数据" />

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

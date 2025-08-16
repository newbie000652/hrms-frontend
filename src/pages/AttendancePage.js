import React, { useEffect, useState } from 'react';
import { getAttendanceRecords, signIn, signOut, requestLeave, approveLeave, getPendingLeaveRequests } from '../services/attendanceService';
import Pagination from '../components/Pagination';
import './AttendancePage.css';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ employeeId: '', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAttendance();
  }, [filter, currentPage, pageSize]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching attendance with params:', { filter, currentPage, pageSize });
      const data = await getAttendanceRecords(filter, currentPage, pageSize);
      console.log('Received attendance data:', data);
      setAttendanceRecords(data.records);
      setTotalRecords(data.total);
      // 计算总页数
      const calculatedTotalPages = Math.ceil(data.total / pageSize);
      setTotalPages(calculatedTotalPages);
      console.log('Calculated pagination:', { 
        total: data.total, 
        pageSize, 
        calculatedTotalPages, 
        currentPage 
      });
      // 如果当前页超出总页数，重置为第一页
      if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('加载考勤记录失败，请稍后再试。');
      setAttendanceRecords([]);
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

  const handleAttendanceAction = async (action) => {
    try {
      if (action === '签到') {
        await signIn(filter.employeeId);
      } else if (action === '签退') {
        await signOut(filter.employeeId);
      } else if (action === '请假') {
        await requestLeave(filter.employeeId);
      }
      fetchAttendance();
    } catch (err) {
      // 删除 setError('操作失败，请稍后再试。');
    }
  };

  const handleApproveLeave = async (id) => {
    try {
      await approveLeave(id);
      fetchAttendance();
    } catch (err) {
      // 删除 setError('审批失败，请稍后再试。');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAttendance();
  };

  const handleShowPendingLeaves = async () => {
    setIsLoading(true);
    try {
      // 使用分页参数获取待审批请假记录
      const data = await getPendingLeaveRequests(currentPage, pageSize);
      if (data && data.records) {
        // 如果是分页数据
        setAttendanceRecords(data.records);
        setTotalRecords(data.total);
        const calculatedTotalPages = Math.ceil(data.total / pageSize);
        setTotalPages(calculatedTotalPages);
      } else {
        // 如果是普通列表数据（兼容旧版本）
        setAttendanceRecords(data || []);
        setTotalRecords(data ? data.length : 0);
        setTotalPages(1);
      }
    } catch (err) {
      setError('加载待审批请假记录失败，请稍后再试。');
      setAttendanceRecords([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算当前页的记录序号范围
  const getRecordRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);
    return { start, end };
  };

  const { start, end } = getRecordRange();

  return (
    <div className="attendance-page">
      <h1>考勤记录</h1>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <>
          <div className="filter-container">
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              placeholder="选择日期"
            />
            <input
              type="text"
              name="employeeId"
              value={filter.employeeId}
              onChange={handleFilterChange}
              placeholder="输入员工ID"
            />
            <button onClick={handleSearch}>搜索</button>
            <div className="button-group">
              <button onClick={() => handleAttendanceAction('签到')}>签到</button>
              <button onClick={() => handleAttendanceAction('签退')}>签退</button>
              <button onClick={() => handleAttendanceAction('请假')}>请假</button>
              <button onClick={handleShowPendingLeaves}>显示待审批请假</button>
            </div>
          </div>
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th width="60">序号</th>
                  <th>员工ID</th>
                  <th>员工姓名</th>
                  <th>时间</th>
                  <th>操作</th>
                  <th>状态</th>
                  <th>审批</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record, index) => (
                    <tr key={record.id}>
                      <td className="record-number">{start + index}</td>
                      <td>{record.employeeId}</td>
                      <td>{record.employeeName}</td>
                      <td>{record.time}</td>
                      <td>{record.action}</td>
                      <td>{record.status}</td>
                      <td>
                        {record.status === '请假待审批' && (
                          <button onClick={() => handleApproveLeave(record.id)}>审批</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">暂无考勤记录。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
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

export default AttendancePage;
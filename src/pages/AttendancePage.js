import React, { useEffect, useState } from 'react';
import { getAttendanceRecords, signIn, signOut, requestLeave, approveLeave, getPendingLeaveRequests } from '../services/attendanceService';
import './AttendancePage.css';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ employeeId: '', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAttendance();
  }, [filter, currentPage]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const data = await getAttendanceRecords(filter, currentPage);
      setAttendanceRecords(data.records);
      setTotalPages(data.total);
    } catch (err) {
      setError('加载考勤记录失败，请稍后再试。');
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      const data = await getPendingLeaveRequests();
      setAttendanceRecords(data);
      setTotalPages(1);
    } catch (err) {
      setError('加载待审批请假记录失败，请稍后再试。');
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

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
                  <th>员工ID</th>
                  <th></th>{/*员工姓名*/}
                  <th>时间</th>
                  <th>操作</th>
                  <th>状态</th>
                  <th>审批</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
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
                ))}
              </tbody>
            </table>
          </div>
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

export default AttendancePage;
import React, { useEffect, useState, useCallback } from 'react';
import { getAttendanceRecords, signIn, signOut, requestLeave, approveLeave, getPendingLeaveRequests } from '../services/attendanceService';
import { getActiveEmployees, getInactiveEmployees } from '../services/employeeService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
import Alert from '../components/Layout/Alert';
import { PrimaryButton } from '../components/Layout/Buttons';
import Pagination from '../components/Pagination';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterForm, setFilterForm] = useState({ employeeId: '', date: '' });
  const [filter, setFilter] = useState({ employeeId: '', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [employeeNameMap, setEmployeeNameMap] = useState({});

  // 放在函数声明之后，见下方第二个 useEffect

  // 获取员工姓名映射，用于表格显示
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const [activeList, inactiveList] = await Promise.all([
          getActiveEmployees(),
          getInactiveEmployees(),
        ]);
        const list = [...activeList, ...inactiveList];
        const map = {};
        list.forEach(emp => { map[String(emp.id)] = emp.name; });
        setEmployeeNameMap(map);
      } catch (e) {
        // 静默失败
      }
    };
    fetchEmployeeNames();
  }, []);

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAttendanceRecords(filter, currentPage, pageSize);
      setAttendanceRecords(data.records);
      setTotalRecords(data.total);
      // 计算总页数
      const calculatedTotalPages = Math.ceil(data.total / pageSize);
      setTotalPages(calculatedTotalPages);
      // 记录页码计算
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
  }, [filter, currentPage, pageSize]);

  // 触发加载
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

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
    setFilterForm({ ...filterForm, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
  setCurrentPage(1);
  setFilter(filterForm);
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

  const { start } = getRecordRange();

  // 将姓名映射注入数据供表格显示
  const tableData = attendanceRecords.map(r => ({
    ...r,
    employeeName: r.employeeName || employeeNameMap[String(r.employeeId)] || '-',
  }));

  const columns = [
    { label: '序号', field: 'index', width: '60px', render: (row, index) => start + index },
    { label: '员工ID', field: 'employeeId' },
    { label: '员工姓名', field: 'employeeName' },
    { label: '时间', field: 'time' },
    { label: '操作', field: 'action' },
    { label: '状态', field: 'status' },
  ];

  const actions = [
    { 
      label: '审批', 
      variant: 'primary', 
      onClick: (row) => handleApproveLeave(row.id),
      condition: (row) => row.status === '请假待审批'
    },
  ];

  const filteredActions = actions.map(action => ({
    ...action,
    onClick: (row) => action.condition && !action.condition(row) ? null : action.onClick(row)
  }));

  return (
    <div className="space-y-5">
      <PageHeader title="考勤管理" />

      {error && <Alert>{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : (
        <>
          <SearchBar>
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <input
              type="text"
              name="employeeId"
              value={filterForm.employeeId}
              onChange={handleFilterChange}
              placeholder="输入员工ID"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <PrimaryButton onClick={handleSearch}>搜索</PrimaryButton>
            <div className="col-span-full flex gap-2">
              <PrimaryButton onClick={() => handleAttendanceAction('签到')}>签到</PrimaryButton>
              <PrimaryButton onClick={() => handleAttendanceAction('签退')}>签退</PrimaryButton>
              <PrimaryButton onClick={() => handleAttendanceAction('请假')}>请假</PrimaryButton>
              <PrimaryButton onClick={handleShowPendingLeaves}>显示待审批请假</PrimaryButton>
            </div>
          </SearchBar>

          <Table columns={columns} data={tableData} actions={filteredActions} emptyMessage="暂无考勤记录" />

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

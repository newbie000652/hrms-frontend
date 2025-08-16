import React, { useEffect, useState } from 'react';
import { getEmployees, addEmployee, updateEmployee, getEmployeeDetails, markEmployeeAsInactive } from '../services/employeeService';
import './EmployeePage.css';
import Modal from '../components/Modal';
import EmployeeForm from '../components/Form/EmployeeForm';
import EmployeeDetails from '../components/EmployeeDetails';
import Pagination from '../components/Pagination';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({ employeeId: '', employeeName: '', level: '', department: '' });

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees(currentPage, search, pageSize);
      
      setEmployees(data.records);
      setTotalRecords(data.total);
      // 计算总页数
      const calculatedTotalPages = Math.ceil(data.total / pageSize);
      setTotalPages(calculatedTotalPages);
      
      // 如果当前页超出总页数，重置为第一页
      if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      setError('加载员工信息失败，请稍后重试。');
      setEmployees([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect 中调用
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, pageSize, search]);

  // 在需要调用 fetchEmployees 的地方直接使用
  const handleSaveEmployee = async (formData) => {
    try {
      if (editingEmployee) {
        await updateEmployee({ ...editingEmployee, ...formData });
        alert('修改成功');
      } else {
        await addEmployee(formData);
        alert('新增成功');
      }
      setModalOpen(false);
      setEditingEmployee(null);
      setCurrentPage(1);
      await fetchEmployees(); // 确保更新后重新加载数据
    } catch (error) {
      console.error('保存员工失败:', error.response?.data?.message || error.message);
      alert(`保存失败: ${error.response?.data?.message || '错误喵'}`);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await markEmployeeAsInactive(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      // 如果当前页没有数据了，且不是第一页，则跳转到上一页
      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchEmployees(); // 重新加载当前页数据
      }
    } catch (err) {
      setError('删除员工失败，请稍后重试。');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await getEmployeeDetails(id);
      if (response.success) {
        setViewingEmployee(response.data);
        setDetailsOpen(true);
      } else {
        setError(response.message || '获取员工详细信息失败，请稍后重试。');
      }
    } catch (err) {
      setError('获取员工详细信息失败，请稍后重试。');
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置到第一页
  };

  const handleSearchChange = (e) => {
    const { name, value, type } = e.target;
    const formattedValue =
      type === 'number' && value === '' ? '' : value.trim();
    setSearch({ ...search, [name]: formattedValue });
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingEmployee(null);
  };

  // 计算当前页的记录序号范围
  const getRecordRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRecords);
    return { start, end };
  };

  const { start, end } = getRecordRange();

  return (
    <div className="employee-page">
      <h1>员工管理</h1>
      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <>
          <div className="search-container">
            <input
              type="number"
              name="employeeId"
              value={search.employeeId}
              onChange={handleSearchChange}
              placeholder="员工编号"
            />
            <input
              type="text"
              name="employeeName"
              value={search.employeeName}
              onChange={handleSearchChange}
              placeholder="员工姓名"
            />
            <input
              type="number"
              name="level"
              value={search.level}
              onChange={handleSearchChange}
              placeholder="员工级别"
            />
            <input
              type="number"
              name="department"
              value={search.department}
              onChange={handleSearchChange}
              placeholder="员工部门"
            />
            <button onClick={handleSearch}>搜索</button>
          </div>
          <div className="add-button-container">
            <button className="add-button" onClick={handleAdd}>新增员工</button>
          </div>
          
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th width="60">序号</th>
                  <th>编号</th>
                  <th>姓名</th>
                  <th>级别</th>
                  <th>部门</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees.map((employee, index) => (
                    <tr key={employee.id}>
                      <td className="record-number">{start + index}</td>
                      <td>{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.levelId}</td>
                      <td>{employee.departmentId || '未分配'}</td>
                      <td>
                        <button onClick={() => handleViewDetails(employee.id)}>详细信息</button>
                        <button onClick={() => handleEdit(employee)}>修改</button>
                        <button onClick={() => handleDeleteEmployee(employee.id)}>删除</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">暂无员工数据。</td>
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

      {modalOpen && (
        <Modal
          title={editingEmployee ? '编辑员工' : '新增员工'}
          onClose={handleCancel}
        >
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSaveEmployee}
            onCancel={handleCancel}
          />
        </Modal>
      )}

      {detailsOpen && (
        <Modal
          title="员工详细信息"
          onClose={() => setDetailsOpen(false)}
        >
          <EmployeeDetails employee={viewingEmployee} onClose={() => setDetailsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default EmployeePage;
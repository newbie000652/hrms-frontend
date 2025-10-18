import React, { useEffect, useState } from 'react';
// axios removed; using metaService instead
import useMetaOptions from '../hooks/useMetaOptions';
import { getEmployees, addEmployee, updateEmployee, getEmployeeDetails, markEmployeeAsInactive } from '../services/employeeService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
import { PrimaryButton } from '../components/Layout/Buttons';
import Alert from '../components/Layout/Alert';
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
  // 输入表单态与已应用查询态分离：只有点击“搜索”才应用
  const [searchForm, setSearchForm] = useState({ employeeId: '', employeeName: '', level: '', department: '' });
  const [searchQuery, setSearchQuery] = useState({ employeeId: '', employeeName: '', level: '', department: '' });
  const { departments, levels } = useMetaOptions();

  const fetchEmployees = async () => {
    try {
  const data = await getEmployees(currentPage, searchQuery, pageSize);
      
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchQuery]);

  // meta options now loaded via hook

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
    const { name, value } = e.target;
    // 保留原始输入，避免中文输入法组合期的闪烁；在提交时再做清洗
    setSearchForm({ ...searchForm, [name]: value });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchForm);
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

  const { start } = getRecordRange();

  const columns = [
    { label: '序号', field: 'index', width: '60px', render: (row, index) => start + index },
    { label: '编号', field: 'id' },
    { label: '姓名', field: 'name' },
    { label: '级别', field: 'levelId' },
    { label: '部门', field: 'departmentId', render: (row) => row.departmentId || '未分配' },
  ];

  const actions = [
    { label: '详情', variant: 'primary', onClick: (row) => handleViewDetails(row.id) },
    { label: '修改', variant: 'default', onClick: handleEdit },
    { label: '删除', variant: 'danger', onClick: (row) => handleDeleteEmployee(row.id) },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="员工管理"
        actions={<PrimaryButton onClick={handleAdd}>新增员工</PrimaryButton>}
      />

  {error && <Alert>{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : (
        <>
          <SearchBar>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="employeeId"
              value={searchForm.employeeId}
              onChange={handleSearchChange}
              placeholder="员工编号"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <input
              type="text"
              name="employeeName"
              value={searchForm.employeeName}
              onChange={handleSearchChange}
              placeholder="员工姓名"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <select
              name="level"
              value={searchForm.level}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="">全部级别</option>
              {levels.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <select
              name="department"
              value={searchForm.department}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="">全部部门</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <PrimaryButton onClick={handleSearch}>搜索</PrimaryButton>
          </SearchBar>

          <Table columns={columns} data={employees} actions={actions} emptyMessage="暂无员工数据" />

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

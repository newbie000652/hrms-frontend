// src/pages/SalaryPage.js
import React, { useEffect, useState } from 'react';
import { getSalaries, createDefaultSalary, updateSalary, deleteSalary } from '../services/salaryService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
import { PrimaryButton } from '../components/Layout/Buttons';
import Modal from '../components/Modal';
import SalaryForm from '../components/Form/SalaryForm';
import Pagination from '../components/Pagination';

const SalaryPage = () => {
    const [salaries, setSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchForm, setSearchForm] = useState({ employeeId: '', employeeName: '' });
    const [searchQuery, setSearchQuery] = useState({ employeeId: '', employeeName: '' });

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const data = await getSalaries(currentPage, pageSize, {
                    employeeId: searchQuery.employeeId ? Number(searchQuery.employeeId) : undefined,
                    employeeName: searchQuery.employeeName || undefined,
                });
                
                setSalaries(data.records || []);
                setTotalPages(Math.ceil((data.total || 0) / pageSize));
                setTotalRecords(data.total || 0);
            } catch (err) {
                console.error('Error fetching salaries:', err);
                setError('加载工资信息失败');
                setSalaries([]);
                setTotalPages(1);
                setTotalRecords(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSalaries();
    }, [currentPage, pageSize, searchQuery]);

    const handleSaveSalary = async (salary) => {
        try {
            if (salary.id) {
                const updatedSalary = await updateSalary(salary);
                setSalaries((prev) =>
                    prev.map((s) => (s.id === updatedSalary.id ? updatedSalary : s))
                );
            } else {
                const newSalary = await createDefaultSalary(salary.employeeId);
                setSalaries((prev) => [...prev, newSalary]);
            }
            setModalOpen(false);
            setEditingSalary(null);
        } catch (err) {
            setError('保存工资信息失败');
        }
    };

    const handleDeleteSalary = async (id) => {
        try {
            await deleteSalary(id);
            setSalaries((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError('删除工资失败');
        }
    };

    const handleEdit = (salary) => {
        setEditingSalary(salary);
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
        setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchQuery(searchForm);
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
        { label: '员工编号', field: 'employeeId' },
        { label: '基础薪资', field: 'baseSalary' },
        { label: '奖金', field: 'bonus' },
        { label: '罚款', field: 'penalty' },
        { label: '创建时间', field: 'createTime' },
        { label: '更新时间', field: 'updateTime' },
    ];

    const actions = [
        { label: '编辑', variant: 'default', onClick: handleEdit },
        { label: '删除', variant: 'danger', onClick: (row) => handleDeleteSalary(row.id) },
    ];

    return (
        <div className="space-y-5">
            <PageHeader title="工资管理" />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

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
                            placeholder="按员工ID精确查询"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <input
                            type="text"
                            name="employeeName"
                            value={searchForm.employeeName}
                            onChange={handleSearchChange}
                            placeholder="按姓名模糊查询"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <PrimaryButton onClick={handleSearch}>搜索</PrimaryButton>
                    </SearchBar>

                    <Table columns={columns} data={salaries} actions={actions} emptyMessage="暂无工资记录" />

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
                <Modal title="编辑工资" onClose={() => setModalOpen(false)}>
                    <SalaryForm 
                        salary={editingSalary} 
                        onSave={handleSaveSalary} 
                        onCancel={() => setModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SalaryPage;

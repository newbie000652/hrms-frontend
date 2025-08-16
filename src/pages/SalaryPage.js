// src/pages/SalaryPage.js
import React, { useEffect, useState } from 'react';
import { getSalaries, createDefaultSalary, calculateSalary, updateSalary, deleteSalary } from '../services/salaryService';
import Modal from '../components/Modal';
import SalaryForm from '../components/Form/SalaryForm';
import Pagination from '../components/Pagination';
import './salaryPage.css';

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
    const [search, setSearch] = useState({ searchBy: '', keyword: '' });

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                console.log('Fetching salaries with params:', { currentPage, pageSize, search });
                const data = await getSalaries(currentPage, pageSize, search.searchBy, search.keyword);
                console.log('Received salary data:', data);
                console.log('Data records:', data.records);
                console.log('Data total:', data.total);
                console.log('Data pages:', data.pages);
                
                setSalaries(data.records || []);
                setTotalPages(data.pages || Math.ceil((data.total || 0) / pageSize));
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
    }, [currentPage, pageSize, search]);

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
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

    // 计算当前页的记录序号范围
    const getRecordRange = () => {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalRecords);
        return { start, end };
    };

    const { start, end } = getRecordRange();

    return (
        <div className="salary-page">
            <h1>工资管理</h1>
            {error && <p className="error-message">{error}</p>}
            {isLoading ? (
                <p>加载中...</p>
            ) : (
                <>
                    <div className="search-container">
                        <input
                            type="text"
                            name="searchBy"
                            value={search.searchBy}
                            onChange={handleSearchChange}
                            placeholder="搜索字段"
                        />
                        <input
                            type="text"
                            name="keyword"
                            value={search.keyword}
                            onChange={handleSearchChange}
                            placeholder="关键字"
                        />
                        <button onClick={handleSearch}>搜索</button>
                    </div>
                    <div className="salary-table-container">
                        <table className="salary-table">
                            <thead>
                                <tr>
                                    <th width="60">序号</th>
                                    <th>员工编号</th>
                                    <th>基础薪资</th>
                                    <th>奖金</th>
                                    <th>罚款</th>
                                    <th>创建时间</th>
                                    <th>更新时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.length > 0 ? (
                                    salaries.map((salary, index) => (
                                        <tr key={salary.id}>
                                            <td className="record-number">{start + index}</td>
                                            <td>{salary.employeeId}</td>
                                            <td>{salary.baseSalary}</td>
                                            <td>{salary.bonus}</td>
                                            <td>{salary.penalty}</td>
                                            <td>{salary.createTime}</td>
                                            <td>{salary.updateTime}</td>
                                            <td>
                                                <button onClick={() => handleEdit(salary)}>编辑</button>
                                                <button onClick={() => handleDeleteSalary(salary.id)}>删除</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="no-data">暂无工资记录。</td>
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
                <Modal title="编辑工资" onClose={() => setModalOpen(false)}>
                    <SalaryForm salary={editingSalary} onSave={handleSaveSalary} />
                </Modal>
            )}
        </div>
    );
};

export default SalaryPage;
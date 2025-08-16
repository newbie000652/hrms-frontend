// src/pages/SalaryPage.js
import React, { useEffect, useState } from 'react';
import { getSalaries, createDefaultSalary, calculateSalary, updateSalary, deleteSalary } from '../services/salaryService';
import Modal from '../components/Modal';
import SalaryForm from '../components/Form/SalaryForm';
import './salaryPage.css';

const SalaryPage = () => {
    const [salaries, setSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState({ searchBy: '', keyword: '' });

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const data = await getSalaries(currentPage, 10, search.searchBy, search.keyword);
                setSalaries(data.records);
                setTotalPages(data.total);
            } catch (err) {
                setError('加载工资信息失败');
                setSalaries([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSalaries();
    }, [currentPage, search]);

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

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

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
                                {salaries.map((salary) => (
                                    <tr key={salary.id}>
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

            {modalOpen && (
                <Modal title="编辑工资" onClose={() => setModalOpen(false)}>
                    <SalaryForm salary={editingSalary} onSave={handleSaveSalary} />
                </Modal>
            )}
        </div>
    );
};

export default SalaryPage;
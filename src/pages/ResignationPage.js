import React, { useEffect, useState } from 'react';
import { getResignations, getResignationDetails } from '../services/resignationService';
import Modal from '../components/Modal';
import './ResignationPage.css';

const ResignationPage = () => {
    const [resignations, setResignations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewingResignation, setViewingResignation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState({ employeeId: '', employeeName: '', level: '', department: '' });

    useEffect(() => {
        const fetchResignations = async () => {
            try {
                const data = await getResignations(currentPage, 10, search);
                setResignations(data.records);
                setTotalPages(data.total);
            } catch (err) {
                setError('加载离职数据失败，请稍后重试。');
                setResignations([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResignations();
    }, [currentPage, search]);

    const handleViewDetails = async (id) => {
        try {
            const data = await getResignationDetails(id);
            setViewingResignation(data);
            setModalOpen(true);
        } catch (err) {
            setError('加载详情失败，请稍后重试。');
        }
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
        <div className="resignation-page">
            <h1>离职管理</h1>
            {error && <p className="error-message">{error}</p>}
            {isLoading ? (
                <p>加载中...</p>
            ) : (
                <>
                    <div className="search-container">
                        <input
                            type="text"
                            name="employeeId"
                            value={search.employeeId}
                            onChange={handleSearchChange}
                            placeholder="员工ID"
                        />
                        <input
                            type="text"
                            name="employeeName"
                            value={search.employeeName}
                            onChange={handleSearchChange}
                            placeholder="员工姓名"
                        />
                        <input
                            type="text"
                            name="level"
                            value={search.level}
                            onChange={handleSearchChange}
                            placeholder="员工级别"
                        />
                        <input
                            type="text"
                            name="department"
                            value={search.department}
                            onChange={handleSearchChange}
                            placeholder="员工部门"
                        />
                        <button onClick={handleSearch}>搜索</button>
                    </div>
                    <div className="table-container">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>姓名</th>
                                    <th>级别</th>
                                    <th>部门</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resignations.length > 0 ? (
                                    resignations.map((resignation) => (
                                        <tr key={resignation.id}>
                                            <td>{resignation.id}</td>
                                            <td>{resignation.name}</td>
                                            <td>{resignation.levelId}</td>
                                            <td>{resignation.departmentId}</td>
                                            <td>
                                                <button onClick={() => handleViewDetails(resignation.id)}>查看详情</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-data">暂无离职数据。</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={currentPage === index + 1 ? 'active' : ''}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            &gt;
                        </button>
                    </div>
                </>
            )}

            {modalOpen && (
                <Modal title="离职详情" onClose={() => setModalOpen(false)}>
                    <div className="resignation-details">
                        <h3>基本信息</h3>
                        <p>编号: {viewingResignation.id || '未提供'}</p>
                        <p>姓名: {viewingResignation.name || '未提供'}</p>
                        <p>性别: {viewingResignation.gender || '未提供'}</p>
                        <p>邮箱: {viewingResignation.email || '未提供'}</p>
                        <p>电话: {viewingResignation.phone || '未提供'}</p>
                        <p>入职日期: {viewingResignation.entryDate ? new Date(viewingResignation.entryDate).toLocaleDateString() : '未提供'}</p>
                        <p>状态: {viewingResignation.isActive ? '在职' : '离职'}</p>

                        <h3>部门信息</h3>
                        <p>部门编号: {viewingResignation.departmentId || '未分配'}</p>
                        <p>部门名称: {viewingResignation.departmentName || '未提供'}</p>

                        <h3>级别信息</h3>
                        <p>级别编号: {viewingResignation.levelId || '未分配'}</p>
                        <p>级别名称: {viewingResignation.levelName || '未提供'}</p>
                        <p>基础薪资: {viewingResignation.baseSalary ? `¥${viewingResignation.baseSalary}` : '未提供'}</p>

                        <h3>技能信息</h3>
                        {viewingResignation.skillNames && viewingResignation.skillNames.length > 0 ? (
                            <ul>
                                {viewingResignation.skillNames.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>暂无技能信息</p>
                        )}

                        <button onClick={() => setModalOpen(false)}>关闭</button>
                    </div>
                </Modal>


            )}
        </div>
    );
};

export default ResignationPage;
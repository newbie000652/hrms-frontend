import React, { useEffect, useState } from 'react';
import { getPerformanceRecords, createPerformanceRecord, updatePerformanceRecord } from '../services/performanceService';
import Modal from '../components/Modal';
import './PerformancePage.css';

const PerformancePage = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPerformance, setEditingPerformance] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState({ searchBy: '', keyword: '' });

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const data = await getPerformanceRecords(currentPage, 10, search.searchBy, search.keyword);
                setPerformanceData(data.records);
                setTotalPages(data.total);
            } catch (err) {
                setError('加载绩效数据失败');
                setPerformanceData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPerformanceData();
    }, [currentPage, search]);

    const handleSavePerformance = async (performance) => {
        try {
            if (performance.id) {
                const updatedPerformance = await updatePerformanceRecord(performance.id, performance.score, performance.remark);
                setPerformanceData((prev) =>
                    prev.map((p) => (p.id === updatedPerformance.id ? updatedPerformance : p))
                );
            } else {
                const newPerformance = await createPerformanceRecord(performance);
                setPerformanceData((prev) => [...prev, newPerformance]);
            }
            setModalOpen(false);
            setEditingPerformance(null);
        } catch (err) {
            setError('保存绩效数据失败');
        }
    };

    const handleEdit = (performance) => {
        setEditingPerformance(performance);
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
        <div className="performance-page">
            <h1>绩效管理</h1>
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
                            placeholder="关键词"
                        />
                        <button onClick={handleSearch}>搜索</button>
                    </div>
                    <div className="performance-table-container">
                        <table className="performance-table">
                            <thead>
                                <tr>
                                    <th>员工ID</th>
                                    <th>评分</th>
                                    <th>评审日期</th>
                                    <th>备注</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceData.map((performance) => (
                                    <tr key={performance.id}>
                                        <td>{performance.employeeId}</td>
                                        <td>{performance.score}</td>
                                        <td>{performance.reviewDate}</td>
                                        <td>{performance.remark}</td>
                                        <td>
                                            <button onClick={() => handleEdit(performance)}>编辑</button>
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
                <Modal title="编辑绩效" onClose={() => setModalOpen(false)}>
                    <div>
                        <label>
                            评分:
                            <input
                                type="number"
                                value={editingPerformance?.score || ''}
                                onChange={(e) => setEditingPerformance({ ...editingPerformance, score: e.target.value })}
                            />
                        </label>
                        <label>
                            备注:
                            <input
                                type="text"
                                value={editingPerformance?.remark || ''}
                                onChange={(e) => setEditingPerformance({ ...editingPerformance, remark: e.target.value })}
                            />
                        </label>
                        <div className="modal-buttons">
                            <button onClick={() => handleSavePerformance(editingPerformance)}>保存</button>
                            <button onClick={() => setModalOpen(false)}>取消</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PerformancePage;
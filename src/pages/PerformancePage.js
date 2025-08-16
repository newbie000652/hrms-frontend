import React, { useEffect, useState } from 'react';
import { getPerformanceRecords, createPerformanceRecord, updatePerformanceRecord } from '../services/performanceService';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import './PerformancePage.css';

const PerformancePage = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPerformance, setEditingPerformance] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState({ searchBy: '', keyword: '' });

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const data = await getPerformanceRecords(currentPage, pageSize, search.searchBy, search.keyword);
                setPerformanceData(data.records);
                setTotalPages(data.pages || Math.ceil(data.total / pageSize));
                setTotalRecords(data.total);
            } catch (err) {
                setError('加载绩效数据失败');
                setPerformanceData([]);
                setTotalPages(1);
                setTotalRecords(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPerformanceData();
    }, [currentPage, pageSize, search]);

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
                                    <th width="60">序号</th>
                                    <th>员工ID</th>
                                    <th>评分</th>
                                    <th>评审日期</th>
                                    <th>备注</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceData.length > 0 ? (
                                    performanceData.map((performance, index) => (
                                        <tr key={performance.id}>
                                            <td className="record-number">{start + index}</td>
                                            <td>{performance.employeeId}</td>
                                            <td>{performance.score}</td>
                                            <td>{performance.reviewDate}</td>
                                            <td>{performance.remark}</td>
                                            <td>
                                                <button onClick={() => handleEdit(performance)}>编辑</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data">暂无绩效记录。</td>
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
import React, { useEffect, useState } from 'react';
import { getPerformanceRecords, createPerformanceRecord, updatePerformanceRecord } from '../services/performanceService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
import { PrimaryButton, SecondaryButton } from '../components/Layout/Buttons';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

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

    const columns = [
        { label: '序号', field: 'index', width: '60px', render: (row, index) => start + index },
        { label: '员工ID', field: 'employeeId' },
        { label: '评分', field: 'score' },
        { label: '评审日期', field: 'reviewDate' },
        { label: '备注', field: 'remark' },
    ];

    const actions = [
        { label: '编辑', variant: 'default', onClick: handleEdit },
    ];

    return (
        <div className="space-y-5">
            <PageHeader title="绩效管理" />

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
                            name="searchBy"
                            value={search.searchBy}
                            onChange={handleSearchChange}
                            placeholder="搜索字段"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <input
                            type="text"
                            name="keyword"
                            value={search.keyword}
                            onChange={handleSearchChange}
                            placeholder="关键词"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <PrimaryButton onClick={handleSearch}>搜索</PrimaryButton>
                    </SearchBar>

                    <Table columns={columns} data={performanceData} actions={actions} emptyMessage="暂无绩效记录" />

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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">评分</label>
                            <input
                                type="number"
                                value={editingPerformance?.score || ''}
                                onChange={(e) => setEditingPerformance({ ...editingPerformance, score: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                            <input
                                type="text"
                                value={editingPerformance?.remark || ''}
                                onChange={(e) => setEditingPerformance({ ...editingPerformance, remark: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <PrimaryButton onClick={() => handleSavePerformance(editingPerformance)}>保存</PrimaryButton>
                            <SecondaryButton onClick={() => setModalOpen(false)}>取消</SecondaryButton>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PerformancePage;

import React, { useEffect, useState } from 'react';
import useMetaOptions from '../hooks/useMetaOptions';
import { getResignations, getResignationDetails } from '../services/resignationService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
import { PrimaryButton, SecondaryButton } from '../components/Layout/Buttons';
import Modal from '../components/Modal';
import Alert from '../components/Layout/Alert';
import Pagination from '../components/Pagination';

const ResignationPage = () => {
    const [resignations, setResignations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewingResignation, setViewingResignation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchForm, setSearchForm] = useState({ employeeId: '', employeeName: '', level: '', department: '' });
    const [searchQuery, setSearchQuery] = useState({ employeeId: '', employeeName: '', level: '', department: '' });
    const { levels, departments } = useMetaOptions();

    useEffect(() => {
        const fetchResignations = async () => {
            try {
                const data = await getResignations(currentPage, pageSize, searchQuery);
                setResignations(data.records);
                setTotalRecords(data.total);
                // 计算总页数
                const calculatedTotalPages = Math.ceil(data.total / pageSize);
                setTotalPages(calculatedTotalPages);
                // 如果当前页超出总页数，重置为第一页
                if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
                    setCurrentPage(1);
                }
            } catch (err) {
                setError('加载离职数据失败，请稍后重试。');
                setResignations([]);
                setTotalPages(1);
                setTotalRecords(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResignations();
    }, [currentPage, pageSize, searchQuery]);

    // 元数据通过 hook 加载

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
        { label: 'ID', field: 'id' },
        { label: '姓名', field: 'name' },
        { label: '级别', field: 'levelId' },
        { label: '部门', field: 'departmentId' },
    ];

    const actions = [
        { label: '查看详情', variant: 'primary', onClick: (row) => handleViewDetails(row.id) },
    ];

    return (
        <div className="space-y-5">
            <PageHeader title="离职管理" />

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
                            placeholder="员工ID"
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

                    <Table columns={columns} data={resignations} actions={actions} emptyMessage="暂无离职数据" />

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
                <Modal title="离职详情" onClose={() => setModalOpen(false)}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">基本信息</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="font-medium text-gray-600">编号:</span> {viewingResignation?.id || '未提供'}</p>
                                <p><span className="font-medium text-gray-600">姓名:</span> {viewingResignation?.name || '未提供'}</p>
                                <p><span className="font-medium text-gray-600">性别:</span> {viewingResignation?.gender || '未提供'}</p>
                                <p><span className="font-medium text-gray-600">邮箱:</span> {viewingResignation?.email || '未提供'}</p>
                                <p><span className="font-medium text-gray-600">电话:</span> {viewingResignation?.phone || '未提供'}</p>
                                <p><span className="font-medium text-gray-600">入职日期:</span> {viewingResignation?.entryDate ? new Date(viewingResignation.entryDate).toLocaleDateString() : '未提供'}</p>
                                <p><span className="font-medium text-gray-600">状态:</span> {viewingResignation?.isActive ? '在职' : '离职'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">部门信息</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="font-medium text-gray-600">部门编号:</span> {viewingResignation?.departmentId || '未分配'}</p>
                                <p><span className="font-medium text-gray-600">部门名称:</span> {viewingResignation?.departmentName || '未提供'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">级别信息</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="font-medium text-gray-600">级别编号:</span> {viewingResignation?.levelId || '未分配'}</p>
                                <p><span className="font-medium text-gray-600">级别名称:</span> {viewingResignation?.levelName || '未提供'}</p>
                                <p><span className="font-medium text-gray-600">基础薪资:</span> {viewingResignation?.baseSalary ? `¥${viewingResignation.baseSalary}` : '未提供'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">技能信息</h3>
                            {viewingResignation?.skillNames && viewingResignation.skillNames.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {viewingResignation.skillNames.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400">暂无技能信息</p>
                            )}
                        </div>

                        <SecondaryButton onClick={() => setModalOpen(false)}>关闭</SecondaryButton>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ResignationPage;

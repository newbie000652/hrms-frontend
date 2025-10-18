import React, { useEffect, useState, useCallback } from 'react';
import { getAccounts, addAccount, updateAccount, deleteAccount, getAccountById } from '../services/accountService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
import Alert from '../components/Layout/Alert';
import { PrimaryButton, SecondaryButton } from '../components/Layout/Buttons';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const AccountPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchForm, setSearchForm] = useState({ accountId: '', account: '', employeeId: '', role: '' });
    const [searchQuery, setSearchQuery] = useState({ accountId: '', account: '', employeeId: '', role: '' });

    const fetchAccounts = useCallback(async () => {
        try {
            const data = await getAccounts(currentPage, pageSize, {
                accountId: searchQuery.accountId || undefined,
                account: searchQuery.account || undefined,
                employeeId: searchQuery.employeeId || undefined,
                role: searchQuery.role || undefined,
            });
            setAccounts(data.records);
            setTotalPages(Math.ceil((data.total || 0) / pageSize));
            setTotalRecords(data.total);
        } catch (err) {
            setError('加载账户失败');
            setAccounts([]);
            setTotalPages(1);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, searchQuery]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleSaveAccount = async (account) => {
        try {
            if (account.id) {
                await updateAccount(account.id, account.password, account.role);
                alert("修改成功");
            } else {
                await addAccount(account);
                alert("新增成功");
            }
            setModalOpen(false);
            setEditingAccount(null);
            setCurrentPage(1);
            fetchAccounts(); // 重新获取账户列表
        } catch (err) {
            //setError('保存账户失败');
        }
    };

    const handleDeleteAccount = async (id) => {
        try {
            await deleteAccount(id);
            setAccounts((prev) => prev.filter((acc) => acc.id !== id));
        } catch (err) {
            setError('删除账户失败');
        }
    };

    const handleEdit = async (id) => {
        try {
            const account = await getAccountById(id);
            setEditingAccount(account);
            setModalOpen(true);
        } catch (err) {
            setError('加载账户详情失败');
        }
    };

    const handleAdd = () => {
        setEditingAccount({ account: '', password: '', employeeId: '', role: '员工' });
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
        { label: 'ID', field: 'id' },
        { label: '账户', field: 'account' },
        { label: '员工ID', field: 'employeeId' },
        { label: '角色', field: 'role' },
    ];

    const actions = [
        { label: '编辑', variant: 'primary', onClick: (row) => handleEdit(row.id) },
        { label: '删除', variant: 'danger', onClick: (row) => handleDeleteAccount(row.id) },
    ];

    return (
        <div className="space-y-5">
            <PageHeader
                title="账户管理"
                actions={<PrimaryButton onClick={handleAdd}>新增账户</PrimaryButton>}
            />

                {error && <Alert>{error}</Alert>}

            {isLoading ? (
                <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : (
                <>
                    <SearchBar>
                        <input
                            type="text"
                            name="accountId"
                            value={searchForm.accountId}
                            onChange={handleSearchChange}
                            placeholder="账户ID"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <input
                            type="text"
                            name="account"
                            value={searchForm.account}
                            onChange={handleSearchChange}
                            placeholder="账户名"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <input
                            type="text"
                            name="employeeId"
                            value={searchForm.employeeId}
                            onChange={handleSearchChange}
                            placeholder="员工ID"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
                        <select
                            name="role"
                            value={searchForm.role}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        >
                            <option value="">全部角色</option>
                            <option value="管理员">管理员</option>
                            <option value="领导">领导</option>
                            <option value="员工">员工</option>
                        </select>
                        <PrimaryButton onClick={handleSearch}>搜索</PrimaryButton>
                    </SearchBar>

                    <Table columns={columns} data={accounts} actions={actions} emptyMessage="暂无账户记录" />

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
                <Modal title={editingAccount ? '编辑账户' : '新增账户'} onClose={() => setModalOpen(false)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">账户</label>
                            <input
                                type="text"
                                value={editingAccount?.account || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, account: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                            <input
                                type="password"
                                value={editingAccount?.password || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, password: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">员工ID</label>
                            <input
                                type="text"
                                value={editingAccount?.employeeId || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, employeeId: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                            <select
                                value={editingAccount?.role || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, role: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                            >
                                <option value="管理员">管理员</option>
                                <option value="领导">领导</option>
                                <option value="员工">员工</option>
                            </select>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <PrimaryButton onClick={() => handleSaveAccount(editingAccount)}>保存</PrimaryButton>
                            <SecondaryButton onClick={() => setModalOpen(false)}>取消</SecondaryButton>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AccountPage;

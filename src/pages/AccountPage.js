import React, { useEffect, useState } from 'react';
import { getAccounts, addAccount, updateAccount, deleteAccount, getAccountById } from '../services/accountService';
import PageHeader from '../components/Layout/PageHeader';
import SearchBar from '../components/Layout/SearchBar';
import Table from '../components/Layout/Table';
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
    const [search, setSearch] = useState({ accountId: '' });

    const fetchAccounts = async () => {
        try {
            const data = await getAccounts(currentPage, pageSize, search.accountId);
            setAccounts(data.records);
            setTotalPages(data.pages || Math.ceil(data.total / pageSize));
            setTotalRecords(data.total);
        } catch (err) {
            setError('加载账户失败');
            setAccounts([]);
            setTotalPages(1);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [currentPage, pageSize, search]);

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
                            name="accountId"
                            value={search.accountId}
                            onChange={handleSearchChange}
                            placeholder="搜索账户ID"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                        />
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

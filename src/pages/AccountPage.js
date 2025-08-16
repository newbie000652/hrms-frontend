import React, { useEffect, useState } from 'react';
import { getAccounts, addAccount, updateAccount, deleteAccount, getAccountById } from '../services/accountService';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import './AccountPage.css';

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

    return (
        <div className="account-page">
            <h1>账户管理</h1>
            {error && <p className="error-message">{error}</p>}
            {isLoading ? (
                <p>加载中...</p>
            ) : (
                <>
                    <div className="action-container">
                        <input
                            type="text"
                            name="accountId"
                            value={search.accountId}
                            onChange={handleSearchChange}
                            placeholder="搜索账户ID"
                        />
                        <button onClick={handleSearch}>搜索</button>
                        <button onClick={handleAdd}>新增账户</button>
                    </div>
                    <div className="account-table-container">
                        <table className="account-table">
                            <thead>
                            <tr>
                                <th width="60">序号</th>
                                <th>ID</th>
                                <th>账户</th>
                                <th>员工ID</th>
                                <th>角色</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.length > 0 ? (
                                accounts.map((account, index) => (
                                    <tr key={account.id}>
                                        <td className="record-number">{start + index}</td>
                                        <td>{account.id}</td>
                                        <td>{account.account}</td>
                                        <td>{account.employeeId}</td>
                                        <td>{account.role}</td>
                                        <td>
                                            <button onClick={() => handleEdit(account.id)}>编辑</button>
                                            <button onClick={() => handleDeleteAccount(account.id)}>删除</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">暂无账户记录。</td>
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
                <Modal title={editingAccount ? '编辑账户' : '新增账户'} onClose={() => setModalOpen(false)}>
                    <div>
                        <label>
                            账户:
                            <input
                                type="text"
                                value={editingAccount?.account || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, account: e.target.value }))
                                }
                            />
                        </label>
                        <label>
                            密码:
                            <input
                                type="password"
                                value={editingAccount?.password || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, password: e.target.value }))
                                }
                            />
                        </label>
                        <label>
                            员工ID:
                            <input
                                type="text"
                                value={editingAccount?.employeeId || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, employeeId: e.target.value }))
                                }
                            />
                        </label>
                        <label>
                            角色:
                            <select
                                value={editingAccount?.role || ''}
                                onChange={(e) =>
                                    setEditingAccount((prev) => ({ ...prev, role: e.target.value }))
                                }
                            >
                                <option value="管理员">管理员</option>
                                <option value="领导">领导</option>
                                <option value="员工">员工</option>
                            </select>
                        </label>
                        <div className="modal-buttons">
                            <button onClick={() => handleSaveAccount(editingAccount)}>保存</button>
                            <button onClick={() => setModalOpen(false)}>取消</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AccountPage;
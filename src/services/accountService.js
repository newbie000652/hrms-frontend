import axios from 'axios';
import { API_BASE } from '../config/api';

const API_URL = `${API_BASE}/accounts`;

// 获取账户列表（多字段搜索）
export const getAccounts = async (
    page = 1,
    size = 10,
    params = {}
) => {
    const { accountId, account, employeeId, role } = params || {};
    const response = await axios.get(API_URL, {
        params: {
            page,
            size,
            accountId: accountId || undefined,
            account: account || undefined,
            employeeId: employeeId || undefined,
            role: role || undefined,
        },
    });
    return response.data;
};

// 获取单个账户
export const getAccountById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// 新增账户
export const addAccount = async (account) => {
    try {
        const response = await axios.post(API_URL, {
            account: account.account,   // 账户名
            password: account.password, // 密码
            employeeId: account.employeeId, // 员工ID
            role: account.role          // 角色
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to add account');
    }
};


// 更新账户
export const updateAccount = async (id, password, role) => {
    const response = await axios.put(`${API_URL}/${id}`, null, {
        params: { password, role },
    });
    return response.data;
};

// 删除账户
export const deleteAccount = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

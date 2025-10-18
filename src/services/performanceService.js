// src/services/performanceService.js  

import axios from 'axios';
import { API_BASE } from '../config/api';

const API_URL = `${API_BASE}/performance`;

// 获取绩效记录（支持新参数 employeeId/employeeName，兼容旧的 searchBy/keyword）
export const getPerformanceRecords = async (page = 1, size = 10, params = {}) => {
    const { employeeId, employeeName, searchBy = '', keyword = '' } = params;
    const response = await axios.get(API_URL, {
        params: {
            page,
            size,
            // 优先发送新参数
            employeeId: employeeId || undefined,
            employeeName: employeeName || undefined,
            // 兼容旧参数
            searchBy: !employeeId && !employeeName ? searchBy : undefined,
            keyword: !employeeId && !employeeName ? keyword : undefined,
        },
    });
    return response.data;
};

// 新增绩效记录
export const createPerformanceRecord = async (performance) => {
    const response = await axios.post(`${API_URL}/create`, performance);
    return response.data;
};

// 更新绩效记录
export const updatePerformanceRecord = async (id, score, remark) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, null, {
            params: { score, remark },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update performance record');
    }
};

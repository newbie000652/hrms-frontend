// src/services/performanceService.js  

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/performance';

// 获取绩效记录
export const getPerformanceRecords = async (page = 1, size = 10, searchBy = '', keyword = '') => {
    const response = await axios.get(API_URL, {
        params: { page, size, searchBy, keyword },
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
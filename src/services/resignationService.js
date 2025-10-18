// src/services/resignationService.js

import axios from 'axios';
import { API_BASE } from '../config/api';

const API_URL = `${API_BASE}/resignations`;

// 获取离职员工列表
export const getResignations = async (page = 1, size = 10, search = {}) => {
    const response = await axios.get(`${API_URL}/search`, {
        params: {
            page,
            size,
            id: search.employeeId,
            name: search.employeeName,
            levelId: search.level,
            departmentId: search.department,
        },
    });
    return response.data;
};

// 获取离职员工详细信息
export const getResignationDetails = async (id) => {
    const response = await axios.get(`${API_URL}/details/${id}`);
    return response.data;
};

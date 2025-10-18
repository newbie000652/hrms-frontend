import axios from 'axios';
import { API_BASE } from '../config/api';

const API_URL = `${API_BASE}/employees`;

const filterParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
};

// 获取员工列表
export const getEmployees = async (page = 1, search = {}, pageSize = 10) => {
  try {
    const filteredParams = filterParams({
      page,
      size: pageSize,
      id: search.employeeId || undefined,
      name: search.employeeName || undefined,
      levelId: search.level || undefined,
      departmentId: search.department || undefined
    });

    const response = await axios.get(`${API_URL}/active/search`, {
      params: filteredParams,
    });

    const data = response.data.data || { records: [], total: 0 };
    
    return {
      records: data.records,
      total: data.total
    };
  } catch (error) {
    console.error('获取员工列表失败:', error);
    return {
      records: [],
      total: 0,
      message: '获取员工列表失败，请稍后重试。',
    };
  }
};

export const addEmployee = async (employee) => {
  try {
    const response = await axios.post(API_URL, employee);
    return response.data;
  } catch (error) {
    console.error('新增员工失败:', error);
    throw error;
  }
};

export const updateEmployee = async (employee) => {
  try {
    const response = await axios.put(`${API_URL}/${employee.id}`, employee);
    return response.data;
  } catch (error) {
    console.error('更新员工信息失败:', error);
    throw error;
  }
};

export const getEmployeeDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/details/${id}`);
    const data = response.data.data || {};
    return {
      success: response.data.success,
      data: data,
    };
  } catch (error) {
    console.error('获取员工详细信息失败:', error);
    return {
      success: false,
      message: '获取员工详细信息失败，请稍后重试。',
    };
  }
};

export const markEmployeeAsInactive = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('标记员工为离职失败:', error);
    throw error;
  }
};

// 元数据：在职/离职员工简单列表（用于映射姓名等）
export const getActiveEmployees = async () => {
  try {
    const res = await axios.get(`${API_URL}/active`);
    const list = (res.data && res.data.data) ? res.data.data : [];
    return list;
  } catch (e) {
    console.warn('获取在职员工列表失败', e);
    return [];
  }
};

export const getInactiveEmployees = async () => {
  try {
    const res = await axios.get(`${API_URL}/inactive`);
    const list = (res.data && res.data.data) ? res.data.data : [];
    return list;
  } catch (e) {
    console.warn('获取离职员工列表失败', e);
    return [];
  }
};

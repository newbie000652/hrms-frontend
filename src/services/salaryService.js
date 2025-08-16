// src/services/salaryService.js 

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/salary';

// 获取工资列表
export const getSalaries = async (page = 1, size = 10, searchBy = '', keyword = '') => {
  const response = await axios.get(API_URL, {
    params: { page, size, searchBy, keyword },
  });
  return response.data;
};

// 新增默认工资记录
export const createDefaultSalary = async (employeeId) => {
  const response = await axios.post(`${API_URL}/create`, null, {
    params: { employeeId },
  });
  return response.data;
};

// 计算工资
export const calculateSalary = async (employeeId) => {
  const response = await axios.post(`${API_URL}/calculate`, null, {
    params: { employeeId },
  });
  return response.data;
};

// 更新工资记录
export const updateSalary = async (salary) => {
  const response = await axios.put(`${API_URL}/${salary.id}`, salary);
  return response.data;
};

// 删除工资记录
export const deleteSalary = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
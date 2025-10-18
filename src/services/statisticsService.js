import axios from 'axios';
import { API_BASE } from '../config/api';

const API_URL = `${API_BASE}/statistics`;

export const getStatistics = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const getPersonalReport = async () => {
  const employeeId = localStorage.getItem('employeeId');  // 获取已存储的 employeeId
  if (!employeeId) {
    throw new Error('无法找到员工ID');
  }

  try {
    const response = await axios.get(`${API_URL}/report/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error('获取个人报表失败');
  }
};

export const getDepartmentReport = async (departmentNameOrId) => {
  // If it's a number-like string, send as departmentId; otherwise send as departmentName
  const asNumber = Number(departmentNameOrId);
  const params = Number.isFinite(asNumber) && String(asNumber) === String(departmentNameOrId)
    ? { departmentId: asNumber }
    : { departmentName: departmentNameOrId };

  const response = await axios.get(`${API_URL}/department`, { params });
  return response.data;
};

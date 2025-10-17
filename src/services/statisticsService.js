import axios from 'axios';

const API_URL = 'http://localhost:8080/api/statistics';

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

export const getDepartmentReport = async (department) => {
  const response = await axios.get(`${API_URL}/department`, {
    params: { department },
  });
  return response.data;
};

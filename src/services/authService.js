// src/services/authService.js
import axios from 'axios';
import { API_BASE } from '../config/api';

// 登录接口，登录时存储 employeeId 和 token
export const login = async (username, password) => {
  try {
  const response = await axios.post(`${API_BASE}/login`, {
      username,
      password,
    });

  const { success, token, employeeId } = response.data;

    if (success) {
      // 登录成功后存储 token 和 employeeId
      localStorage.setItem('employeeId', employeeId);
      localStorage.setItem('authToken', token);  // 如果需要 token 也可以存储
      return {
        success: true,
        data: response.data, // 返回完整的响应数据
      };
    } else {
      return {
        success: false,
        message: '登录失败',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || '登录失败',
    };
  }
};

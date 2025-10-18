// src/services/logService.js
import axios from 'axios';
import { LOGS_BASE } from '../config/api';

// 获取分页日志
export const getLogs = async (page = 1, size = 10) => {
  const response = await axios.get(LOGS_BASE, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

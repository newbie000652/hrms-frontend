// src/services/logService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/logs/api/logs';

// 获取分页日志
export const getLogs = async (page = 1, size = 10) => {
  const response = await axios.get(BASE_URL, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

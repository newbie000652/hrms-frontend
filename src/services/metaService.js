import axios from 'axios';
import { API_BASE } from '../config/api';

export const getLevels = async () => {
  const res = await axios.get(`${API_BASE}/levels`);
  return res.data || [];
};

export const getDepartments = async () => {
  const res = await axios.get(`${API_BASE}/departments`);
  return res.data || [];
};

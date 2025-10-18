// Central API base configuration
// Prefer environment variables; fallback to localhost for dev
// Create .env files with REACT_APP_API_BASE and REACT_APP_LOGS_BASE if needed

export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';
export const LOGS_BASE = process.env.REACT_APP_LOGS_BASE || 'http://localhost:8080/logs/api/logs';

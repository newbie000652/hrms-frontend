import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendance';

export const getAttendanceRecords = async (filter, page = 1, size = 10) => {
    const response = await axios.get(API_URL, {
        params: { ...filter, page, size },
    });
    return response.data;
};

export const getPendingLeaveRequests = async () => {
    const response = await axios.get(`${API_URL}/pendingLeave`);
    return response.data;
};

export const signIn = async (employeeId) => {
    const response = await axios.post(`${API_URL}/signIn`, null, {
        params: { employeeId },
    });
    return response.data;
};

export const signOut = async (employeeId) => {
    const response = await axios.post(`${API_URL}/signOut`, null, {
        params: { employeeId },
    });
    return response.data;
};

export const requestLeave = async (employeeId) => {
    const response = await axios.post(`${API_URL}/requestLeave`, null, {
        params: { employeeId },
    });
    return response.data;
};

export const approveLeave = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/approve`);
    return response.data;
};
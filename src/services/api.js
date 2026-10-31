import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000,
  headers: { Accept: 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error.response?.data;
    error.userMessage = payload?.message || (error.code === 'ECONNABORTED' ? 'The server took too long to respond.' : 'Unable to reach the backend. Check that it is running.');
    error.code = payload?.code || error.code;
    return Promise.reject(error);
  }
);

export const apiErrorMessage = (error) => error?.userMessage || error?.message || 'An unexpected error occurred.';
export default api;

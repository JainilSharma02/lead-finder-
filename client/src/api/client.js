import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lfp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.response?.data?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('lfp_token');
      localStorage.removeItem('lfp_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

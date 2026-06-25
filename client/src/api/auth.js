import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  updateMessageTemplate: (messageTemplate) => api.put('/auth/message-template', { messageTemplate }),
  updateTheme: (theme) => api.put('/auth/theme', { theme }),
};

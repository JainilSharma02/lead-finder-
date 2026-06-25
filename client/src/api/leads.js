import api from './client';

export const leadsApi = {
  search: (data) => api.post('/leads/search', data),
  list: (params) => api.get('/leads', { params }),
  stats: () => api.get('/leads/stats'),
  updateStatus: (id, status) => api.put(`/leads/${id}/status`, { status }),
  bulkUpdateStatus: (ids, status) => api.put('/leads/bulk-status', { ids, status }),
  delete: (id) => api.delete(`/leads/${id}`),
  searchHistory: () => api.get('/leads/searches'),
  exportCsvUrl: (ids) => `/api/leads/export/csv${ids?.length ? `?ids=${ids.join(',')}` : ''}`,
  exportExcelUrl: (ids) => `/api/leads/export/excel${ids?.length ? `?ids=${ids.join(',')}` : ''}`,
};

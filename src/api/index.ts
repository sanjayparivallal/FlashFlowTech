import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const tripsApi = {
  compare: (data: { source: string; destination: string; distance_km: number }) => 
    api.post('/trips/compare', data),
  select: (trip: any) => 
    api.post('/trips/select', trip),
  getHistory: () => 
    api.get('/trips/history'),
};

export const dashboardApi = {
  getStats: () => 
    api.get('/dashboard/stats'),
};

export const profileApi = {
  getMe: () => 
    api.get('/profile/me'),
  update: (data: { name: string }) => 
    api.put('/profile/update', data),
};

export default api;

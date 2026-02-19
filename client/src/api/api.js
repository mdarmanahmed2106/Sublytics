import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Auth ----
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ---- Subscriptions ----
export const getSubscriptions = (params) => API.get('/subscriptions', { params });
export const getSubscription = (id) => API.get(`/subscriptions/${id}`);
export const createSubscription = (data) => API.post('/subscriptions', data);
export const updateSubscription = (id, data) => API.put(`/subscriptions/${id}`, data);
export const deleteSubscription = (id) => API.delete(`/subscriptions/${id}`);

// ---- Analytics ----
export const getAnalyticsSummary = () => API.get('/analytics/summary');
export const getAnalyticsByCategory = () => API.get('/analytics/by-category');
export const getAnalyticsTrend = (months) => API.get('/analytics/trend', { params: { months } });
export const getAnalyticsInsights = () => API.get('/analytics/insights');

// ---- Activity ----
export const getActivityFeed = (params) => API.get('/activity', { params });

export default API;

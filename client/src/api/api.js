import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    withCredentials: true, // Send cookies with every request
});

// ── In-memory access token (never stored in localStorage) ──
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;
export const clearAccessToken = () => { accessToken = null; };

// ── Request interceptor: attach access token ──
API.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// ── Response interceptor: auto-refresh on 401 ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (token) prom.resolve(token);
        else prom.reject(error);
    });
    failedQueue = [];
};

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't retry refresh or login requests
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh') &&
            !originalRequest.url.includes('/auth/login')
        ) {
            if (isRefreshing) {
                // Queue requests while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return API(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await API.post('/auth/refresh');
                const newToken = data.data.accessToken;
                setAccessToken(newToken);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearAccessToken();
                // Redirect to login on refresh failure
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ---- Auth ----
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const refreshSession = () => API.post('/auth/refresh');
export const logoutUser = () => API.post('/auth/logout');

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

// ---- Intelligence ----
export const getHealthScore = () => API.get('/analytics/health-score');
export const getSmartInsights = () => API.get('/analytics/smart-insights');
export const getSpendingSpike = () => API.get('/analytics/spending-spike');
export const simulateCancellation = (subscriptionId) => API.post('/analytics/simulate-cancel', { subscriptionId });
export const markSubscriptionUsed = (id) => API.patch(`/subscriptions/${id}/mark-used`);

// ---- Activity ----
export const getActivityFeed = (params) => API.get('/activity', { params });

export default API;

import { create } from 'zustand';
import { api } from '../api/axios';

let refreshTimer;

const clearSession = (set) => {
  window.clearTimeout(refreshTimer);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  set({ admin: null, isAuthenticated: false, isLoading: false });
};

const getRefreshDelay = (accessToken) => {
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return Math.max(30_000, payload.exp * 1000 - Date.now() - 60_000);
  } catch {
    return 12 * 60 * 1000;
  }
};

export const useAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ admin: res.data.admin || res.data, isAuthenticated: true, isLoading: false });
      useAuthStore.getState().scheduleRefresh();
    } catch {
      clearSession(set);
    }
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
    }
    if (res.data?.refreshToken) {
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
    await useAuthStore.getState().checkAuth();
    return res.data;
  },

  refreshSession: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');
    const res = await api.post('/auth/refresh', { refreshToken }, { headers: { Authorization: `Bearer ${refreshToken}` } });
    if (res.data?.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
    if (res.data?.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
    await useAuthStore.getState().checkAuth();
  },

  scheduleRefresh: () => {
    window.clearTimeout(refreshTimer);
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    refreshTimer = window.setTimeout(async () => {
      try {
        await useAuthStore.getState().refreshSession();
      } catch {
        clearSession(set);
      }
    }, getRefreshDelay(token));
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      clearSession(set);
    }
  },
}));

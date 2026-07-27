import { create } from 'zustand';
import { api } from '../api/axios';

export const useAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ admin: res.data.admin || res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ admin: null, isAuthenticated: false, isLoading: false });
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

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ admin: null, isAuthenticated: false });
    }
  },
}));

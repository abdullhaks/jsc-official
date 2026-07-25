import { create } from 'zustand';
import { api } from '../api/axios';

export const useAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ admin: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    await useAuthStore.getState().checkAuth();
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      set({ admin: null, isAuthenticated: false });
    }
  }
}));

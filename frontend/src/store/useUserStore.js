import { create } from 'zustand';
import api from '@/lib/api';

export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/user/all');
      set({ users: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/user/info/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (id, userData) => {
    set({ isLoading: true });
    try {
      await api.put(`/api/user/update/${id}`, userData);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/api/user/delete/${id}`);
      get().fetchUsers();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

import { create } from 'zustand';
import api from '@/lib/api';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/category/all');
      set({ categories: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/api/category/info/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true });
    try {
      await api.post('/api/category/create', categoryData);
      get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true });
    try {
      await api.put(`/api/category/update/${id}`, categoryData);
      get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/api/category/delete/${id}`);
      get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

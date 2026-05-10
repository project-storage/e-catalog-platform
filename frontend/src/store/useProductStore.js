import { create } from 'zustand';
import api from '@/lib/api';

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/product/all');
      set({ products: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/product/info/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      await api.post('/api/product/create', productData);
      get().fetchProducts();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    try {
      await api.put(`/api/product/update/${id}`, productData);
      get().fetchProducts();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/api/product/delete/${id}`);
      get().fetchProducts();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

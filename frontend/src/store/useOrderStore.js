import { create } from 'zustand';
import api from '@/lib/api';

export const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrdersByStatus: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/order/search?status=${status}`);
      set({ orders: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrdersBySaleAndStatus: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const url = status 
        ? `/api/order/search/sale/status?status=${status}`
        : `/api/order/search/sale/status`;
      const response = await api.get(url);
      set({ orders: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/order/info/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      await api.put(`/api/order/update/${id}`, { status });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

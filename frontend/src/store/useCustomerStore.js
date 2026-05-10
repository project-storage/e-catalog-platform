import { create } from 'zustand';
import api from '@/lib/api';

export const useCustomerStore = create((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/customer/all');
      set({ customers: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCustomersBySale: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/customer/sale');
      set({ customers: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/api/customer/info/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    set({ isLoading: true });
    try {
      await api.post('/api/customer/create', customerData);
      // Depending on the role, we might want to fetch different sets
      // But usually get().fetchCustomers() is fine if the backend filters by sale
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ isLoading: true });
    try {
      await api.put(`/api/customer/update/${id}`, customerData);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/api/customer/delete/${id}`);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

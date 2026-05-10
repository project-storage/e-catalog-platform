import { create } from 'zustand';
import api from '@/lib/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data.data;
      
      // The backend returns user: { _id, full_name, email, tel, role }
      // We might need to split full_name if the UI expects firstName/lastName
      // Or just adapt the UI. Let's adapt the user object here to keep UI working
      const nameParts = userData.full_name.split(' ');
      const user = {
        ...userData,
        firstName: nameParts[1] || userData.full_name,
        lastName: nameParts.slice(2).join(' ') || ''
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/api/auth/register', registerData);
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));

import axios from 'axios';

const api = axios.create({
  // baseURL: "https://e-cattalog-backend.onrender.com/",
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle responses (e.g., global error handling)
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized - maybe logout or redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // We could trigger a redirect here if we had access to router, 
    // but usually it's better to let the store or a component handle it.
  }
  return Promise.reject(error);
});

export default api;

import axios from 'axios';

// API URL - use environment variable or default to localhost
// In Docker, this should be set to http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for httpOnly cookies
});

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
      
      // Only call logout API if not already on auth pages (to avoid unnecessary API calls)
      if (!isAuthPage) {
        // Clear auth state
        try {
          const authStore = await import('../store/authStore');
          authStore.useAuthStore.getState().logout();
        } catch (err) {
          // Ignore errors during logout
        }
        
        // Redirect to login on unauthorized
        window.location.href = '/login';
      } else {
        // On auth pages, just clear the user state without API call
        try {
          const authStore = await import('../store/authStore');
          authStore.useAuthStore.getState().setUser(null);
        } catch (err) {
          // Ignore errors
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

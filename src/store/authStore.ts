import { create } from 'zustand';
import api from '../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  fetching: boolean; // Track if fetchUser is in progress
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  fetching: false,

  setLoading: (loading: boolean) => set({ loading }),

  setUser: (user: User | null) => set({ user }),

  fetchUser: async () => {
    // Prevent multiple simultaneous calls
    if (get().fetching) {
      return;
    }

    try {
      set({ loading: true, fetching: true });
      const response = await api.get('/auth/me');
      set({
        user: response.data,
        loading: false,
        initialized: true,
        fetching: false,
      });
    } catch {
      set({ user: null, loading: false, initialized: true, fetching: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      await api.post('/auth/login', { email, password });
      // Token is now in httpOnly cookie, fetch user data
      await useAuthStore.getState().fetchUser();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ loading: true });
    try {
      await api.post('/auth/register', { name, email, password });
      // Token is now in httpOnly cookie, fetch user data
      await useAuthStore.getState().fetchUser();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue with logout even if API call fails
    } finally {
      set({ user: null, loading: false, initialized: true });
    }
  },
}));

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => {
    AsyncStorage.setItem('nb_token', token);
    AsyncStorage.setItem('nb_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    AsyncStorage.removeItem('nb_token');
    AsyncStorage.removeItem('nb_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    const token = await AsyncStorage.getItem('nb_token');
    const userStr = await AsyncStorage.getItem('nb_user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true });
    }
  },
}));

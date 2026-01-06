import api from '@/lib/axios';
import { LoginResponse, RegisterResponse, User } from '@/types';

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post<RegisterResponse>('/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post<LoginResponse>('/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get<{ user: User }>('/api/v1/users/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  isAuthenticated() {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }
};

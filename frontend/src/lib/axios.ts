import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // เชื่อมต่อกับ Backend Go ที่ Port 8080
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

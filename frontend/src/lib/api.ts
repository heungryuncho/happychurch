import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// We assume the backend is running on localhost:8000
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const getBaseUrl = () => {
  return API_URL.replace('/api/v1', '');
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure base API client with Interceptor to append tokens
api.interceptors.request.use(
  (config) => {
    // Attempt to retrieve token from zustand store
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We'll also use this axios instance for multipart/form-data specifically 
// when uploading bulletins or gallery images.
export const apiForm = axios.create({
  baseURL: API_URL,
});

apiForm.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set the boundary for multipart forms
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

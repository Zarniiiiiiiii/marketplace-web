import axios from 'axios';

const resolvedBaseUrl = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({
  baseURL: resolvedBaseUrl
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
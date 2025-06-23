import axios from 'axios';

// Create an axios instance for API calls. The token for authenticated
// requests is retrieved from localStorage and attached to each request.

const instance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;

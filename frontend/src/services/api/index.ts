import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const storedAuth = sessionStorage.getItem('lavandariapro_auth');

  if (storedAuth) {
    const authData = JSON.parse(storedAuth);

    config.headers.Authorization = `Bearer ${authData.access_token}`;
  }

  return config;
});

export default api;
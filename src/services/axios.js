import axios from 'axios';
import { parseCookies } from 'nookies';

export function getAPIClient(ctx) {
  const { 'next.token': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://fiap-reactjs-presencial.herokuapp.com',
  });

  api.interceptors.request.use((config) => {
    return config;
  });

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}

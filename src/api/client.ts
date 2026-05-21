import axios, { AxiosError } from 'axios';

const STORAGE_TOKEN_KEY = 'mi-boleta-token';
const STORAGE_USER_KEY = 'mi-boleta-user';

const apiClient = axios.create({
  baseURL: 'https://mi-boleta-api-y9dv.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

function clearSessionAndRedirect() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  window.location.assign('/login');
}

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<{ error?: string }>) => {
    if (error.response?.status === 401) {
      clearSessionAndRedirect();
    }
    return Promise.reject(error);
  }
);

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(token: string, user: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  setAuthToken(token);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  setAuthToken(null);
}

export default apiClient;

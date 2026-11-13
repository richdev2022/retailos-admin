import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from './types';
import { useAuthStore } from '../stores/auth-store';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
export const API_BASE = `${API_URL}/api/v1`;
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, status = 0, code = 'UNKNOWN') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/admin`,
  timeout: 30_000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    const data = error.response?.data as { message?: string; code?: string } | undefined;
    const message = data?.message ?? error.message ?? 'Request failed';
    return Promise.reject(new ApiError(message, error.response?.status ?? 0, data?.code ?? 'UNKNOWN'));
  },
);

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  if (USE_MOCK) throw new ApiError('Mock mode: not implemented for this endpoint', 0, 'MOCK_NOT_IMPLEMENTED');
  const res = await instance.request<ApiResponse<T>>(config);
  return res.data.data;
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) => request<T>({ method: 'GET', url, params }),
  post: <T>(url: string, data?: unknown) => request<T>({ method: 'POST', url, data }),
  patch: <T>(url: string, data?: unknown) => request<T>({ method: 'PATCH', url, data }),
  put: <T>(url: string, data?: unknown) => request<T>({ method: 'PUT', url, data }),
  delete: <T>(url: string) => request<T>({ method: 'DELETE', url }),
};

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getHostIp } from './ipdetector';

// Connect directly to the backend (running on port 8081)
// Kong gateway (port 8000) is only used when services run inside Docker.
const hostIp = getHostIp();
const BASE_URL = `http://${hostIp}:8000`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('nb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ───────────────────────────────────────────────
export const authApi = {
  login: (fullName: string, qrCode: string) =>
    api.post('/api/accounts/auth/login', { fullName, qrCode }),

  verifyOtp: (identifier: string, code: string) =>
    api.post('/api/accounts/auth/verify-otp', { identifier, code }),
  uploadQr: (formData: FormData) =>
    api.post('/api/accounts/auth/upload-qr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ─── ACCOUNTS ───────────────────────────────────────────
export const accountsApi = {
  getMe: () => api.get('/api/accounts/users/me'),
  updateMe: (data: { fullName?: string; phone?: string }) =>
    api.patch('/api/accounts/users/me', data),
  getAccounts: () => api.get('/api/accounts'),
  getAccount: (accountNumber: string) => api.get(`/api/accounts/${accountNumber}`),
  openAccount: (accountType: string) =>
    api.post('/api/accounts/open', { type: accountType }),
};

// ─── TRANSACTIONS ────────────────────────────────────────
export const transactionsApi = {
  createDeposit: (accountId: number, amount: number) =>
    api.post('/api/transactions/deposit/stripe', { accountId, amount }),
  getMyDeposits: () => api.get('/api/transactions/deposits/my'),
  transfer: (data: {
    fromAccountId: number;
    toAccountNumber: string;
    amount: number;
    description?: string;
  }) => api.post('/api/transactions/transfer', data),
  getMyTransactions: () => api.get('/api/transactions/my'),
  withdraw: (data: {
    accountId: number;
    amount: number;
    provider: 'ORANGE_MONEY' | 'MTN_MOMO';
    mobileNumber: string;
  }) => api.post('/api/transactions/withdraw', data),
  getMyWithdrawals: () => api.get('/api/transactions/withdrawals/my'),
};

// ─── CARDS ───────────────────────────────────────────────
export const cardsApi = {
  getMyCards: () => api.get('/api/cards/my'),
  getCard: (id: number) => api.get(`/api/cards/${id}`),
  requestCard: (accountId: number) =>
    api.post('/api/cards/request', { accountId }),
  freezeCard: (id: number) => api.patch(`/api/cards/${id}/freeze`),
};

// ─── NOTIFICATIONS ───────────────────────────────────────
export const notificationsApi = {
  getMyNotifications: () => api.get('/api/notifications/my'),
  getUnreadCount: () => api.get('/api/notifications/my/unread-count'),
  markRead: (id: number) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.patch('/api/notifications/read-all'),
};

export default api;

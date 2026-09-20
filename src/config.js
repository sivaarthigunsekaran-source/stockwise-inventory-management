export const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  products: '/api/products',
  transactions: '/api/stock-transactions',
  addStock: (id) => `/api/products/${id}/add-stock`,
  reduceStock: (id) => `/api/products/${id}/reduce-stock`,
};

export const CURRENCY = {
  code: 'USD',
  locale: 'en-US',
};
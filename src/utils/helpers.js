import { CURRENCY } from '../config';

export const formatCurrency = (value) => {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
  }).format(Number(value) || 0);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat(CURRENCY.locale).format(
    Number(value) || 0
  );
};

export const formatDate = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
};

export const isLowStock = (product) => {
  return Number(product.currentStock) <= Number(product.reorderLevel);
};

export const getStockStatus = (product) => {
  if (Number(product.currentStock) <= 0) {
    return {
      key: 'out',
      label: 'Out of stock',
    };
  }

  if (isLowStock(product)) {
    return {
      key: 'low',
      label: 'Low stock',
    };
  }

  return {
    key: 'ok',
    label: 'In stock',
  };
};

export const calculateStats = (products, transactions = []) => {
  return {
    totalProducts: products.length,

    totalStock: products.reduce(
      (sum, product) =>
        sum + Number(product.currentStock || 0),
      0
    ),

    inventoryValue: products.reduce(
      (sum, product) =>
        sum +
        Number(product.currentStock || 0) *
          Number(product.unitCost || 0),
      0
    ),

    lowStockCount: products.filter(isLowStock).length,

    totalTransactions: transactions.length,
  };
};
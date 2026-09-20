import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import StockModal from './components/StockModal';
import Toast from './components/Toast';
import Icon from './components/Icon';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import { changeStock, createProduct, getProducts, getTransactions } from './services/api';
import { calculateStats } from './utils/helpers';

const PAGE_INFO = {
  dashboard: { title: 'Dashboard', subtitle: 'Your inventory at a glance' },
  products: { title: 'Products', subtitle: 'Manage your product catalog and stock levels' },
  inventory: { title: 'Inventory', subtitle: 'Monitor stock health and reorder levels' },
  transactions: { title: 'Transactions', subtitle: 'History of stock in and stock out movements' },
};

export default function App() {
  // Navigation
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data from the Spring Boot API
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsAvailable, setTransactionsAvailable] = useState(false);
  const [sessionLog, setSessionLog] = useState([]); // used only if the transactions API is unavailable
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // UI state
  const [showProductForm, setShowProductForm] = useState(false);
  const [stockAction, setStockAction] = useState(null); // { product, type }
  const [toast, setToast] = useState(null);

  /* ---------------- Loading data ---------------- */

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const productList = await getProducts();
      setProducts(productList);

      // Transactions are optional: if the endpoint is missing we fall back to the session log.
      try {
        setTransactions(await getTransactions(productList));
        setTransactionsAvailable(true);
      } catch {
        setTransactions([]);
        setTransactionsAvailable(false);
      }
    } catch (error) {
      setLoadError(
        `Could not load products from the Spring Boot server (${error.message}). ` +
          'Make sure the backend is running on http://localhost:8080, then click Retry.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-hide toast notifications
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ---------------- Actions ---------------- */

  const showToast = (message, type = 'success') => setToast({ message, type });

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleCreateProduct = async (form) => {
    await createProduct(form);
    setShowProductForm(false);
    showToast(`"${form.name.trim()}" was added to your inventory`);
    await loadData();
  };

  const handleStockSubmit = async (quantity) => {
    const { product, type } = stockAction;
    await changeStock(product, type, quantity);

    setSessionLog((prev) => [
      {
        id: `session-${Date.now()}`,
        productName: product.name,
        type,
        quantity,
        date: new Date(),
        note: 'Recorded this session',
      },
      ...prev,
    ]);

    setStockAction(null);
    showToast(
      type === 'IN'
        ? `Added ${quantity} unit(s) to ${product.name}`
        : `Removed ${quantity} unit(s) from ${product.name}`
    );
    await loadData();
  };

  const openAddStock = (product) => setStockAction({ product, type: 'IN' });
  const openReduceStock = (product) => setStockAction({ product, type: 'OUT' });

  /* ---------------- Derived values ---------------- */

  const stats = useMemo(() => calculateStats(products), [products]);
  const displayedTransactions = transactionsAvailable ? transactions : sessionLog;
  const usingSessionLog = !transactionsAvailable;
  const showInitialLoader = loading && products.length === 0 && !loadError;
  const showPage = !showInitialLoader && !(loadError && products.length === 0);

  const renderPage = () => {
    switch (activePage) {
      case 'products':
        return (
          <Products
            products={products}
            onAddProduct={() => setShowProductForm(true)}
            onAddStock={openAddStock}
            onReduceStock={openReduceStock}
          />
        );
      case 'inventory':
        return (
          <Inventory
            products={products}
            stats={stats}
            onAddStock={openAddStock}
            onReduceStock={openReduceStock}
          />
        );
      case 'transactions':
        return <Transactions transactions={displayedTransactions} usingSessionLog={usingSessionLog} />;
      default:
        return (
          <Dashboard
            products={products}
            transactions={displayedTransactions}
            stats={stats}
            usingSessionLog={usingSessionLog}
            onNavigate={navigate}
            onAddStock={openAddStock}
          />
        );
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        lowStockCount={stats.lowStockCount}
      />

      <div className="main">
        <Header
          title={PAGE_INFO[activePage].title}
          subtitle={PAGE_INFO[activePage].subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onRefresh={loadData}
          refreshing={loading}
        />

        <main className="content">
          {loadError && (
            <div className="alert alert-error">
              <Icon name="alert" size={20} />
              <div className="alert-text">
                <strong>Unable to connect to the backend</strong>
                <p>{loadError}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={loadData}>
                Retry
              </button>
            </div>
          )}

          {showInitialLoader && (
            <div className="loader">
              <div className="spinner" />
              <p>Loading inventory…</p>
            </div>
          )}

          {showPage && renderPage()}
        </main>
      </div>

      {showProductForm && (
        <ProductForm onSubmit={handleCreateProduct} onClose={() => setShowProductForm(false)} />
      )}

      {stockAction && (
        <StockModal
          product={stockAction.product}
          type={stockAction.type}
          onSubmit={handleStockSubmit}
          onClose={() => setStockAction(null)}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
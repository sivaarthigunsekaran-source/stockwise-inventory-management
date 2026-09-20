import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import TransactionList from '../components/TransactionList';
import {
  formatCurrency,
  formatNumber,
  getStockStatus,
} from '../utils/helpers';

export default function Dashboard({
  products,
  transactions,
  stats,
  usingSessionLog,
  onNavigate,
  onAddStock,
}) {
  const lowStockProducts = products
    .filter((product) => {
      const status = getStockStatus(product);
      return status.key === 'low' || status.key === 'out';
    })
    .slice(0, 5);

  return (
    <>
      <div className="stats-grid">
        <StatCard
          label="Products"
          value={stats.totalProducts}
          hint="Catalog items"
          icon="box"
          tone="blue"
        />

        <StatCard
          label="Units in stock"
          value={formatNumber(stats.totalStock)}
          hint="Across all products"
          icon="inventory"
          tone="green"
        />

        <StatCard
          label="Inventory value"
          value={formatCurrency(stats.inventoryValue)}
          hint="Current stock value"
          icon="dashboard"
          tone="purple"
        />

        <StatCard
          label="Low stock"
          value={stats.lowStockCount}
          hint="Need attention"
          icon="alert"
          tone="red"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3>Low stock</h3>

              <p className="card-subtitle">
                Products that need replenishing
              </p>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() => onNavigate('inventory')}
            >
              View inventory
            </button>
          </div>

          {lowStockProducts.length ? (
            lowStockProducts.map((product) => (
              <div
                className="low-item"
                key={product.id ?? product.name}
              >
                <div className="low-info">
                  <div className="low-name">
                    {product.name}
                  </div>

                  <div className="low-meta">
                    Minimum: {formatNumber(product.reorderLevel)} units
                  </div>
                </div>

                <div className="low-stock">
                  <span className="low-count">
                    {formatNumber(product.currentStock)}
                  </span>

                  <span className="low-unit">
                    in stock
                  </span>
                </div>

                <button
                  className="btn btn-success btn-sm"
                  type="button"
                  onClick={() => onAddStock(product)}
                >
                  Add
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              title="All stocked up"
              message="No products need attention right now."
            />
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3>Recent transactions</h3>

              <p className="card-subtitle">
                Latest stock movements
              </p>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() => onNavigate('transactions')}
            >
              View all
            </button>
          </div>

          {transactions.length ? (
            <TransactionList
              transactions={transactions}
              limit={5}
            />
          ) : (
            <EmptyState
              title="No transactions yet"
              message={
                usingSessionLog
                  ? 'Stock movements will appear here.'
                  : 'No stock movements have been recorded.'
              }
              icon="transactions"
            />
          )}
        </section>
      </div>
    </>
  );
}
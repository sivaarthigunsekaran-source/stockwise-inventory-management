import { useState } from 'react';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import {
  formatCurrency,
  formatNumber,
  getStockStatus,
  isLowStock,
} from '../utils/helpers';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'low', label: 'Low Stock' },
  { id: 'healthy', label: 'Healthy' },
];

function StockCard({
  product,
  onAddStock,
  onReduceStock,
}) {
  const status = getStockStatus(product);

  const currentStock = Number(product.currentStock || 0);
  const reorderLevel = Number(product.reorderLevel || 0);
  const unitCost = Number(product.unitCost || 0);

  const capacity = Math.max(
    reorderLevel * 3,
    currentStock,
    1
  );

  const fill = Math.min(
    100,
    (currentStock / capacity) * 100
  );

  const marker = Math.min(
    100,
    (reorderLevel / capacity) * 100
  );

  return (
    <div className="stock-card">
      <div className="stock-card-top">
        <div>
          <p className="product-name">
            {product.name}
          </p>

          <code className="sku">
            {product.sku}
          </code>
        </div>

        <StatusBadge product={product} />
      </div>

      <div className="stock-numbers">
        <div>
          <span className="stock-big">
            {formatNumber(currentStock)}
          </span>

          <span className="text-muted">
            {' '}units
          </span>
        </div>

        <div className="text-muted stock-value">
          Value{' '}
          {formatCurrency(
            currentStock * unitCost
          )}
        </div>
      </div>

      <div
        className="stock-bar"
        title={`Reorder level: ${reorderLevel}`}
      >
        <div
          className={`stock-bar-fill fill-${status.key}`}
          style={{
            width: `${fill}%`,
          }}
        />

        {reorderLevel > 0 && (
          <div
            className="stock-bar-marker"
            style={{
              left: `${marker}%`,
            }}
          />
        )}
      </div>

      <p className="stock-bar-label">
        Reorder level:{' '}
        {formatNumber(reorderLevel)}
      </p>

      <div className="stock-card-actions">
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={() => onAddStock(product)}
        >
          <Icon name="plus" size={14} />
          Add Stock
        </button>

        <button
          type="button"
          className="btn btn-sm btn-danger-outline"
          onClick={() => onReduceStock(product)}
          disabled={currentStock <= 0}
        >
          <Icon name="minus" size={14} />
          Reduce
        </button>
      </div>
    </div>
  );
}

export default function Inventory({
  products,
  stats,
  onAddStock,
  onReduceStock,
}) {
  const [filter, setFilter] = useState('all');

  const visible = products.filter((product) => {
    if (filter === 'low') {
      return isLowStock(product);
    }

    if (filter === 'healthy') {
      return !isLowStock(product);
    }

    return true;
  });

  return (
    <div className="page-stack">
      {stats.lowStockCount > 0 && (
        <div className="alert alert-warning">
          <Icon name="alert" size={20} />

          <div>
            <strong>
              {stats.lowStockCount}{' '}
              {stats.lowStockCount === 1
                ? 'item needs'
                : 'items need'}{' '}
              attention
            </strong>

            <p>
              Some products are at or below their reorder level.
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Inventory Overview</h3>

            <p className="card-subtitle">
              Monitor stock levels and reorder points
            </p>
          </div>

          <div className="filter-tabs">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  filter === item.id
                    ? 'filter-tab active'
                    : 'filter-tab'
                }
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon="box"
            title="No inventory yet"
            message="Add products to start monitoring your inventory."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="search"
            title="No products in this filter"
            message="Try another inventory filter."
          />
        ) : (
          <div className="stock-grid">
            {visible.map((product, index) => (
              <StockCard
                key={product.id ?? index}
                product={product}
                onAddStock={onAddStock}
                onReduceStock={onReduceStock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import Icon from './Icon';
import StatusBadge from './StatusBadge';
import {
  formatCurrency,
  formatNumber,
  isLowStock,
} from '../utils/helpers';

export default function ProductTable({
  products,
  onAddStock,
  onReduceStock,
}) {
  return (
    <div className="table-wrapper">
      <table className="data-table responsive-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th className="num">Unit Cost</th>
            <th className="num">Current Stock</th>
            <th className="num">Reorder Level</th>
            <th>Status</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id ?? index}
              className={isLowStock(product) ? 'row-low' : ''}
            >
              <td data-label="Product">
                <div className="product-cell">
                  <span className="product-avatar">
                    {product.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="product-name">
                    {product.name}
                  </span>
                </div>
              </td>

              <td data-label="SKU">
                <code className="sku">{product.sku}</code>
              </td>

              <td data-label="Unit Cost" className="num">
                {formatCurrency(product.unitCost)}
              </td>

              <td data-label="Current Stock" className="num">
                <strong>{formatNumber(product.currentStock)}</strong>
              </td>

              <td data-label="Reorder Level" className="num">
                {formatNumber(product.reorderLevel)}
              </td>

              <td data-label="Status">
                <StatusBadge product={product} />
              </td>

              <td data-label="Actions" className="actions-col">
                <div className="action-buttons">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => onAddStock(product)}
                  >
                    <Icon name="plus" size={14} />
                    Add
                  </button>

                  <button
                    className="btn btn-sm btn-danger-outline"
                    onClick={() => onReduceStock(product)}
                    disabled={product.currentStock <= 0}
                  >
                    <Icon name="minus" size={14} />
                    Reduce
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
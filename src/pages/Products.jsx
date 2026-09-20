import { useState } from 'react';
import Icon from '../components/Icon';
import ProductTable from '../components/ProductTable';
import EmptyState from '../components/EmptyState';

export default function Products({
  products,
  onAddProduct,
  onAddStock,
  onReduceStock,
}) {
  const [search, setSearch] = useState('');

  const term = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const productName = String(product.name || '').toLowerCase();
    const productSku = String(product.sku || '').toLowerCase();

    return (
      productName.includes(term) ||
      productSku.includes(term)
    );
  });

  return (
    <div className="page-stack">
      <div className="card">
        <div className="card-header">
          <div>
            <h3>All Products</h3>

            <p className="card-subtitle">
              {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddProduct}
          >
            <Icon name="plus" size={16} />
            Add Product
          </button>
        </div>

        <div className="card-toolbar">
          <div className="search-box">
            <Icon name="search" size={18} />

            <input
              type="text"
              className="input"
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon="box"
            title="No products yet"
            message="Add your first product to start tracking inventory."
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={onAddProduct}
              >
                <Icon name="plus" size={16} />
                Add Product
              </button>
            }
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon="search"
            title="No matching products"
            message="Try a different product name or SKU."
          />
        ) : (
          <ProductTable
            products={filteredProducts}
            onAddStock={onAddStock}
            onReduceStock={onReduceStock}
          />
        )}
      </div>
    </div>
  );
}
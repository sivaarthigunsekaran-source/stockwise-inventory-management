import { useState } from 'react';
import Modal from './Modal';

export default function StockModal({ product, type, onSubmit, onClose }) {
  const [quantity, setQuantity] = useState('');
  const isAdding = type === 'IN';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(quantity);
    if (amount > 0) await onSubmit(amount);
  };

  return (
    <Modal title={isAdding ? 'Add stock' : 'Reduce stock'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="stock-summary">
          <div className="stock-summary-name">{product.name}</div>
          <div className="stock-preview">Current stock: {product.quantity ?? 0} unit(s)</div>
        </div>
        <label className="field">
          <span className="field-label">Quantity</span>
          <input className="input" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} autoFocus required />
        </label>
        <div className="modal-footer">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className={`btn ${isAdding ? 'btn-success' : 'btn-danger'}`} type="submit">{isAdding ? 'Add stock' : 'Reduce stock'}</button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import Modal from './Modal';

const EMPTY_FORM = {
  name: '',
  sku: '',
  unitCost: '',
  currentStock: '',
  reorderLevel: '',
};

const isWholeNumber = (value) =>
  value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0;

export default function ProductForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    if (!form.sku.trim()) next.sku = 'SKU is required';
    if (form.unitCost === '' || Number(form.unitCost) < 0) {
      next.unitCost = 'Enter a valid unit cost';
    }
    if (!isWholeNumber(form.currentStock)) {
      next.currentStock = 'Enter a whole number (0 or more)';
    }
    if (!isWholeNumber(form.reorderLevel)) {
      next.reorderLevel = 'Enter a whole number (0 or more)';
    }
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit(form); // the parent closes the modal on success
    } catch (error) {
      setServerError(error.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add New Product" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body">
          {serverError && <div className="alert alert-error">{serverError}</div>}

          <div className="form-grid">
            <label className="field full">
              <span className="field-label">Product Name</span>
              <input
                className={`input ${errors.name ? 'has-error' : ''}`}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Mouse"
                autoFocus
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label className="field">
              <span className="field-label">SKU</span>
              <input
                className={`input ${errors.sku ? 'has-error' : ''}`}
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. WM-1001"
              />
              {errors.sku && <span className="field-error">{errors.sku}</span>}
            </label>

            <label className="field">
              <span className="field-label">Unit Cost</span>
              <input
                className={`input ${errors.unitCost ? 'has-error' : ''}`}
                type="number"
                name="unitCost"
                min="0"
                step="0.01"
                value={form.unitCost}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.unitCost && <span className="field-error">{errors.unitCost}</span>}
            </label>

            <label className="field">
              <span className="field-label">Current Stock</span>
              <input
                className={`input ${errors.currentStock ? 'has-error' : ''}`}
                type="number"
                name="currentStock"
                min="0"
                step="1"
                value={form.currentStock}
                onChange={handleChange}
                placeholder="0"
              />
              {errors.currentStock && <span className="field-error">{errors.currentStock}</span>}
            </label>

            <label className="field">
              <span className="field-label">Reorder Level</span>
              <input
                className={`input ${errors.reorderLevel ? 'has-error' : ''}`}
                type="number"
                name="reorderLevel"
                min="0"
                step="1"
                value={form.reorderLevel}
                onChange={handleChange}
                placeholder="10"
              />
              {errors.reorderLevel && <span className="field-error">{errors.reorderLevel}</span>}
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
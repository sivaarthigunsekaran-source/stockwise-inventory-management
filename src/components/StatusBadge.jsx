import { getStockStatus } from '../utils/helpers';

export default function StatusBadge({ product }) {
  const status = getStockStatus(product);

  return (
    <span className={`badge badge-${status.key}`}>
      {status.label}
    </span>
  );
}
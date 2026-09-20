import Icon from './Icon';
import EmptyState from './EmptyState';
import {
  formatDate,
  formatNumber,
} from '../utils/helpers';

export default function TransactionList({
  transactions,
  limit,
}) {
  const items = limit
    ? transactions.slice(0, limit)
    : transactions;

  if (items.length === 0) {
    return (
      <EmptyState
        icon="repeat"
        title="No transactions yet"
        message="Stock in and stock out activity will appear here."
      />
    );
  }

  return (
    <ul className="txn-list">
      {items.map((txn, index) => {
        const isIn = txn.type === 'IN';

        return (
          <li
            key={`${txn.id}-${index}`}
            className="txn-item"
          >
            <div
              className={`txn-icon ${
                isIn ? 'in' : 'out'
              }`}
            >
              <Icon
                name={isIn ? 'arrowIn' : 'arrowOut'}
                size={18}
              />
            </div>

            <div className="txn-info">
              <p className="txn-product">
                {txn.productName}
              </p>

              <p className="txn-meta">
                {isIn ? 'Stock In' : 'Stock Out'} •{' '}
                {formatDate(txn.date)}
              </p>
            </div>

            <div
              className={`txn-qty ${
                isIn ? 'in' : 'out'
              }`}
            >
              {isIn ? '+' : '−'}
              {formatNumber(txn.quantity)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
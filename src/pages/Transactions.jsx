import EmptyState from '../components/EmptyState';
import TransactionList from '../components/TransactionList';

export default function Transactions({ transactions, usingSessionLog }) {
  return (
    <section className="card"><div className="card-header"><div><h3>Transaction history</h3><p className="card-subtitle">Every stock movement in one place</p></div>{usingSessionLog && <span className="badge badge-low">Current session</span>}</div>{transactions.length ? <TransactionList transactions={transactions} /> : <EmptyState title="No transactions yet" message="Stock movements will appear here once recorded." icon="transactions" />}</section>
  );
}

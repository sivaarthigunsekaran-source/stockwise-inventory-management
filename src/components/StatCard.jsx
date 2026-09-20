import Icon from './Icon';

export default function StatCard({ label, value, hint, icon, tone = 'blue' }) {
  return (
    <section className="stat-card">
      <div className={`stat-icon tone-${tone}`}><Icon name={icon} size={22} /></div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {hint && <div className="stat-hint">{hint}</div>}
      </div>
    </section>
  );
}

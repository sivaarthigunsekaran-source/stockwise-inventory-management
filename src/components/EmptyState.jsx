import Icon from './Icon';

export default function EmptyState({ title, message, actionLabel, onAction, icon = 'box' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name={icon} size={25} /></div>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {actionLabel && <button className="btn btn-primary" type="button" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

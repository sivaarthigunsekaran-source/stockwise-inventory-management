import Icon from './Icon';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`toast ${isError ? 'toast-error' : 'toast-success'}`} role="status">
      <Icon name={isError ? 'alert' : 'check'} size={19} />
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">x</button>
    </div>
  );
}

import Icon from './Icon';

export default function Header({ title, subtitle, onMenuClick, onRefresh, refreshing }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" type="button" onClick={onMenuClick} aria-label="Open navigation">
        <Icon name="menu" size={22} />
      </button>
      <div className="topbar-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <button className="icon-btn" type="button" onClick={onRefresh} disabled={refreshing} aria-label="Refresh inventory">
        <Icon name="refresh" size={19} className={refreshing ? 'spin' : ''} />
      </button>
    </header>
  );
}

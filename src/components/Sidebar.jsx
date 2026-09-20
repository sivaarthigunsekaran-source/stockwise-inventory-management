import Icon from './Icon';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'products', label: 'Products', icon: 'box' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory' },
  { id: 'transactions', label: 'Transactions', icon: 'transactions' },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose, lowStockCount }) {
  return (
    <>
      <div className={`sidebar-overlay${isOpen ? ' show' : ''}`} onClick={onClose} />
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-logo"><Icon name="box" size={23} /></div>
          <div className="brand-text"><h1>StockWise</h1><span>Inventory control</span></div>
        </div>
        <nav className="nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item${activePage === item.id ? ' active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.id === 'inventory' && lowStockCount > 0 && <span className="nav-badge">{lowStockCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">Keep your stock moving.</div>
      </aside>
    </>
  );
}

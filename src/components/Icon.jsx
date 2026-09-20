const paths = {
  dashboard: <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" />,
  box: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5m0 0L4 7.5M8 5.25l8 4.5M8 14v3.5" />,
  inventory: <path d="M4 7h16M6 4h12v16H6V4Zm3 7h6m-6 4h4" />,
  transactions: <path d="M5 7h14M5 12h14M5 17h14M3 7h.01M3 12h.01M3 17h.01" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  refresh: <path d="M20 11a8 8 0 0 0-14.9-3.8L3 10m0 0V5m0 5h5M4 13a8 8 0 0 0 14.9 3.8L21 14m0 0v5m0-5h-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
  alert: <><path d="M12 4 3 20h18L12 4Z" /><path d="M12 10v4m0 3h.01" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  arrowUp: <path d="m6 14 6-6 6 6" />,
  arrowDown: <path d="m6 10 6 6 6-6" />,
};

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] || paths.box}
    </svg>
  );
}

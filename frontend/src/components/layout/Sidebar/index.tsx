import { NavLink } from 'react-router-dom';

const navigationItems = [
  { label: 'Painel de gestão', path: '/dashboard', icon: '▦' },
  { label: 'Encomendas', path: '/orders', icon: '▤' },
  { label: 'Clientes', path: '/customers', icon: '♙' },
  { label: 'Serviços', path: '/services', icon: '◈' },
  { label: 'Funcionários', path: '/employees', icon: '♧' },
  { label: 'Pagamentos', path: '/payments', icon: '€' },
  { label: 'Relatórios', path: '/reports', icon: '▥' },
];

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          LavandariaPro
        </h1>

        <p className="mt-1 text-xs text-text-muted">
          Sistema de gestão
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Menu principal
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
                }`
              }
            >
              <span className="flex h-6 w-6 items-center justify-center text-base">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-100 px-6 py-4">
        <p className="text-xs text-text-muted">
          LavandariaPro © 2026
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
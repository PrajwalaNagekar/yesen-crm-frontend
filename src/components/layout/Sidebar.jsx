import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Avatar from '../common/Avatar.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Pipeline', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', icon: Users, adminOnly: true },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onNavigate }) {
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.username || 'User';

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-border bg-white/95 backdrop-blur-sm transition-all duration-300 ease-out ${
        collapsed ? 'w-0 overflow-hidden border-r-0' : 'w-72'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient font-display text-lg font-bold text-white shadow-md shadow-brand-500/25">
          Y
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold tracking-tight text-brand-900">
            Yesen CRM
          </p>
          <p className="truncate text-xs text-slate-500">Inquiry management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === 'admin').map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-soft'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient" />
                    )}
                    <item.icon
                      size={18}
                      strokeWidth={isActive ? 2.25 : 2}
                      className={`transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50/80 px-3 py-2.5">
          <Avatar name={displayName} size={36} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-900">{displayName}</p>
            <p className="truncate text-xs capitalize text-slate-500">
              {user?.role || ''}
              {user?.username ? ` · @${user.username}` : ''}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Briefcase,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { hasModuleAccess } from '../../utils/permissions.js';
import Avatar from '../common/Avatar.jsx';

const NAV_ITEMS = [
  { type: 'link', to: '/', label: 'Pipeline', icon: LayoutDashboard, end: true, module: 'pipeline' },
  { type: 'link', to: '/users', label: 'Users', icon: Users, module: 'users' },
  {
    type: 'group',
    id: 'csm',
    label: 'CSM',
    icon: Briefcase,
    children: [{ to: '/csm/projects', label: 'Projects', icon: FolderKanban, module: 'projects' }],
  },
  { type: 'link', to: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote, module: 'testimonials' },
  { type: 'link', to: '/settings', label: 'Settings', icon: Settings },
];

function canViewNavItem(user, item) {
  if (item.type === 'group') {
    return item.children.some((child) =>
      child.module ? hasModuleAccess(user, child.module) : true
    );
  }
  if (item.module) return hasModuleAccess(user, item.module);
  if (item.adminOnly) return user?.role === 'admin';
  return true;
}

function canViewNavChild(user, child) {
  if (child.module) return hasModuleAccess(user, child.module);
  return true;
}

function NavItemLink({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'translate-x-0.5 bg-blue-50 text-[#1e40af] shadow-sm shadow-blue-500/10 ring-1 ring-blue-100'
            : 'text-slate-600 hover:translate-x-1 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <span
              className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#2563EB] shadow-sm shadow-blue-500/40"
              aria-hidden
            />
          ) : null}
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-white text-[#2563EB] shadow-sm ring-1 ring-blue-100'
                : 'bg-slate-100/80 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm'
            }`}
          >
            <item.icon size={18} strokeWidth={isActive ? 2.25 : 2} />
          </span>
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavItemGroup({ item, user, onNavigate, expanded, onToggle }) {
  const location = useLocation();
  const visibleChildren = item.children.filter((child) => canViewNavChild(user, child));
  const isChildActive = visibleChildren.some(
    (child) => location.pathname === child.to || location.pathname.startsWith(`${child.to}/`)
  );
  const isOpen = expanded || isChildActive;

  if (!visibleChildren.length) return null;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
          isChildActive
            ? 'bg-blue-50/80 text-[#1e40af] ring-1 ring-blue-100'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            isChildActive
              ? 'bg-white text-[#2563EB] shadow-sm ring-1 ring-blue-100'
              : 'bg-slate-100/80 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm'
          }`}
        >
          <item.icon size={18} strokeWidth={isChildActive ? 2.25 : 2} />
        </span>
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <ul
        className={`mt-1 space-y-1 overflow-hidden pl-3 transition-all duration-200 ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {visibleChildren.map((child) => (
          <li key={child.to}>
            <NavLink
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl py-2.5 pl-9 pr-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-[#1e40af] shadow-sm shadow-blue-500/10 ring-1 ring-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <child.icon
                    size={16}
                    className={isActive ? 'text-[#2563EB]' : 'text-slate-400'}
                    strokeWidth={isActive ? 2.25 : 2}
                  />
                  <span className="truncate">{child.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Sidebar({ collapsed, onNavigate }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const displayName = user?.name || user?.username || 'User';
  const [csmOpen, setCsmOpen] = useState(() => location.pathname.startsWith('/csm'));

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 ease-out ${
        collapsed ? 'w-0 overflow-hidden border-r-0' : 'w-72'
      }`}
    >
      {/* Header — height matches AppLayout header (h-[4.75rem]) */}
      <div className="relative flex h-[4.75rem] w-full shrink-0 items-center justify-center border-b border-slate-200/80 px-4">
        <img
          src="/logo/yesen.png"
          alt="Yesen Technologies"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </p>
        <ul className="space-y-1.5">
          {NAV_ITEMS.filter((item) => canViewNavItem(user, item)).map((item) => (
            <li key={item.type === 'group' ? item.id : item.to}>
              {item.type === 'group' ? (
                <NavItemGroup
                  item={item}
                  user={user}
                  onNavigate={onNavigate}
                  expanded={csmOpen}
                  onToggle={() => setCsmOpen((open) => !open)}
                />
              ) : (
                <NavItemLink item={item} onNavigate={onNavigate} />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200/80 bg-slate-50/50 px-4 py-4 backdrop-blur-sm">
        <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-md shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar name={displayName} size={40} />
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="mt-0.5 truncate text-xs capitalize text-slate-500">
                {user?.role || 'Staff'}
                {user?.username ? (
                  <span className="text-slate-400"> · @{user.username}</span>
                ) : null}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-100 hover:text-red-700 hover:shadow-sm active:scale-[0.98]"
        >
          <LogOut size={17} strokeWidth={2} />
          Sign out
        </button>

        <p className="mt-3 text-center text-[10px] font-medium tracking-wide text-slate-400">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}

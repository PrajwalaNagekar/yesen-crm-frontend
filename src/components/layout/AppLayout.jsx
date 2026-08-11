import { useEffect, useState } from 'react';
import { PanelLeft, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

export default function AppLayout({ title, subtitle, actions, children, scrollable = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function toggleNav() {
    if (window.innerWidth < 768) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => !c);
    }
  }

  return (
    <div className="app-canvas flex h-screen">
      {/* Desktop / tablet sidebar */}
      <div className={`hidden shrink-0 md:block ${collapsed ? 'w-0' : ''}`}>
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full transform shadow-elevated transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b-2 border-slate-200 bg-white px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={toggleNav}
              className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 active:scale-95"
              aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
            >
              {mobileOpen ? <X size={20} /> : <PanelLeft size={20} />}
            </button>
            <div className="min-w-0 animate-fade-in">
              <h1 className="truncate font-display text-lg font-bold tracking-tight text-brand-900 sm:text-xl lg:text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{subtitle}</p>
              )}
            </div>
          </div>

          {actions && (
            <div className="flex w-full flex-wrap items-center gap-2 animate-fade-in-down sm:w-auto sm:gap-3">
              {actions}
            </div>
          )}
        </header>

        <main
          className={`min-h-0 flex-1 ${scrollable ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

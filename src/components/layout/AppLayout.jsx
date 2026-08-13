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
    <div className="app-canvas flex h-screen overflow-hidden">
      {/* Desktop / tablet sidebar */}
      <div className={`hidden shrink-0 transition-[width] duration-300 ease-out md:block ${collapsed ? 'w-0' : ''}`}>
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full transform shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-10 flex h-[4.75rem] shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/80 px-3 shadow-sm shadow-slate-200/40 backdrop-blur-md sm:gap-4 sm:px-5 lg:px-6">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent"
            aria-hidden
          />

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={toggleNav}
              className="shrink-0 rounded-xl border border-slate-200/80 bg-white p-2.5 text-slate-500 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] hover:shadow-md hover:shadow-blue-500/10 active:scale-95"
              aria-label={mobileOpen ? 'Close sidebar' : 'Toggle sidebar'}
            >
              {mobileOpen ? <X size={20} strokeWidth={2} /> : <PanelLeft size={20} strokeWidth={2} />}
            </button>

            <div className="min-w-0 animate-fade-in">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="hidden h-7 w-1 shrink-0 rounded-full bg-[#2563EB] sm:block"
                  aria-hidden
                />
                <div className="min-w-0">
                  <h1 className="truncate font-display text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="mt-0.5 truncate text-[11px] font-medium leading-tight text-slate-500 sm:text-xs">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 animate-fade-in-down sm:gap-3">
              {actions}
            </div>
          ) : null}
        </header>

        <main
          className={`relative min-h-0 flex-1 bg-slate-50/40 ${
            scrollable ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'
          }`}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent"
            aria-hidden
          />
          {children}
        </main>
      </div>
    </div>
  );
}

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = 'error') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((list) => [...list, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      error: (message) => push(message, 'error'),
      success: (message) => push(message, 'success'),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-4 z-[80] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-toast-in flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm shadow-elevated backdrop-blur-sm ${
              toast.tone === 'success'
                ? 'border-emerald-200/80 bg-emerald-50/95 text-emerald-800'
                : 'border-red-200/80 bg-red-50/95 text-red-700'
            }`}
            role="status"
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            )}
            <p className="min-w-0 flex-1 leading-snug font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-lg p-0.5 opacity-60 transition-opacity hover:opacity-100"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

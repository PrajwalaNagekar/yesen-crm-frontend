import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 animate-fade-in bg-slate-900/45 backdrop-blur-[3px]"
        aria-label="Dismiss"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="relative w-full max-w-sm animate-scale-in rounded-2xl border border-border bg-white p-6 shadow-elevated"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <AlertTriangle size={22} />
        </div>
        <h2 id="confirm-title" className="font-display text-lg font-bold tracking-tight text-brand-900">
          {title}
        </h2>
        {description && (
          <p id="confirm-desc" className="mt-2 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

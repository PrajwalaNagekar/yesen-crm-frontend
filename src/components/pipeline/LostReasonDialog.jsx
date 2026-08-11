import { useState } from 'react';
import { Frown } from 'lucide-react';
import Button from '../common/Button.jsx';
import Textarea from '../common/Textarea.jsx';

export default function LostReasonDialog({ open, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');

  if (!open) return null;

  function handleConfirm() {
    onConfirm(reason.trim() || undefined);
    setReason('');
  }

  function handleCancel() {
    setReason('');
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 animate-fade-in bg-slate-900/45 backdrop-blur-[3px]"
        aria-label="Dismiss"
        onClick={handleCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lost-title"
        className="relative w-full max-w-sm animate-scale-in rounded-2xl border border-border bg-white p-6 shadow-elevated"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 ring-1 ring-border">
          <Frown size={22} />
        </div>
        <h2 id="lost-title" className="font-display text-lg font-bold tracking-tight text-brand-900">
          Mark as Lost
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Optionally note why this inquiry did not proceed. You can leave this blank.
        </p>
        <Textarea
          className="mt-4"
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Chose a competitor, budget cut…"
          rows={3}
        />
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Saving…' : 'Move to Lost'}
          </Button>
        </div>
      </div>
    </div>
  );
}

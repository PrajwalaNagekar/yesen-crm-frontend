export default function ActiveToggle({
  active,
  onChange,
  disabled = false,
  id = 'active-toggle',
  compact = false,
}) {
  if (compact) {
    return (
      <label
        htmlFor={id}
        className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-colors ${
          disabled ? 'cursor-default opacity-70' : 'hover:bg-slate-50'
        }`}
        title={active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
      >
        <span
          className={`text-xs font-semibold ${active ? 'text-emerald-700' : 'text-slate-400'}`}
        >
          {active ? 'Active' : 'Inactive'}
        </span>
        <span
          className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
            active ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <input
            id={id}
            type="checkbox"
            className="sr-only"
            checked={active}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              active ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </span>
      </label>
    );
  }

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
        disabled
          ? 'cursor-default border-slate-200 bg-slate-50/80 opacity-70'
          : active
            ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/60'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand-900">Account status</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {active ? 'User can sign in to the CRM' : 'Inactive users cannot sign in'}
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            active ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          {active ? 'Active' : 'Inactive'}
        </span>
        <span
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
            active ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <input
            id={id}
            type="checkbox"
            className="sr-only"
            checked={active}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </span>
      </span>
    </label>
  );
}

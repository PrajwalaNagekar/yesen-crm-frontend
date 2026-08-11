export default function EmptyState({ icon: Icon, title, description, className = '', compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2.5 animate-fade-in-up rounded-2xl border border-dashed border-border bg-white/80 text-center ${
        compact ? 'px-4 py-8' : 'px-6 py-16'
      } ${className}`}
    >
      {Icon && (
        <div
          className={`mb-1 flex items-center justify-center rounded-2xl bg-brand-50 text-brand-400 ring-1 ring-brand-100 ${
            compact ? 'h-10 w-10' : 'h-14 w-14'
          }`}
        >
          <Icon size={compact ? 20 : 26} strokeWidth={1.75} />
        </div>
      )}
      <p className={`font-semibold text-brand-900 ${compact ? 'text-sm' : 'text-base'}`}>{title}</p>
      {description && (
        <p className={`max-w-sm leading-relaxed text-slate-500 ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

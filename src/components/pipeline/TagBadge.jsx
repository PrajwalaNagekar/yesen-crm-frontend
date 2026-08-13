const TAG_TONES = {
  default: 'bg-sky-50 text-sky-600',
  pill: 'bg-sky-50 text-sky-600',
  sky: 'bg-sky-50 text-sky-600',
  blue: 'bg-sky-50 text-sky-600',
  indigo: 'bg-sky-50 text-sky-600',
  amber: 'bg-sky-50 text-sky-600',
  emerald: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function TagBadge({ children, onRemove, tone = 'pill' }) {
  const toneClass = TAG_TONES[tone] || TAG_TONES.pill;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors duration-150 ${toneClass}`}
    >
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full opacity-50 transition-all duration-150 hover:bg-black/5 hover:opacity-100"
          aria-label={`Remove tag ${children}`}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}

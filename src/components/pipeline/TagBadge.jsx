export default function TagBadge({ children, onRemove }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 transition-colors duration-150">
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-brand-700/50 transition-all duration-150 hover:bg-brand-100 hover:text-brand-900"
          aria-label={`Remove tag ${children}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

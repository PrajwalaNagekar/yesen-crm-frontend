import { Plus, Search } from 'lucide-react';

export const CATALOGUE_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
];

export default function CatalogueListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  sort,
  onSortChange,
  showSort = true,
  children,
  onAdd,
  addLabel,
  canAdd = true,
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus:border-[#2563EB]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showSort ? (
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#2563EB]/40 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {CATALOGUE_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}

          {canAdd && onAdd ? (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              <Plus size={18} />
              {addLabel}
            </button>
          ) : null}
        </div>
      </div>

      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

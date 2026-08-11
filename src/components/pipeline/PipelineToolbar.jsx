import { Search, LayoutGrid, List, Rows3 } from 'lucide-react';

const VIEWS = [
  { id: 'board', label: 'Board', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: List },
  { id: 'compact', label: 'Cards', icon: Rows3 },
];

export default function PipelineToolbar({
  search,
  onSearchChange,
  source,
  onSourceChange,
  assigneeFilter,
  onAssigneeChange,
  team,
  currentUserId,
  view,
  onViewChange,
}) {
  return (
    <div className="shrink-0 border-b border-slate-200 bg-white px-3 py-3 sm:px-5 lg:px-6">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Source */}
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          aria-label="Source"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All sources</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="contact">Contact</option>
        </select>

        {/* Owner — single control for multi-user */}
        <select
          value={assigneeFilter}
          onChange={(e) => onAssigneeChange(e.target.value)}
          aria-label="Owner"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All owners</option>
          {currentUserId && <option value={currentUserId}>Mine</option>}
          <option value="unassigned">Unassigned</option>
          {(team || [])
            .filter((u) => u._id !== currentUserId)
            .map((u) => (
              <option key={u._id} value={u._id}>
                {u.name || u.username}
              </option>
            ))}
        </select>

        {/* View switcher */}
        <div
          className="ml-auto inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
          role="group"
          aria-label="View"
        >
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              title={label}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:text-sm ${
                view === id
                  ? 'bg-white text-brand-800 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-brand-800'
              }`}
              aria-pressed={view === id}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

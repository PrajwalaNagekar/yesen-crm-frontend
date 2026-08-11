import { AlertCircle, Inbox, ArrowUpRight } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import Spinner from '../common/Spinner.jsx';
import EmptyState from '../common/EmptyState.jsx';
import {
  formatCurrency,
  formatRelativeTime,
  SOURCE_LABELS,
  STAGE_META,
  getAssigneeName,
} from '../../utils/format.js';

function flattenColumns(columns) {
  return (columns || []).flatMap((col) =>
    (col.cards || []).map((card) => ({ ...card, stage: card.stage || col.stage }))
  );
}

export default function ListView({
  columns,
  isLoading,
  error,
  stages = [],
  team = [],
  onOpenInquiry,
  onStageChange,
  onAssign,
}) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Spinner size={28} />
        <p className="text-sm text-slate-400">Loading list…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-6 py-8 text-center">
          <AlertCircle size={22} className="text-red-500" />
          <p className="text-sm font-medium text-red-700">
            {error.message || 'Failed to load inquiries.'}
          </p>
        </div>
      </div>
    );
  }

  const rows = flattenColumns(columns);

  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Inbox}
          title="No inquiries match your filters"
          description="Try clearing search or filters."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-3 sm:p-5 lg:p-6">
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border-2 border-slate-200 bg-white shadow-sm">
        {/* Mobile cards */}
        <div className="divide-y divide-slate-200 md:hidden">
          {rows.map((row) => {
            const stageMeta = STAGE_META[row.stage] || STAGE_META.Inquired;
            const assignee = getAssigneeName(row.assignedTo);
            return (
              <button
                key={row._id}
                type="button"
                onClick={() => onOpenInquiry(row)}
                className="flex w-full flex-col gap-2.5 p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={row.clientName} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-brand-900">{row.clientName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {row.company || row.email || '—'}
                    </p>
                  </div>
                  <ArrowUpRight size={16} className="shrink-0 text-slate-300" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${stageMeta.badge}`}
                  >
                    {row.stage}
                  </span>
                  <span className="text-xs text-slate-500">
                    {SOURCE_LABELS[row.source] || row.source}
                  </span>
                  {formatCurrency(row.value) && (
                    <span className="text-xs font-semibold text-brand-800">
                      {formatCurrency(row.value)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {assignee ? `Owner: ${assignee}` : 'Unassigned'}
                  {row.updatedAt ? ` · ${formatRelativeTime(row.updatedAt)}` : ''}
                </p>
              </button>
            );
          })}
        </div>

        {/* Desktop table */}
        <table className="hidden w-full min-w-[720px] border-collapse text-left text-sm md:table">
          <thead className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-50">
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-3 py-3 font-semibold">Stage</th>
              <th className="px-3 py-3 font-semibold">Owner</th>
              <th className="px-3 py-3 font-semibold">Source</th>
              <th className="px-3 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => {
              const stageMeta = STAGE_META[row.stage] || STAGE_META.Inquired;
              const assigneeId =
                typeof row.assignedTo === 'object' && row.assignedTo
                  ? row.assignedTo._id
                  : row.assignedTo || '';
              return (
                <tr
                  key={row._id}
                  className="group cursor-pointer transition-colors hover:bg-brand-50/40"
                  onClick={() => onOpenInquiry(row)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={row.clientName} size={32} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-brand-900">{row.clientName}</p>
                        <p className="truncate text-xs text-slate-500">
                          {row.company || row.email || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={row.stage}
                      onChange={(e) => onStageChange(row._id, e.target.value)}
                      aria-label={`Stage for ${row.clientName}`}
                      className={`w-full max-w-[10.5rem] cursor-pointer rounded-md border px-2 py-1.5 text-xs font-semibold ring-1 ${stageMeta.badge} border-transparent focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100`}
                    >
                      {(stages.length ? stages : Object.keys(STAGE_META)).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={assigneeId || ''}
                      onChange={(e) =>
                        onAssign(row._id, e.target.value === '' ? null : e.target.value)
                      }
                      aria-label={`Owner for ${row.clientName}`}
                      className="w-full max-w-[9.5rem] cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="">Unassigned</option>
                      {team.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name || u.username}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {SOURCE_LABELS[row.source] || row.source}
                  </td>
                  <td className="px-3 py-3 font-semibold tabular-nums text-brand-800">
                    {formatCurrency(row.value) || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatRelativeTime(row.updatedAt || row.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

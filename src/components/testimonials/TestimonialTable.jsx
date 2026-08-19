import { Pencil, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/format.js';

export default function TestimonialTable({ testimonials, onEdit, onDelete }) {
  if (!testimonials?.length) return null;

  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-3 py-3.5 font-semibold">Testimonial</th>
              <th className="w-36 px-3 py-3.5 font-semibold">Designation</th>
              <th className="w-32 px-3 py-3.5 font-semibold">Location</th>
              <th className="w-32 px-3 py-3.5 font-semibold">Added by</th>
              <th className="w-36 px-3 py-3.5 font-semibold">Added at</th>
              {showActions ? (
                <th className="w-24 px-5 py-3.5 text-right font-semibold">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testimonials.map((item) => (
              <tr key={item._id} className="transition-colors hover:bg-blue-50/25">
                <td className="px-5 py-4 align-top">
                  <p className="font-semibold text-slate-900">{item.name || '—'}</p>
                </td>
                <td className="max-w-md px-3 py-4 align-top">
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {item.testimonial || '—'}
                  </p>
                </td>
                <td className="px-3 py-4 align-top text-sm text-slate-600">
                  {item.designation || '—'}
                </td>
                <td className="px-3 py-4 align-top text-sm text-slate-600">
                  {item.location || '—'}
                </td>
                <td className="px-3 py-4 align-top text-sm font-medium text-slate-700">
                  {item.addedBy || '—'}
                </td>
                <td className="px-3 py-4 align-top text-sm text-slate-500">
                  <span title={item.addedAt ? new Date(item.addedAt).toLocaleString() : ''}>
                    {item.addedAt
                      ? new Date(item.addedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                  {item.addedAt ? (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatRelativeTime(item.addedAt)}
                    </p>
                  ) : null}
                </td>
                {showActions ? (
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center justify-end gap-1.5">
                      {onEdit ? (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
                          aria-label={`Edit ${item.name}`}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="rounded-xl border border-transparent p-2 text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${item.name}`}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {testimonials.map((item) => (
          <li key={item._id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{item.name || '—'}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {[item.designation, item.location].filter(Boolean).join(' · ') || '—'}
                </p>
              </div>
              {showActions ? (
                <div className="flex shrink-0 gap-1">
                  {onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-500"
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="rounded-xl p-2 text-slate-400"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {item.testimonial || '—'}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Added by {item.addedBy || '—'}
              {item.addedAt ? ` · ${formatRelativeTime(item.addedAt)}` : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

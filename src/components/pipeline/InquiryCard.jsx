import { FileCheck2, GripVertical } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import TagBadge from './TagBadge.jsx';
import {
  formatCurrency,
  SOURCE_LABELS,
  getAssigneeName,
} from '../../utils/format.js';

export default function InquiryCard({ inquiry, onOpen, onDragStart, compact = false }) {
  const description = inquiry.productOrServiceName || inquiry.message;
  const formattedValue = formatCurrency(inquiry.value);
  const assigneeName = getAssigneeName(inquiry.assignedTo);

  if (compact) {
    return (
      <button
        type="button"
        draggable={Boolean(onDragStart)}
        onDragStart={onDragStart ? (e) => onDragStart(e, inquiry) : undefined}
        onClick={() => onOpen(inquiry)}
        className="group w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all duration-150 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      >
        <div className="flex items-center gap-3">
          <Avatar name={inquiry.clientName} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-900">{inquiry.clientName}</p>
            <p className="truncate text-xs text-slate-500">
              {inquiry.company || SOURCE_LABELS[inquiry.source] || '—'}
            </p>
          </div>
          {formattedValue && (
            <span className="shrink-0 text-sm font-semibold text-brand-800">{formattedValue}</span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart ? (e) => onDragStart(e, inquiry) : undefined}
      onClick={() => onOpen(inquiry)}
      className="group relative w-full cursor-grab rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-150 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        <Avatar name={inquiry.clientName} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-semibold leading-snug text-brand-900">
            {inquiry.clientName}
          </p>
          {inquiry.company ? (
            <p className="mt-0.5 truncate text-sm text-slate-500">{inquiry.company}</p>
          ) : null}
        </div>
        {onDragStart ? (
          <GripVertical
            size={16}
            className="mt-0.5 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        ) : null}
      </div>

      {description ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{description}</p>
      ) : null}

      {inquiry.tags?.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {inquiry.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>
      ) : null}

      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="min-w-0 truncate">
          {SOURCE_LABELS[inquiry.source] || inquiry.source}
          {assigneeName ? ` · ${assigneeName}` : ''}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {inquiry.quotation?.sent ? (
            <span className="text-emerald-600" title="Quote sent">
              <FileCheck2 size={14} />
            </span>
          ) : null}
          {formattedValue ? (
            <span className="font-semibold text-brand-800">{formattedValue}</span>
          ) : null}
        </span>
      </div>
    </button>
  );
}

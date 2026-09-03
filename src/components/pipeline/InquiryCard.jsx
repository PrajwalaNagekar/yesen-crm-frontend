import { FileCheck2, GripVertical } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import TagBadge from './TagBadge.jsx';
import {
  formatCurrency,
  SOURCE_LABELS,
  STAGE_META,
  getAssigneeName,
} from '../../utils/format.js';

export default function InquiryCard({ inquiry, onOpen, onDragStart, compact = false }) {
  const description =
    inquiry.product?.name ||
    inquiry.solution?.name ||
    inquiry.subject ||
    inquiry.productOrServiceName ||
    inquiry.message;
  const formattedValue = formatCurrency(inquiry.value);
  const assigneeName = getAssigneeName(inquiry.assignedTo);
  const stageMeta = STAGE_META[inquiry.stage] || STAGE_META.Inquired;
  const isLost = inquiry.stage === 'Lost';
  const isUnread = !inquiry.isViewed;
  const tagTone = stageMeta.tagTone || 'default';

  const draggable = Boolean(onDragStart);
  const cursorClass = draggable
    ? 'cursor-grab active:cursor-grabbing'
    : 'cursor-pointer';

  const cardSurface = `rounded-2xl border text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/25 ${stageMeta.cardBg} ${
    isLost
      ? 'border-rose-200/90 hover:border-rose-300 hover:shadow-rose-100/60'
      : isUnread
        ? 'border-[#2563EB]/35 ring-1 ring-[#2563EB]/15'
        : `${stageMeta.border} hover:border-[#2563EB]/30 hover:shadow-blue-500/5`
  } ${cursorClass}`;

  if (compact) {
    return (
      <button
        type="button"
        draggable={draggable}
        onDragStart={onDragStart ? (e) => onDragStart(e, inquiry) : undefined}
        onClick={() => onOpen(inquiry)}
        className={`group w-full p-3.5 ${cardSurface}`}
      >
        <div className="flex items-center gap-3">
          <Avatar name={inquiry.clientName} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isUnread ? (
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" aria-label="Unread" />
            ) : null}
            <p className={`truncate text-sm font-semibold ${isLost ? 'text-rose-950' : 'text-slate-900'}`}>
              {inquiry.clientName}
            </p>
          </div>
            <p className="truncate text-xs text-slate-500">
              {inquiry.company || SOURCE_LABELS[inquiry.source] || '—'}
            </p>
          </div>
          {formattedValue ? (
            <span className="shrink-0 text-sm font-semibold text-slate-800">{formattedValue}</span>
          ) : null}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, inquiry) : undefined}
      onClick={() => onOpen(inquiry)}
      className={`group w-full p-4 ${cardSurface}`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={inquiry.clientName} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {isUnread ? (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" aria-label="Unread" />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[0.9375rem] font-semibold leading-snug ${isLost ? 'text-rose-950' : 'text-slate-900'}`}>
                {inquiry.clientName}
              </p>
              {inquiry.company ? (
                <p className="mt-0.5 truncate text-sm text-slate-600">{inquiry.company}</p>
              ) : null}
            </div>
          </div>
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
            <TagBadge key={tag} tone={tagTone}>
              {tag}
            </TagBadge>
          ))}
        </div>
      ) : null}

      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-black/5 pt-3 text-xs text-slate-500">
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
            <span className={`font-semibold ${isLost ? 'text-rose-800' : 'text-slate-800'}`}>
              {formattedValue}
            </span>
          ) : null}
        </span>
      </div>
    </button>
  );
}

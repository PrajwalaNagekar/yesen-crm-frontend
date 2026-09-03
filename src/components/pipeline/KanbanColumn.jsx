import { useState } from 'react';
import { Inbox } from 'lucide-react';
import InquiryCard from './InquiryCard.jsx';
import { STAGE_META } from '../../utils/format.js';

export default function KanbanColumn({
  stage,
  cards,
  onOpenInquiry,
  onDropCard,
  canControl = true,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = STAGE_META[stage] || STAGE_META.Inquired;
  const isEmpty = cards.length === 0;
  const isLost = stage === 'Lost';
  const unviewedCount = cards.filter((card) => !card.isViewed).length;
  const badgeCount = unviewedCount > 0 ? unviewedCount : cards.length;
  const isUnreadBadge = unviewedCount > 0;

  function handleDragOver(e) {
    if (!canControl) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDrop(e) {
    if (!canControl) return;
    e.preventDefault();
    setIsDragOver(false);
    const inquiryId = e.dataTransfer.getData('text/inquiry-id');
    const fromStage = e.dataTransfer.getData('text/from-stage');
    if (inquiryId && fromStage !== stage) {
      onDropCard(inquiryId, stage);
    }
  }

  const dragHandlers = canControl
    ? {
        onDragOver: handleDragOver,
        onDragLeave: (e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragOver(false);
          }
        },
        onDrop: handleDrop,
      }
    : {};

  return (
    <div
      className={`flex h-full w-[17rem] shrink-0 flex-col overflow-hidden rounded-2xl border transition-all duration-200 sm:w-72 lg:w-[18.5rem] ${meta.columnBg} ${
        isDragOver
          ? 'border-[#2563EB]/50 shadow-lg ring-2 ring-[#2563EB]/20'
          : isLost
            ? 'border-rose-200/80 shadow-sm shadow-rose-100/50'
            : `${meta.border} shadow-sm`
      }`}
      {...dragHandlers}
    >
      {/* Column header — highlighted status */}
      <div
        className={`relative flex shrink-0 items-center justify-between gap-2 border-b px-3.5 py-3 ${meta.headerBg} ${meta.border}`}
      >
        <span className={`absolute inset-x-0 top-0 h-1 ${meta.dot}`} aria-hidden />
        <span className="flex min-w-0 items-center gap-2.5 pt-0.5">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
          <span className={`truncate text-sm font-bold ${isLost ? 'text-rose-900' : 'text-slate-900'}`}>
            {stage}
          </span>
        </span>
        <span
          className={`shrink-0 min-w-[1.75rem] rounded-full px-2 py-0.5 text-center text-xs font-bold tabular-nums ring-1 ${
            isEmpty
              ? 'bg-white/60 text-slate-400 ring-slate-200/80'
              : isUnreadBadge
                ? 'bg-[#2563EB] text-white ring-[#2563EB]/30'
                : meta.badge
          }`}
        >
          {badgeCount}
        </span>
      </div>

      {/* Column body */}
      <div
        className={`scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto p-2.5 sm:p-3 ${
          isLost ? 'bg-rose-50/30' : 'bg-white/25'
        }`}
      >
        {isEmpty ? (
          <div
            className={`flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors duration-200 ${
              isDragOver
                ? 'border-[#2563EB]/50 bg-white/80'
                : isLost
                  ? 'border-rose-200/80 bg-rose-50/40'
                  : 'border-slate-200/70 bg-white/40'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isDragOver
                  ? 'bg-blue-100 text-[#2563EB]'
                  : 'bg-white/80 text-slate-300 ring-1 ring-slate-200/80'
              }`}
            >
              <Inbox size={20} strokeWidth={1.75} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${isDragOver ? 'text-[#1d4ed8]' : 'text-slate-600'}`}>
                {isDragOver ? 'Release to move here' : 'No inquiries yet'}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {canControl
                  ? isDragOver
                    ? `Move to ${stage}`
                    : 'Drag a card into this stage'
                  : 'No inquiries in this stage'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {cards.map((card) => (
              <InquiryCard
                key={card._id}
                inquiry={card}
                onOpen={onOpenInquiry}
                onDragStart={
                  canControl
                    ? (e, inquiry) => {
                        e.dataTransfer.setData('text/inquiry-id', inquiry._id);
                        e.dataTransfer.setData('text/from-stage', inquiry.stage);
                        e.dataTransfer.effectAllowed = 'move';
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

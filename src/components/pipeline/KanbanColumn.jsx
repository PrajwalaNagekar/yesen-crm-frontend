import { useState } from 'react';
import { Inbox } from 'lucide-react';
import InquiryCard from './InquiryCard.jsx';
import { STAGE_META } from '../../utils/format.js';

export default function KanbanColumn({ stage, cards, onOpenInquiry, onDropCard }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = STAGE_META[stage] || STAGE_META.Inquired;
  const isEmpty = cards.length === 0;

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const inquiryId = e.dataTransfer.getData('text/inquiry-id');
    const fromStage = e.dataTransfer.getData('text/from-stage');
    if (inquiryId && fromStage !== stage) {
      onDropCard(inquiryId, stage);
    }
  }

  return (
    <div
      className={`flex h-full w-[17rem] shrink-0 flex-col overflow-hidden rounded-xl border bg-white transition-all duration-200 sm:w-72 lg:w-[18.5rem] ${
        isDragOver
          ? 'border-brand-400 bg-brand-50/30 shadow-md ring-2 ring-brand-100'
          : 'border-slate-200 shadow-sm'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={(e) => {
        // Only clear when leaving the column itself, not child elements
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsDragOver(false);
        }
      }}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/90 px-3.5 py-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
          <span className="truncate text-sm font-semibold text-brand-900">{stage}</span>
        </span>
        <span
          className={`shrink-0 min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs font-bold tabular-nums ${
            isEmpty
              ? 'bg-slate-100 text-slate-400'
              : 'bg-white text-slate-600 ring-1 ring-slate-200'
          }`}
        >
          {cards.length}
        </span>
      </div>

      {/* Body — fills height so empty state is tall and usable */}
      <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto p-2.5 sm:p-3">
        {isEmpty ? (
          <div
            className={`flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors duration-200 ${
              isDragOver
                ? 'border-brand-400 bg-brand-50/80'
                : 'border-slate-200 bg-slate-50/50'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                isDragOver
                  ? 'bg-brand-100 text-brand-600'
                  : 'bg-white text-slate-300 ring-1 ring-slate-200'
              }`}
            >
              <Inbox size={20} strokeWidth={1.75} />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  isDragOver ? 'text-brand-700' : 'text-slate-500'
                }`}
              >
                {isDragOver ? 'Release to move here' : 'No inquiries yet'}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {isDragOver ? `Move to ${stage}` : 'Drag a card into this stage'}
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
                onDragStart={(e, inquiry) => {
                  e.dataTransfer.setData('text/inquiry-id', inquiry._id);
                  e.dataTransfer.setData('text/from-stage', inquiry.stage);
                  e.dataTransfer.effectAllowed = 'move';
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

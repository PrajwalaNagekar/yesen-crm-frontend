import { AlertCircle, Inbox } from 'lucide-react';
import InquiryCard from './InquiryCard.jsx';
import SkeletonBone from '../common/loaders/SkeletonBone.jsx';
import SkeletonCard from '../common/loaders/SkeletonCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { STAGE_META } from '../../utils/format.js';

export default function CompactView({ columns, isLoading, error, onOpenInquiry }) {
  if (isLoading) {
    return (
      <div className="scrollbar-thin h-full overflow-y-auto p-3 sm:p-5">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <section
              key={index}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <SkeletonBone className="h-2 w-2 shrink-0 rounded-full" rounded="rounded-full" />
                  <SkeletonBone className="h-4 w-24" />
                </div>
                <SkeletonBone className="h-4 w-6 rounded-full" rounded="rounded-full" />
              </header>
              <div className="grid grid-cols-1 gap-2 p-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <SkeletonCard variant="inquiry" count={4} compact inline />
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
          <AlertCircle size={22} className="text-red-500" />
          <p className="text-sm font-medium text-red-700">
            {error.message || 'Failed to load inquiries.'}
          </p>
        </div>
      </div>
    );
  }

  const total = columns.reduce((sum, col) => sum + col.cards.length, 0);
  if (total === 0) {
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
    <div className="scrollbar-thin h-full overflow-y-auto p-3 sm:p-5">
      <div className="space-y-4">
        {columns.map((column) => {
          if (!column.cards.length) return null;
          const meta = STAGE_META[column.stage] || STAGE_META.Inquired;
          return (
            <section
              key={column.stage}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                  <h3 className="truncate text-sm font-semibold text-brand-900">{column.stage}</h3>
                </div>
                <span className="text-xs font-semibold tabular-nums text-slate-500">
                  {column.cards.length}
                </span>
              </header>
              <div className="grid grid-cols-1 gap-2 p-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {column.cards.map((card, index) => (
                  <InquiryCard
                    key={card._id}
                    inquiry={card}
                    index={index}
                    compact
                    onOpen={onOpenInquiry}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

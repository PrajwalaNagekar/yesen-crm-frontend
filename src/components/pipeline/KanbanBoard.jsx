import { AlertCircle, Inbox } from 'lucide-react';
import KanbanColumn from './KanbanColumn.jsx';
import Spinner from '../common/Spinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function KanbanBoard({ columns, isLoading, error, onOpenInquiry, onDropCard }) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Spinner size={28} />
        <p className="text-sm text-slate-400">Loading pipeline…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <AlertCircle size={22} className="text-red-500" />
          <p className="text-sm font-medium text-red-700">
            {error.message || 'Failed to load the pipeline.'}
          </p>
        </div>
      </div>
    );
  }

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);
  if (columns.length > 0 && totalCards === 0) {
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
    <div className="scrollbar-thin flex h-full gap-3 overflow-x-auto overscroll-x-contain px-3 py-4 sm:gap-4 sm:px-5 sm:py-5 lg:px-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.stage}
          stage={column.stage}
          cards={column.cards}
          onOpenInquiry={onOpenInquiry}
          onDropCard={onDropCard}
        />
      ))}
    </div>
  );
}

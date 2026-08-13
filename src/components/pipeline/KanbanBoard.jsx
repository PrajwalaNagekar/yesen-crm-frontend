import { AlertCircle, Inbox } from 'lucide-react';
import KanbanColumn from './KanbanColumn.jsx';
import Spinner from '../common/Spinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

function BoardCanvas({ children }) {
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/80">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.2) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export default function KanbanBoard({
  columns,
  isLoading,
  error,
  onOpenInquiry,
  onDropCard,
  canControl = true,
}) {
  if (isLoading) {
    return (
      <BoardCanvas>
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <Spinner size={28} />
          <p className="text-sm font-medium text-slate-500">Loading pipeline…</p>
        </div>
      </BoardCanvas>
    );
  }

  if (error) {
    return (
      <BoardCanvas>
        <div className="flex h-full items-center justify-center p-6">
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white/90 px-6 py-8 text-center shadow-sm">
            <AlertCircle size={22} className="text-red-500" />
            <p className="text-sm font-medium text-red-700">
              {error.message || 'Failed to load the pipeline.'}
            </p>
          </div>
        </div>
      </BoardCanvas>
    );
  }

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);
  if (columns.length > 0 && totalCards === 0) {
    return (
      <BoardCanvas>
        <div className="flex h-full items-center justify-center p-6">
          <EmptyState
            icon={Inbox}
            title="No inquiries match your filters"
            description="Try clearing search or filters."
          />
        </div>
      </BoardCanvas>
    );
  }

  return (
    <BoardCanvas>
      <div className="scrollbar-thin flex h-full gap-3 overflow-x-auto overscroll-x-contain px-3 py-4 sm:gap-4 sm:px-5 sm:py-5 lg:px-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.stage}
            stage={column.stage}
            cards={column.cards}
            canControl={canControl}
            onOpenInquiry={onOpenInquiry}
            onDropCard={onDropCard}
          />
        ))}
      </div>
    </BoardCanvas>
  );
}

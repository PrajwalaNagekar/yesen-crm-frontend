import SkeletonBone from './SkeletonBone.jsx';

function ProjectCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <SkeletonBone className="aspect-[16/10] w-full rounded-none" rounded="rounded-none" />
      <div className="space-y-3 p-5">
        <SkeletonBone className="h-5 w-2/3" />
        <SkeletonBone className="h-4 w-1/2" />
        <div className="space-y-2">
          <SkeletonBone className="h-3.5 w-full" />
          <SkeletonBone className="h-3.5 w-full" />
          <SkeletonBone className="h-3.5 w-4/5" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonBone className="h-6 w-16 rounded-full" rounded="rounded-full" />
          <SkeletonBone className="h-6 w-20 rounded-full" rounded="rounded-full" />
          <SkeletonBone className="h-6 w-24 rounded-full" rounded="rounded-full" />
        </div>
      </div>
    </article>
  );
}

function InquiryCardSkeleton({ compact = false }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm ${
        compact ? 'p-2.5' : 'p-3.5'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <SkeletonBone className="h-8 w-8 shrink-0 rounded-full" rounded="rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBone className="h-4 w-3/4" />
          <SkeletonBone className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <SkeletonBone className="h-5 w-16 rounded-md" rounded="rounded-md" />
        <SkeletonBone className="h-5 w-12 rounded-md" rounded="rounded-md" />
      </div>
    </div>
  );
}

export default function SkeletonCard({
  count = 3,
  variant = 'project',
  compact = false,
  inline = false,
  className = '',
}) {
  if (variant === 'inquiry') {
    const items = Array.from({ length: count }).map((_, index) => (
      <InquiryCardSkeleton key={index} compact={compact} />
    ));

    if (inline) {
      return (
        <>
          {items}
        </>
      );
    }

    return (
      <div className={`grid gap-2 ${className}`} aria-busy="true" aria-label="Loading content">
        {items}
      </div>
    );
  }

  return (
    <div
      className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${className}`}
      aria-busy="true"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SkeletonKanban({ columns = 5, cardsPerColumn = 3, className = '' }) {
  return (
    <div
      className={`flex h-full gap-3 overflow-hidden p-3 sm:gap-4 sm:p-5 ${className}`}
      aria-busy="true"
      aria-label="Loading pipeline"
    >
      {Array.from({ length: columns }).map((_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex min-w-[220px] max-w-[280px] flex-1 flex-col rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <SkeletonBone className="h-4 w-24" />
            <SkeletonBone className="h-5 w-6 rounded-full" rounded="rounded-full" />
          </div>
          <SkeletonCard variant="inquiry" count={cardsPerColumn} />
        </div>
      ))}
    </div>
  );
}

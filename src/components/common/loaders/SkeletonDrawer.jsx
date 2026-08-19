import SkeletonBone from './SkeletonBone.jsx';

export default function SkeletonDrawer({ className = '' }) {
  return (
    <div className={`flex h-full flex-col gap-6 p-5 sm:p-6 ${className}`} aria-busy="true" aria-label="Loading details">
      <div className="flex items-start gap-4">
        <SkeletonBone className="h-12 w-12 shrink-0 rounded-full" rounded="rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBone className="h-6 w-48 max-w-full" />
          <SkeletonBone className="h-4 w-32 max-w-full" />
          <SkeletonBone className="h-4 w-40 max-w-full" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBone key={index} className="h-10 w-full rounded-xl" rounded="rounded-xl" />
        ))}
      </div>

      <div className="space-y-2">
        <SkeletonBone className="h-4 w-24" />
        <SkeletonBone className="h-24 w-full rounded-2xl" rounded="rounded-2xl" />
      </div>

      <div className="space-y-3">
        <SkeletonBone className="h-4 w-20" />
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBone key={index} className="h-14 w-full rounded-xl" rounded="rounded-xl" />
        ))}
      </div>
    </div>
  );
}

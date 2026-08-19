import SkeletonBone from './SkeletonBone.jsx';

function SkeletonTableCell({ withAvatar = false, lines = 1 }) {
  if (withAvatar) {
    return (
      <div className="flex items-center gap-3">
        <SkeletonBone className="h-10 w-10 shrink-0 rounded-full" rounded="rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBone className="h-4 w-32 max-w-full" />
          <SkeletonBone className="h-3 w-24 max-w-full" />
        </div>
      </div>
    );
  }

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonBone key={index} className={`h-3.5 ${index === 0 ? 'w-full' : 'w-4/5'}`} />
        ))}
      </div>
    );
  }

  return <SkeletonBone className="h-4 w-24 max-w-full" />;
}

function SkeletonMobileCard({ withAvatar = true }) {
  return (
    <li className="p-4">
      <div className="flex items-start justify-between gap-3">
        {withAvatar ? (
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <SkeletonBone className="h-10 w-10 shrink-0 rounded-full" rounded="rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBone className="h-4 w-36 max-w-full" />
              <SkeletonBone className="h-3 w-28 max-w-full" />
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonBone className="h-4 w-36 max-w-full" />
            <SkeletonBone className="h-3 w-28 max-w-full" />
          </div>
        )}
        {withAvatar ? (
          <div className="flex gap-1.5">
            <SkeletonBone className="h-8 w-8 rounded-xl" rounded="rounded-xl" />
            <SkeletonBone className="h-8 w-8 rounded-xl" rounded="rounded-xl" />
          </div>
        ) : null}
      </div>
      <SkeletonBone className="mt-3 h-12 w-full" />
    </li>
  );
}

export default function SkeletonTable({
  columns = [],
  rows = 5,
  showActions = true,
  minWidth = 'min-w-[720px]',
  mobileCards = true,
  mobileWithAvatar = true,
  className = '',
}) {
  const resolvedColumns =
    columns.length > 0
      ? columns
      : Array.from({ length: 4 }).map(() => ({ label: '', width: '' }));

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 ${className}`}
      aria-busy="true"
      aria-label="Loading table"
    >
      {mobileCards ? (
        <ul className="divide-y divide-slate-100 md:hidden">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonMobileCard key={index} withAvatar={mobileWithAvatar} />
          ))}
        </ul>
      ) : null}

      <div className={`hidden overflow-x-auto md:block ${mobileCards ? '' : 'block'}`}>
        <table className={`w-full border-collapse text-left ${minWidth}`}>
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {resolvedColumns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`px-3 py-3.5 font-semibold first:px-5 last:px-5 ${column.width || ''} ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {column.label || <SkeletonBone className="h-3 w-16" />}
                </th>
              ))}
              {showActions ? (
                <th className="w-28 px-5 py-3.5 text-right font-semibold">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {resolvedColumns.map((column, colIndex) => (
                  <td
                    key={column.key || colIndex}
                    className={`px-3 py-4 align-top first:px-5 last:px-5 ${
                      column.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    <SkeletonTableCell
                      withAvatar={column.withAvatar}
                      lines={column.lines || 1}
                    />
                  </td>
                ))}
                {showActions ? (
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center justify-end gap-1.5">
                      <SkeletonBone className="h-8 w-8 rounded-xl" rounded="rounded-xl" />
                      <SkeletonBone className="h-8 w-8 rounded-xl" rounded="rounded-xl" />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

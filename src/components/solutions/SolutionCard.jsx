import { Edit2, Eye, Trash2 } from 'lucide-react';
import { resolveUploadUrl } from '../../utils/media.js';

export default function SolutionCard({ solution, onView, onEdit, onDelete }) {
  const imageUrl = resolveUploadUrl(solution.image?.url);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div 
        className="aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onView?.(solution)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={solution.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5">
      

        <h3 
          className="text-lg font-bold text-slate-900 cursor-pointer hover:text-[#2563EB] transition-colors"
          onClick={() => onView?.(solution)}
        >
          {solution.name}
        </h3>

        {solution.tagline ? (
          <p className="mt-1 text-sm font-medium text-slate-500">{solution.tagline}</p>
        ) : null}

        {solution.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{solution.description}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-x-2 text-xs text-slate-500">
          <span>
            {solution.benefits?.length
              ? `${solution.benefits.length} benefit${solution.benefits.length !== 1 ? 's' : ''}`
              : 'No benefits'}
          </span>
          {solution.features?.length ? (
            <span>· {solution.features.length} feature{solution.features.length !== 1 ? 's' : ''}</span>
          ) : null}
          {solution.stats?.length ? (
            <span>· {solution.stats.length} stat{solution.stats.length !== 1 ? 's' : ''}</span>
          ) : null}
        </div>

        {(onView || onEdit || onDelete) && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            {onView ? (
              <button
                type="button"
                onClick={() => onView(solution)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Eye size={14} />
                View
              </button>
            ) : null}
            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(solution)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Edit2 size={14} />
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(solution)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

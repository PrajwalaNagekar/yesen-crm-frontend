import { Edit2, Eye, Trash2 } from 'lucide-react';

export default function ProductCard({ product, onView, onEdit, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Product Image */}
      <div 
        className="aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onView?.(product)}
      >
        {product.image?.url ? (
          <img
            src={product.image.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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

      {/* Product Info */}
      <div className="p-5">
    

        {/* Product Name */}
        <h3 
          className="text-lg font-bold text-slate-900 cursor-pointer hover:text-[#2563EB] transition-colors"
          onClick={() => onView?.(product)}
        >
          {product.name}
        </h3>

        {/* Description 1 */}
        {product.description1 && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {product.description1}
          </p>
        )}

        {/* Benefits Count */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="mt-3 text-xs text-slate-500">
            {product.benefits.length} benefit{product.benefits.length !== 1 ? 's' : ''}
            {product.features && product.features.length > 0 && (
              <span> · {product.features.length} feature{product.features.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {(onView || onEdit || onDelete) && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            {onView && (
              <button
                type="button"
                onClick={() => onView(product)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Eye size={14} />
                View
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import Button from '../common/Button.jsx';
import { Plus } from 'lucide-react';
import { PROJECT_FILTER_OPTIONS } from '../../utils/projectStatus.js';

export default function ProjectStatusFilters({ value, onChange, onAdd, canAdd = true }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {PROJECT_FILTER_OPTIONS.map((status) => {
          const isActive = value === status.value;
          return (
            <button
              key={status.value}
              type="button"
              onClick={() => onChange(status.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                  : 'border border-slate-200/80 bg-white text-slate-600 shadow-sm hover:border-blue-200 hover:bg-blue-50/50 hover:text-[#1d4ed8]'
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>

      {canAdd ? (
        <Button size="md" onClick={onAdd} className="shrink-0 sm:ml-auto">
          <Plus size={16} />
          Add project
        </Button>
      ) : null}
    </div>
  );
}

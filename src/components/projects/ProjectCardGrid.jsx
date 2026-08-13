import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { resolveUploadUrl } from '../../utils/media.js';

export default function ProjectCardGrid({ projects, onEdit, onDelete }) {
  if (!projects?.length) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const imageSrc = resolveUploadUrl(project.imageUrl);

        return (
          <article
            key={project._id}
            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={project.name || 'Project'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                  No image
                </div>
              )}
              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onEdit(project)}
                  className="rounded-xl border border-white/80 bg-white/95 p-2 text-slate-600 shadow-md transition-colors hover:text-[#2563EB]"
                  aria-label={`Edit ${project.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  className="rounded-xl border border-white/80 bg-white/95 p-2 text-slate-600 shadow-md transition-colors hover:text-red-600"
                  aria-label={`Delete ${project.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div>
                <h3 className="line-clamp-1 font-display text-lg font-bold text-slate-900">
                  {project.name || 'Untitled project'}
                </h3>
                {project.location ? (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </p>
                ) : null}
              </div>

              {project.description ? (
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {project.type ? (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1d4ed8] ring-1 ring-blue-100">
                    {project.type}
                  </span>
                ) : null}
                {project.deployed ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    {project.deployed}
                  </span>
                ) : null}
                {project.technology ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {project.technology}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

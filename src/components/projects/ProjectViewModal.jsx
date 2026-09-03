import { MapPin, Pencil, Trash2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import { resolveUploadUrl } from '../../utils/media.js';
import { getProjectStatusLabel, getProjectStatusStyle } from '../../utils/projectStatus.js';

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

export default function ProjectViewModal({ project, onClose, onEdit, onDelete }) {
  if (!project) return null;

  const imageSrc = resolveUploadUrl(project.imageUrl);

  return (
    <Modal
      open={Boolean(project)}
      onClose={onClose}
      title={project.name || 'Project details'}
      description={project.location ? undefined : 'View project information'}
      size="lg"
    >
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
          <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-blue-50">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={project.name || 'Project'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                No image
              </div>
            )}
            <div className="absolute left-3 top-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getProjectStatusStyle(
                  project.status
                )}`}
              >
                {getProjectStatusLabel(project.status)}
              </span>
            </div>
          </div>
        </div>

        {project.location ? (
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={16} className="shrink-0 text-slate-400" />
            <span>{project.location}</span>
          </p>
        ) : null}

        {project.description ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{project.description}</p>
          </div>
        ) : null}

        {project.sitePhotography?.length ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Site photography</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.sitePhotography.map((url, index) => {
                const src = resolveUploadUrl(url);
                if (!src) return null;
                return (
                  <div
                    key={`${url}-${index}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={src}
                      alt={`${project.name || 'Project'} site photo ${index + 1}`}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2">
          <DetailField label="Type" value={project.type} />
          <DetailField label="Deployed" value={project.deployed} />
          <DetailField label="Technology" value={project.technology} />
          <DetailField label="Status" value={getProjectStatusLabel(project.status)} />
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          {onEdit ? (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                onClose?.();
                onEdit(project);
              }}
            >
              <Pencil size={16} />
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              type="button"
              variant="danger"
              className="flex-1"
              onClick={() => {
                onClose?.();
                onDelete(project);
              }}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

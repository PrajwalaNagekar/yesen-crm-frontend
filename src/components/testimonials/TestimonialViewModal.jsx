import { Pencil, Trash2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import { formatRelativeTime } from '../../utils/format.js';

export default function TestimonialViewModal({
  testimonial,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!testimonial) return null;

  return (
    <Modal
      open={Boolean(testimonial)}
      onClose={onClose}
      title={testimonial.name || 'Testimonial details'}
      description={testimonial.designation || 'Client testimonial'}
      size="lg"
    >
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{testimonial.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Designation
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {testimonial.designation || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{testimonial.location || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Added by</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{testimonial.addedBy || '—'}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Testimonial</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {testimonial.testimonial || '—'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span>
            Website: {testimonial.showOnWebsite ? 'Visible' : 'Hidden'}
          </span>
          {testimonial.addedAt ? (
            <span>Added {formatRelativeTime(testimonial.addedAt)}</span>
          ) : null}
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
                onEdit(testimonial);
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
                onDelete(testimonial);
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

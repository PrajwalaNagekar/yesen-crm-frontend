import { Pencil, Trash2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import { resolveUploadUrl } from '../../utils/media.js';

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

export default function ProductViewModal({ product, onClose, onEdit, onDelete }) {
  if (!product) return null;

  const imageSrc = resolveUploadUrl(product.image?.url);

  return (
    <Modal
      open={Boolean(product)}
      onClose={onClose}
      title={product.name || 'Product details'}
      description={product.label || 'View product information'}
      size="lg"
    >
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
          <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-blue-50">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name || 'Product'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                No image
              </div>
            )}
          </div>
        </div>

        {product.label ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Label</p>
            <p className="mt-1 text-sm font-medium text-slate-600">{product.label}</p>
          </div>
        ) : null}

        {product.description1 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{product.description1}</p>
          </div>
        ) : null}

        {product.description2 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Additional Details</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{product.description2}</p>
          </div>
        ) : null}

        {product.benefits && product.benefits.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Benefits</p>
            <div className="mt-2 space-y-3">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="rounded-lg border border-slate-100 bg-white p-3">
                  {benefit.heading ? (
                    <p className="text-sm font-semibold text-slate-900">{benefit.heading}</p>
                  ) : null}
                  {benefit.title ? (
                    <p className="mt-1 text-sm text-slate-600">{benefit.title}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {product.features && product.features.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Features</p>
            <ul className="mt-2 space-y-1.5">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
                onEdit(product);
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
                onDelete(product);
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

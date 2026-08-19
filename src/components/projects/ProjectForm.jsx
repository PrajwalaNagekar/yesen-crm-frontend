import { useEffect, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import { PROJECT_STATUSES } from '../../utils/projectStatus.js';
import Textarea from '../common/Textarea.jsx';
import Button from '../common/Button.jsx';
import { useCreateProject, useUpdateProject } from '../../hooks/useProjects.js';
import { useToast } from '../../context/ToastContext.jsx';
import { resolveUploadUrl } from '../../utils/media.js';

const EMPTY_FORM = {
  name: '',
  description: '',
  location: '',
  type: '',
  deployed: '',
  technology: '',
  status: 'ongoing',
};

export default function ProjectForm({ project, defaultStatus = 'ongoing', onClose, onSuccess }) {
  const toast = useToast();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isEdit = Boolean(project?._id);

  const [form, setForm] = useState(() =>
    project
      ? {
          name: project.name ?? '',
          description: project.description ?? '',
          location: project.location ?? '',
          type: project.type ?? '',
          deployed: project.deployed ?? '',
          technology: project.technology ?? '',
          status: project.status ?? 'ongoing',
        }
      : { ...EMPTY_FORM, status: defaultStatus }
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() =>
    project?.imageUrl ? resolveUploadUrl(project.imageUrl) : null
  );

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  }

  function clearImage() {
    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(isEdit && project?.imageUrl ? resolveUploadUrl(project.imageUrl) : null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const mutation = isEdit ? updateProject : createProject;
    const payload = isEdit
      ? { id: project._id, fields: form, imageFile }
      : { fields: form, imageFile };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(isEdit ? 'Project updated' : 'Project created');
        onSuccess?.();
        onClose?.();
      },
      onError: (err) => toast.error(err.message || 'Could not save project'),
    });
  }

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <Input
          label="Location"
          name="location"
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
        />
        <Input
          label="Type"
          name="type"
          value={form.type}
          onChange={(e) => update('type', e.target.value)}
        />
        <Input
          label="Deployed"
          name="deployed"
          value={form.deployed}
          onChange={(e) => update('deployed', e.target.value)}
        />
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={(e) => update('status', e.target.value)}
        >
          {PROJECT_STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2">
          <Input
            label="Technology"
            name="technology"
            value={form.technology}
            onChange={(e) => update('technology', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Textarea
            label="Description"
            name="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold tracking-tight text-brand-900">Image</p>
        {imagePreview ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 shadow-sm">
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              <img src={imagePreview} alt="Project preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-500 shadow-md transition-colors hover:bg-white hover:text-red-600"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
              <p className="truncate text-xs text-slate-500">
                {imageFile?.name || project?.image?.originalName || 'Current project image'}
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-[#2563EB]">
                <Upload size={14} />
                Replace
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center transition-colors hover:border-[#2563EB]/40 hover:bg-blue-50/30">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-sm ring-1 ring-blue-100">
              <ImagePlus size={22} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-700">Upload project image</p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP, or GIF</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>

      <div className="flex gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </form>
  );
}

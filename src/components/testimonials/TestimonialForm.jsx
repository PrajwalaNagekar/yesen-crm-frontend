import { useState } from 'react';
import Input from '../common/Input.jsx';
import Textarea from '../common/Textarea.jsx';
import Button from '../common/Button.jsx';
import { useCreateTestimonial, useUpdateTestimonial } from '../../hooks/useTestimonials.js';
import { useToast } from '../../context/ToastContext.jsx';

const EMPTY_FORM = {
  name: '',
  testimonial: '',
  designation: '',
  location: '',
};

export default function TestimonialForm({ testimonial, onClose, onSuccess }) {
  const toast = useToast();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const isEdit = Boolean(testimonial?._id);

  const [form, setForm] = useState(() =>
    testimonial
      ? {
          name: testimonial.name ?? '',
          testimonial: testimonial.testimonial ?? '',
          designation: testimonial.designation ?? '',
          location: testimonial.location ?? '',
        }
      : EMPTY_FORM
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const mutation = isEdit ? updateTestimonial : createTestimonial;
    const payload = isEdit ? { id: testimonial._id, updates: form } : form;

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(isEdit ? 'Testimonial updated' : 'Testimonial created');
        onSuccess?.();
        onClose?.();
      },
      onError: (err) => toast.error(err.message || 'Could not save testimonial'),
    });
  }

  const isPending = createTestimonial.isPending || updateTestimonial.isPending;

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
          label="Designation"
          name="designation"
          value={form.designation}
          onChange={(e) => update('designation', e.target.value)}
        />
        <div className="sm:col-span-2">
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Textarea
            label="Testimonial"
            name="testimonial"
            rows={5}
            value={form.testimonial}
            onChange={(e) => update('testimonial', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Add testimonial'}
        </Button>
      </div>
    </form>
  );
}

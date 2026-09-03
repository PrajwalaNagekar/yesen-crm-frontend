import { useEffect, useState } from 'react';
import { ImagePlus, Upload, X, Plus, Trash2 } from 'lucide-react';
import Input from '../common/Input.jsx';
import Textarea from '../common/Textarea.jsx';
import Button from '../common/Button.jsx';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts.js';
import { useToast } from '../../context/ToastContext.jsx';
import { resolveUploadUrl } from '../../utils/media.js';

const EMPTY_FORM = {
  name: '',
  label: '',
  description1: '',
  description2: '',
  benefits: [],
  features: [],
};

export default function ProductForm({ product, onClose, onSuccess }) {
  const toast = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEdit = Boolean(product?._id);

  const [form, setForm] = useState(() =>
    product
      ? {
          name: product.name ?? '',
          label: product.label ?? '',
          description1: product.description1 ?? '',
          description2: product.description2 ?? '',
          benefits: product.benefits ?? [],
          features: product.features ?? [],
        }
      : EMPTY_FORM
  );
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() =>
    product?.image?.url ? resolveUploadUrl(product.image.url) : null
  );

  const [newBenefitHeading, setNewBenefitHeading] = useState('');
  const [newBenefitTitle, setNewBenefitTitle] = useState('');
  const [newFeature, setNewFeature] = useState('');

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
    setImagePreview(isEdit && product?.image?.url ? resolveUploadUrl(product.image.url) : null);
  }

  function addBenefit() {
    if (!newBenefitHeading.trim() && !newBenefitTitle.trim()) return;
    setForm((current) => ({
      ...current,
      benefits: [...current.benefits, { heading: newBenefitHeading.trim(), title: newBenefitTitle.trim() }],
    }));
    setNewBenefitHeading('');
    setNewBenefitTitle('');
  }

  function removeBenefit(index) {
    setForm((current) => ({
      ...current,
      benefits: current.benefits.filter((_, i) => i !== index),
    }));
  }

  function addFeature() {
    if (!newFeature.trim()) return;
    setForm((current) => ({
      ...current,
      features: [...current.features, newFeature.trim()],
    }));
    setNewFeature('');
  }

  function removeFeature(index) {
    setForm((current) => ({
      ...current,
      features: current.features.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isEdit && !imageFile) {
      toast.error('Product image is required');
      return;
    }

    const mutation = isEdit ? updateProduct : createProduct;
    const payload = isEdit
      ? { id: product._id, fields: form, imageFile }
      : { fields: form, imageFile };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(isEdit ? 'Product updated' : 'Product created');
        onSuccess?.();
        onClose?.();
      },
      onError: (err) => toast.error(err.message || 'Could not save product'),
    });
  }

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Product Name"
          name="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g., E-MARINE"
        />
        <Input
          label="Label"
          name="label"
          required
          value={form.label}
          onChange={(e) => update('label', e.target.value)}
          placeholder="e.g., Marine Electronics"
        />
      </div>

      <Textarea
        label="Description 1"
        name="description1"
        rows={3}
        required
        value={form.description1}
        onChange={(e) => update('description1', e.target.value)}
        placeholder="Main product description"
      />

      <Textarea
        label="Description 2 (Optional)"
        name="description2"
        rows={3}
        value={form.description2}
        onChange={(e) => update('description2', e.target.value)}
        placeholder="Additional product description"
      />

      {/* Benefits */}
      <div>
        <label className="mb-2 block text-sm font-semibold tracking-tight text-brand-900">
          Benefits
        </label>
        <div className="space-y-2">
          {form.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div className="flex-1">
                {benefit.heading && (
                  <p className="text-xs font-semibold text-slate-900">{benefit.heading}</p>
                )}
                {benefit.title && (
                  <p className="text-sm text-slate-700">{benefit.title}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="mt-1 text-slate-400 transition-colors hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
            <input
              type="text"
              value={newBenefitHeading}
              onChange={(e) => setNewBenefitHeading(e.target.value)}
              placeholder="Benefit heading (optional)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newBenefitTitle}
              onChange={(e) => setNewBenefitTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              placeholder="Benefit title (optional)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <Plus size={16} />
              Add Benefit
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="mb-2 block text-sm font-semibold tracking-tight text-brand-900">
          Features
        </label>
        <div className="space-y-2">
          {form.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="flex-1 text-sm text-slate-700">{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-slate-400 transition-colors hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="Add a feature"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <p className="mb-2 text-sm font-semibold tracking-tight text-brand-900">
          Product Image <span className="ml-0.5 text-red-500">*</span>
        </p>
        {imagePreview ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 shadow-sm">
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
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
                {imageFile?.name || product?.image?.originalName || 'Current product image'}
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
              <p className="text-sm font-semibold text-slate-700">Upload product image</p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, or JPEG</p>
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
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </form>
  );
}

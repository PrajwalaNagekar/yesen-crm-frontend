import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Textarea from '../common/Textarea.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import { useCreateIntake } from '../../hooks/useIntake.js';
import { useToast } from '../../context/ToastContext.jsx';

const VESSEL_TYPES = ['Ferry', 'Tour boat', 'House boat', 'Trawler', 'Yatch', 'Workboat', 'Patrol boat', 'other'];
const RETROFIT_STATUSES = ['retrofit existing', 'new build', 'not decided yet'];

const INTAKE_CONFIG = {
  product: {
    title: 'Add product inquiry',
    description: 'Creates a new inquiry from a product lead.',
    productLabel: 'Product name',
    productRequired: true,
  },
  service: {
    title: 'Add service inquiry',
    description: 'Creates a new inquiry from a service lead.',
    productLabel: 'Service name',
    productRequired: true,
  },
  contact: {
    title: 'Add contact inquiry',
    description: 'Creates a new inquiry from a general contact.',
    productLabel: 'Product or service (optional)',
    productRequired: false,
  },
};

const EMPTY_FORM = {
  clientName: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  productOrServiceName: '',
  sourcePage: 'CRM',
  value: '',
  vesselType: '',
  retrofitStatus: '',
  vesselLength: '',
  operatingArea: '',
  dailyOperatingHours: '',
  timeLine: '',
};

function buildPayload(form, type) {
  const payload = {
    clientName: form.clientName.trim(),
    email: form.email.trim() || undefined,
    phone: form.phone.trim() || undefined,
    company: form.company.trim(),
    message: form.message.trim(),
    sourcePage: form.sourcePage.trim() || 'CRM',
    vesselType: form.vesselType || undefined,
    retrofitStatus: form.retrofitStatus || undefined,
    vesselLength: form.vesselLength.trim() || undefined,
    operatingArea: form.operatingArea.trim() || undefined,
    dailyOperatingHours: form.dailyOperatingHours.trim() || undefined,
    timeLine: form.timeLine.trim() || undefined,
  };

  const productName = form.productOrServiceName.trim();
  if (productName || type !== 'contact') {
    payload.productOrServiceName = productName;
  }

  const value = form.value.trim();
  if (value !== '') {
    payload.value = Number(value);
  }

  return payload;
}

export default function IntakeFormModal({ type, open, onClose, onSuccess }) {
  const toast = useToast();
  const createIntake = useCreateIntake();
  const config = INTAKE_CONFIG[type] || INTAKE_CONFIG.contact;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setErrors({});
  }, [open, type]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.clientName.trim()) next.clientName = 'Client name is required';
    if (!form.email.trim() && !form.phone.trim()) {
      next.email = 'Email or phone is required';
      next.phone = 'Email or phone is required';
    }
    if (config.productRequired && !form.productOrServiceName.trim()) {
      next.productOrServiceName = `${config.productLabel} is required`;
    }
    if (form.value.trim() !== '' && Number.isNaN(Number(form.value))) {
      next.value = 'Enter a valid number';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    createIntake.mutate(
      { type, payload: buildPayload(form, type) },
      {
        onSuccess: (data) => {
          toast.success('Inquiry created');
          onSuccess?.(data?.inquiry);
          onClose?.();
        },
        onError: (err) => toast.error(err.message || 'Could not create inquiry'),
      }
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={config.title}
      description={config.description}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Client name"
            name="clientName"
            value={form.clientName}
            onChange={(e) => update('clientName', e.target.value)}
            error={errors.clientName}
            className="sm:col-span-2"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            error={errors.phone}
          />
          <Input
            label="Company"
            name="company"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
          />
          <Input
            label={config.productLabel}
            name="productOrServiceName"
            value={form.productOrServiceName}
            onChange={(e) => update('productOrServiceName', e.target.value)}
            error={errors.productOrServiceName}
          />
          <Input
            label="Estimated value"
            name="value"
            type="number"
            min="0"
            step="any"
            value={form.value}
            onChange={(e) => update('value', e.target.value)}
            error={errors.value}
          />
          <Select
            label="Vessel type"
            name="vesselType"
            value={form.vesselType}
            onChange={(e) => update('vesselType', e.target.value)}
          >
            <option value="">Select vessel type</option>
            {VESSEL_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select
            label="Retrofit status"
            name="retrofitStatus"
            value={form.retrofitStatus}
            onChange={(e) => update('retrofitStatus', e.target.value)}
          >
            <option value="">Select retrofit status</option>
            {RETROFIT_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Input
            label="Vessel length"
            name="vesselLength"
            value={form.vesselLength}
            onChange={(e) => update('vesselLength', e.target.value)}
          />
          <Input
            label="Operating area"
            name="operatingArea"
            value={form.operatingArea}
            onChange={(e) => update('operatingArea', e.target.value)}
          />
          <Input
            label="Daily operating hours"
            name="dailyOperatingHours"
            value={form.dailyOperatingHours}
            onChange={(e) => update('dailyOperatingHours', e.target.value)}
          />
          <Input
            label="Timeline"
            name="timeLine"
            value={form.timeLine}
            onChange={(e) => update('timeLine', e.target.value)}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Message"
              name="message"
              rows={4}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={createIntake.isPending}>
            {createIntake.isPending ? 'Creating…' : 'Create inquiry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

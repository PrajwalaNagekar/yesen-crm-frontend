export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

// Small relative-time formatter (no date-fns dependency needed for this).
export function formatRelativeTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const SOURCE_LABELS = {
  product: 'Product page',
  service: 'Service page',
  contact: 'Contact page',
};

export const STAGE_META = {
  Inquired: {
    label: 'Inquired',
    subtitle: 'New from website forms',
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-800 ring-sky-200',
    border: 'border-sky-200',
  },
  Contacted: {
    label: 'Contacted',
    subtitle: 'First reply sent',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-800 ring-blue-200',
    border: 'border-blue-200',
  },
  'Quotation Provided': {
    label: 'Quotation Provided',
    subtitle: 'Quote shared with client',
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
    border: 'border-indigo-200',
  },
  Negotiation: {
    label: 'Negotiation',
    subtitle: 'Terms being discussed',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-900 ring-amber-200',
    border: 'border-amber-200',
  },
  Completed: {
    label: 'Completed',
    subtitle: 'Deal won',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    border: 'border-emerald-200',
  },
  Lost: {
    label: 'Lost',
    subtitle: 'Did not proceed',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
    border: 'border-slate-200',
  },
};

export function getAssigneeName(assignedTo) {
  if (!assignedTo) return null;
  if (typeof assignedTo === 'string') return null;
  return assignedTo.name || assignedTo.username || null;
}

export function getAssigneeId(assignedTo) {
  if (!assignedTo) return null;
  if (typeof assignedTo === 'string') return assignedTo;
  return assignedTo._id || assignedTo.id || null;
}

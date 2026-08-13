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
    dot: 'bg-sky-400',
    badge: 'text-sky-600',
    border: 'border-sky-100',
    columnBg: 'bg-[#E8EEF6]/70',
    cardBg: 'bg-white',
    tagTone: 'pill',
  },
  Contacted: {
    label: 'Contacted',
    subtitle: 'First reply sent',
    dot: 'bg-blue-500',
    badge: 'text-blue-600',
    border: 'border-blue-100',
    columnBg: 'bg-[#E8EEF6]/70',
    cardBg: 'bg-white',
    tagTone: 'pill',
  },
  'Quotation Provided': {
    label: 'Quotation Provided',
    subtitle: 'Quote shared with client',
    dot: 'bg-indigo-500',
    badge: 'text-indigo-600',
    border: 'border-indigo-100',
    columnBg: 'bg-[#E8EEF6]/70',
    cardBg: 'bg-white',
    tagTone: 'pill',
  },
  Negotiation: {
    label: 'Negotiation',
    subtitle: 'Terms being discussed',
    dot: 'bg-teal-500',
    badge: 'text-teal-600',
    border: 'border-teal-100',
    columnBg: 'bg-[#E8EEF6]/70',
    cardBg: 'bg-white',
    tagTone: 'pill',
  },
  Completed: {
    label: 'Completed',
    subtitle: 'Deal won',
    dot: 'bg-emerald-500',
    badge: 'text-emerald-600',
    border: 'border-emerald-100',
    columnBg: 'bg-[#E8EEF6]/70',
    cardBg: 'bg-white',
    tagTone: 'pill',
  },
  Lost: {
    label: 'Lost',
    subtitle: 'Did not proceed',
    dot: 'bg-rose-400',
    badge: 'text-rose-600',
    border: 'border-rose-100',
    columnBg: 'bg-rose-50/50',
    cardBg: 'bg-white',
    tagTone: 'rose',
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

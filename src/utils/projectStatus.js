export const PROJECT_STATUSES = [
  { value: 'live', label: 'Live' },
  { value: 'ongoing', label: 'On going' },
  { value: 'completed', label: 'Completed' },
];

export const PROJECT_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...PROJECT_STATUSES,
];

export const PROJECT_STATUS_LABELS = Object.fromEntries(
  PROJECT_STATUSES.map(({ value, label }) => [value, label])
);

export const PROJECT_FILTER_LABELS = Object.fromEntries(
  PROJECT_FILTER_OPTIONS.map(({ value, label }) => [value, label])
);

export const PROJECT_STATUS_STYLES = {
  live: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  ongoing: 'bg-blue-50 text-[#1d4ed8] ring-blue-100',
  completed: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function getProjectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] || PROJECT_STATUS_LABELS.ongoing;
}

export function getProjectFilterLabel(filter) {
  return PROJECT_FILTER_LABELS[filter] || PROJECT_FILTER_LABELS.all;
}

export function getProjectStatusStyle(status) {
  return PROJECT_STATUS_STYLES[status] || PROJECT_STATUS_STYLES.ongoing;
}

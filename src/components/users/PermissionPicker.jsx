import { Check, ShieldCheck } from 'lucide-react';
import { ALL_PERMISSIONS, PERMISSION_GROUPS, isAdminRole } from '../../utils/permissions.js';
import { applyPermissionToggle } from '../../utils/permissionToggle.js';

function PermissionCheckbox({ id, label, checked, disabled, onChange }) {
  function handleToggle(e) {
    if (disabled) return;
    e.preventDefault();
    onChange(!checked);
  }

  return (
    <label
      htmlFor={id}
      onClick={handleToggle}
      className={`group flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
        disabled
          ? 'cursor-default border-slate-200 bg-slate-50/80'
          : checked
            ? 'border-brand-200 bg-brand-50/50 hover:bg-brand-50'
            : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50/80'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-slate-300 bg-white text-transparent group-hover:border-brand-300'
        } ${disabled ? 'opacity-70' : ''}`}
      >
        <Check size={12} strokeWidth={3} />
      </span>
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        readOnly
        tabIndex={-1}
      />
      <span className={`text-sm font-medium ${disabled ? 'text-slate-600' : 'text-brand-900'}`}>{label}</span>
    </label>
  );
}

export default function PermissionPicker({ role, value = [], onChange, idPrefix = 'perm' }) {
  const admin = isAdminRole(role);
  const selected = admin ? ALL_PERMISSIONS : value;

  function toggle(permission, checked) {
    if (admin) return;
    onChange(applyPermissionToggle(value, permission, checked));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight text-brand-900">Permissions</h3>
        {admin ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
            <ShieldCheck size={12} />
            Full access
          </span>
        ) : null}
      </div>

      {admin ? (
        <p className="rounded-xl border border-brand-100 bg-brand-50/60 px-3.5 py-2.5 text-sm text-brand-800">
          Administrators automatically have all permissions.
        </p>
      ) : null}

      <div className="space-y-5">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.module}>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <div className="space-y-2">
              {group.permissions.map((permission) => (
                <PermissionCheckbox
                  key={permission.key}
                  id={`${idPrefix}-${permission.key}`}
                  label={permission.label}
                  checked={selected.includes(permission.key)}
                  disabled={admin}
                  onChange={(checked) => toggle(permission.key, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

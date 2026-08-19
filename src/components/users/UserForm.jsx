import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import PermissionPicker from './PermissionPicker.jsx';
import ActiveToggle from './ActiveToggle.jsx';
import { useCreateUser } from '../../hooks/useUsers.js';
import { isAdminRole } from '../../utils/permissions.js';

const initialForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'staff',
  active: true,
  permissions: [],
};

export default function UserForm({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const createUser = useCreateUser();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!/^[a-z0-9]{3,30}$/i.test(form.username)) {
      next.username = 'Username must be 3-30 letters/numbers, no spaces';
    }
    if (form.password.length < 8) next.password = 'Minimum 8 characters';
    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const role = form.role.trim().toLowerCase();
    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role,
      active: isAdminRole(role) ? true : form.active,
      permissions: isAdminRole(role) ? [] : form.permissions,
    };

    createUser.mutate(payload, {
      onSuccess: () => {
        setForm(initialForm);
        setErrors({});
        onSuccess?.();
        onClose?.();
      },
      onError: (err) => {
        setErrors({ form: err.message });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6">
      <div className="space-y-4">
        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={(e) => update('username', e.target.value)}
          error={errors.username}
          placeholder="e.g. amalfrancis"
          autoComplete="off"
        />
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
          placeholder="Jane Doe"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
          placeholder="jane@company.com"
          autoComplete="email"
        />
        <Input
          label="Temporary password"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
        />
        <Input
          label="Role"
          name="role"
          value={form.role}
          onChange={(e) => {
            const role = e.target.value;
            setForm((f) => ({
              ...f,
              role,
              active: isAdminRole(role) ? true : f.active,
            }));
          }}
          error={errors.role}
          placeholder="e.g. staff or admin"
          autoComplete="off"
        />

        {isAdminRole(form.role) ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-3.5">
            <p className="text-sm font-semibold text-slate-900">Account status</p>
            <p className="mt-0.5 text-xs text-slate-500">Admin accounts are always created active.</p>
          </div>
        ) : (
          <ActiveToggle
            id="create-active"
            active={form.active}
            onChange={(active) => update('active', active)}
          />
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
        <PermissionPicker
          idPrefix="create"
          role={form.role}
          value={form.permissions}
          onChange={(permissions) => update('permissions', permissions)}
        />
      </div>

      {errors.form ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {errors.form}
        </div>
      ) : null}

      <div className="mt-6 flex gap-3">
        {onClose ? (
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" size="lg" className="flex-1" disabled={createUser.isPending}>
          {createUser.isPending ? 'Creating…' : 'Create account'}
        </Button>
      </div>
    </form>
  );
}

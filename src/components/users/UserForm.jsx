import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import PermissionPicker from './PermissionPicker.jsx';
import ActiveToggle from './ActiveToggle.jsx';
import { useCreateUser } from '../../hooks/useUsers.js';
import { isAdminRole } from '../../utils/permissions.js';

const initialForm = {
  name: '',
  username: '',
  password: '',
  role: 'staff',
  active: true,
  permissions: [],
};

export default function UserForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(false);
  const createUser = useCreateUser();

  function update(field, value) {
    setCreated(false);
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!/^[a-z0-9]{3,30}$/i.test(form.username)) {
      next.username = 'Username must be 3-30 letters/numbers, no spaces';
    }
    if (form.password.length < 8) next.password = 'Minimum 8 characters';

    // const role = form.role.trim().toLowerCase();
    // if (!role) next.role = 'Role is required';
    // else if (!['admin', 'staff'].includes(role)) {
    //   next.role = 'Use "admin" or "staff"';
    // }

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
      password: form.password,
      role,
      active: form.active,
      permissions: isAdminRole(role) ? [] : form.permissions,
    };

    createUser.mutate(payload, {
      onSuccess: () => {
        setForm(initialForm);
        setErrors({});
        setCreated(true);
      },
      onError: (err) => {
        setCreated(false);
        setErrors({ form: err.message });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card h-fit p-6 sm:p-7">
      <div className="mb-1 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <UserPlus size={18} />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-brand-900">Add a person</h2>
          <p className="text-sm text-slate-500">Create a login for a teammate.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
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
          onChange={(e) => update('role', e.target.value)}
          error={errors.role}
          placeholder="e.g. staff or admin"
          autoComplete="off"
        />

        <ActiveToggle
          id="create-active"
          active={form.active}
          onChange={(active) => update('active', active)}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
        <PermissionPicker
          idPrefix="create"
          role={form.role}
          value={form.permissions}
          onChange={(permissions) => update('permissions', permissions)}
        />
      </div>

      {errors.form && (
        <div className="mt-4 animate-fade-in rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {errors.form}
        </div>
      )}

      {created && (
        <div className="mt-4 animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700">
          Account created successfully.
        </div>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating…' : 'Create account'}
      </Button>
    </form>
  );
}

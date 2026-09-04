import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import PermissionPicker from './PermissionPicker.jsx';
import ActiveToggle from './ActiveToggle.jsx';
import { useCreateUser, useUpdateUser } from '../../hooks/useUsers.js';
import { useToast } from '../../context/ToastContext.jsx';
import { isAdminRole, normalizePermissions } from '../../utils/permissions.js';

const initialForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'staff',
  active: true,
  permissions: [],
};

function formFromUser(user) {
  return {
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    password: '',
    role: user.role || 'staff',
    active: user.active !== false,
    permissions: normalizePermissions(user.permissions),
  };
}

export default function UserForm({ user, onClose, onSuccess }) {
  const toast = useToast();
  const isEdit = Boolean(user?._id);
  const [form, setForm] = useState(() => (isEdit ? formFromUser(user) : initialForm));
  const [errors, setErrors] = useState({});
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isPending = createUser.isPending || updateUser.isPending;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!isEdit && !/^[a-z0-9]{3,30}$/i.test(form.username)) {
      next.username = 'Username must be 3-30 letters/numbers, no spaces';
    }
    if (!isEdit && form.password.length < 8) {
      next.password = 'Minimum 8 characters';
    }
    if (isEdit && form.password && form.password.length < 8) {
      next.password = 'Minimum 8 characters';
    }
    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address';
    }
    if (!form.role.trim()) next.role = 'Role is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const role = form.role.trim().toLowerCase();

    if (isEdit) {
      const updates = {
        name: form.name.trim(),
        email: form.email.trim(),
        role,
        active: isAdminRole(role) ? true : form.active,
        permissions: isAdminRole(role) ? [] : form.permissions,
      };
      if (form.password) updates.password = form.password;

      updateUser.mutate(
        { id: user._id, updates },
        {
          onSuccess: () => {
            toast.success('User updated');
            setErrors({});
            onSuccess?.();
            onClose?.();
          },
          onError: (err) => {
            setErrors({ form: err.message });
          },
        }
      );
      return;
    }

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
        toast.success('User created');
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
        {isEdit ? (
          <div>
            <Input
              label="Username"
              name="username"
              value={form.username}
              disabled
              readOnly
            />
            <p className="mt-1.5 text-xs text-slate-500">Username cannot be changed</p>
          </div>
        ) : (
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            error={errors.username}
            placeholder="e.g. amalfrancis"
            autoComplete="off"
          />
        )}
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
          label={isEdit ? 'New password (optional)' : 'Temporary password'}
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
          placeholder={isEdit ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
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
            <p className="mt-0.5 text-xs text-slate-500">Admin accounts are always active.</p>
          </div>
        ) : (
          <ActiveToggle
            id={isEdit ? `edit-active-${user._id}` : 'create-active'}
            active={form.active}
            onChange={(active) => update('active', active)}
          />
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
        <PermissionPicker
          idPrefix={isEdit ? `edit-${user._id}` : 'create'}
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
        <Button type="submit" size="lg" className="flex-1" disabled={isPending}>
          {isPending
            ? isEdit
              ? 'Saving…'
              : 'Creating…'
            : isEdit
              ? 'Save changes'
              : 'Create account'}
        </Button>
      </div>
    </form>
  );
}

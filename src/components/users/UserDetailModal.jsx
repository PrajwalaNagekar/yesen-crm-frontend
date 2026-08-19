import { useEffect, useState } from 'react';
import { ShieldCheck, Pencil } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import ActiveToggle from './ActiveToggle.jsx';
import PermissionPicker from './PermissionPicker.jsx';
import { useUpdateUser } from '../../hooks/useUsers.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  getUserPermissionGroups,
  isAdminRole,
  normalizePermissions,
} from '../../utils/permissions.js';

export default function UserDetailModal({ user, canUpdate, onClose, onRequestDelete }) {
  const toast = useToast();
  const updateUser = useUpdateUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    role: user?.role || 'staff',
    active: user?.active !== false,
    permissions: normalizePermissions(user?.permissions),
  });

  useEffect(() => {
    if (!user) return;
    setEditing(false);
    setForm({
      email: user.email || '',
      role: user.role || 'staff',
      active: user.active !== false,
      permissions: normalizePermissions(user.permissions),
    });
  }, [user?._id]);

  if (!user) return null;

  const isAdmin = isAdminRole(user.role);
  const permissionGroups = getUserPermissionGroups(user);

  function handleSave() {
    const role = form.role.trim().toLowerCase();
    updateUser.mutate(
      {
        id: user._id,
        updates: {
          email: form.email.trim(),
          role,
          active: isAdminRole(role) ? true : form.active,
          permissions: isAdminRole(role) ? [] : form.permissions,
        },
      },
      {
        onSuccess: () => {
          toast.success('User updated');
          setEditing(false);
          onClose();
        },
        onError: (err) => toast.error(err.message || 'Could not update user'),
      }
    );
  }

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title={editing ? 'Edit user access' : 'User details'}
      description={editing ? 'Update role, status, and permissions.' : `@${user.username}`}
      size="lg"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
          <Avatar name={user.name} size={52} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-bold text-slate-900">{user.name}</p>
            <p className="mt-0.5 text-sm text-slate-500">@{user.username}</p>
            {user.email ? (
              <p className="mt-0.5 truncate text-sm text-slate-500">{user.email}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${
                  isAdmin
                    ? 'bg-blue-50 text-[#1d4ed8] ring-blue-100'
                    : 'bg-slate-100 text-slate-600 ring-slate-200'
                }`}
              >
                {user.role}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
                  user.active !== false
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                    : 'bg-slate-100 text-slate-500 ring-slate-200'
                }`}
              >
                {user.active !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <Input
              label="Email"
              name={`modal-email-${user._id}`}
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jane@company.com"
              autoComplete="email"
            />
            <Input
              label="Role"
              name={`modal-role-${user._id}`}
              value={form.role}
              onChange={(e) => {
                const role = e.target.value;
                setForm((f) => ({
                  ...f,
                  role,
                  active: isAdminRole(role) ? true : f.active,
                }));
              }}
              placeholder="e.g. staff or admin"
            />

            {isAdminRole(form.role) ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-3.5">
                <p className="text-sm font-semibold text-slate-900">Account status</p>
                <p className="mt-0.5 text-xs text-slate-500">Admin accounts always stay active.</p>
              </div>
            ) : (
              <ActiveToggle
                id={`modal-active-${user._id}`}
                active={form.active}
                onChange={(active) => setForm((f) => ({ ...f, active }))}
              />
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <PermissionPicker
                idPrefix={`modal-${user._id}`}
                role={form.role}
                value={form.permissions}
                onChange={(permissions) => setForm((f) => ({ ...f, permissions }))}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button className="flex-1" disabled={updateUser.isPending} onClick={handleSave}>
                {updateUser.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <section className="mb-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Permissions
              </h3>
              {isAdmin ? (
                <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-[#1d4ed8]">
                  <ShieldCheck size={16} />
                  <span className="font-medium">Full access — all permissions granted</span>
                </div>
              ) : permissionGroups.length ? (
                <div className="space-y-4">
                  {permissionGroups.map((group) => (
                    <div key={group.module}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                        {group.label}
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {group.permissions.map((label) => (
                          <li
                            key={label}
                            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-500">
                  No permissions assigned.
                </p>
              )}
            </section>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Button variant="secondary" className="flex-1 sm:flex-none" onClick={onClose}>
                Close
              </Button>
              {canUpdate ? (
                <Button className="flex-1 sm:flex-none" onClick={() => setEditing(true)}>
                  <Pencil size={15} />
                  Edit access
                </Button>
              ) : null}
              {onRequestDelete ? (
                <Button variant="danger" className="flex-1 sm:flex-none" onClick={onRequestDelete}>
                  Delete user
                </Button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

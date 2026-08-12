import { useState } from 'react';
import Avatar from '../common/Avatar.jsx';
import EmptyState from '../common/EmptyState.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import PermissionPicker from './PermissionPicker.jsx';
import ActiveToggle from './ActiveToggle.jsx';
import { Users as UsersIcon, Pencil, Trash2, X } from 'lucide-react';
import { useDeleteUser, useUpdateUser } from '../../hooks/useUsers.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  PERMISSIONS,
  hasPermission,
  isAdminRole,
  normalizePermissions,
} from '../../utils/permissions.js';

function permissionSummary(user) {
  if (isAdminRole(user.role)) return 'All permissions';
  const count = normalizePermissions(user.permissions).length;
  return count ? `${count} permission${count === 1 ? '' : 's'}` : 'No permissions';
}

function UserEditPanel({ user, onClose }) {
  const updateUser = useUpdateUser();
  const [form, setForm] = useState({
    role: user.role || 'staff',
    active: user.active !== false,
    permissions: normalizePermissions(user.permissions),
  });

  function handleSave() {
    const role = form.role.trim().toLowerCase();
    updateUser.mutate(
      {
        id: user._id,
        updates: {
          role,
          active: form.active,
          permissions: isAdminRole(role) ? [] : form.permissions,
        },
      },
      { onSuccess: onClose }
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-brand-100 bg-brand-50/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-900">Edit access</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
          aria-label="Close edit panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <Input
          label="Role"
          name={`role-${user._id}`}
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          placeholder="e.g. staff or admin"
        />

        <ActiveToggle
          id={`edit-active-${user._id}`}
          active={form.active}
          onChange={(active) => setForm((f) => ({ ...f, active }))}
        />

        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <PermissionPicker
            idPrefix={`edit-${user._id}`}
            role={form.role}
            value={form.permissions}
            onChange={(permissions) => setForm((f) => ({ ...f, permissions }))}
          />
        </div>

        <Button
          type="button"
          size="sm"
          className="w-full"
          disabled={updateUser.isPending}
          onClick={handleSave}
        >
          {updateUser.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}

export default function UserList({ users }) {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const canUpdate = hasPermission(currentUser, PERMISSIONS.USERS_UPDATE);
  const canDelete = hasPermission(currentUser, PERMISSIONS.USERS_DELETE);

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteUser.mutate(
      { id: pendingDelete._id },
      {
        onSuccess: () => {
          toast.success(`${pendingDelete.name} was deleted`);
          if (editingId === pendingDelete._id) setEditingId(null);
          setPendingDelete(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Could not delete user');
          setPendingDelete(null);
        },
      }
    );
  }

  if (!users?.length) {
    return (
      <EmptyState
        icon={UsersIcon}
        title="No team members yet"
        description="Add the first person using the form on the left."
      />
    );
  }

  return (
    <>
      <div className="surface-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-brand-900">Team</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-border">
            {users.length} {users.length === 1 ? 'person' : 'people'}
          </span>
        </div>

        <ul className="divide-y divide-border">
          {users.map((user, i) => {
            const isEditing = editingId === user._id;
            const isSelf = String(currentUser?._id) === String(user._id);

            return (
              <li
                key={user._id}
                className={`py-3.5 first:pt-0 last:pb-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={user.name} size={40} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-900">
                        {user.name}
                        {isSelf ? (
                          <span className="ml-2 text-xs font-medium text-slate-400">(you)</span>
                        ) : null}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        @{user.username}
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span className="capitalize">{user.role}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{permissionSummary(user)}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {canUpdate ? (
                      <ActiveToggle
                        id={`list-active-${user._id}`}
                        compact
                        active={user.active !== false}
                        onChange={(active) => updateUser.mutate({ id: user._id, updates: { active } })}
                        disabled={updateUser.isPending}
                      />
                    ) : (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.active
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-slate-100 text-slate-500 ring-1 ring-border'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    )}

                    {canUpdate ? (
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : user._id)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-brand-700"
                        aria-label="Edit user access"
                        title="Edit role and permissions"
                      >
                        <Pencil size={15} />
                      </button>
                    ) : null}

                    {canDelete && !isSelf ? (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(user)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete user"
                        title="Delete user"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : null}
                  </div>
                </div>

                {isEditing ? <UserEditPanel user={user} onClose={() => setEditingId(null)} /> : null}
              </li>
            );
          })}
        </ul>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete user?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.name} (@${pendingDelete.username})? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteUser.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

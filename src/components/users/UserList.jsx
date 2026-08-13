import { useState } from 'react';
import Avatar from '../common/Avatar.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import UserDetailModal from './UserDetailModal.jsx';
import ActiveToggle from './ActiveToggle.jsx';
import { Users as UsersIcon, Eye, Trash2 } from 'lucide-react';
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

function StatusCell({ user, canUpdate, updateUser }) {
  const isAdmin = isAdminRole(user.role);

  if (canUpdate && !isAdmin) {
    return (
      <ActiveToggle
        id={`list-active-${user._id}`}
        compact
        active={user.active !== false}
        onChange={(active) => updateUser.mutate({ id: user._id, updates: { active } })}
        disabled={updateUser.isPending}
      />
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        user.active !== false
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
          : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
      }`}
    >
      {user.active !== false ? 'Active' : 'Inactive'}
    </span>
  );
}

function UserRowActions({ user, isSelf, onView, onDelete, canDelete }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={onView}
        className="rounded-xl border border-slate-200/80 bg-white p-2 text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
        aria-label={`View ${user.name}`}
        title="View details"
      >
        <Eye size={16} />
      </button>
      {canDelete && !isSelf ? (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-transparent p-2 text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete user"
          title="Delete user"
        >
          <Trash2 size={16} />
        </button>
      ) : null}
    </div>
  );
}

export default function UserList({ users }) {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [viewUser, setViewUser] = useState(null);
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
          if (viewUser?._id === pendingDelete._id) setViewUser(null);
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
      <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 px-6 py-16">
        <EmptyState
          icon={UsersIcon}
          title="No team members yet"
          description="Add your first teammate using the Add user button above."
        />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
        {/* Mobile cards */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {users.map((user, i) => {
            const isSelf = String(currentUser?._id) === String(user._id);
            const isAdmin = isAdminRole(user.role);

            return (
              <li
                key={user._id}
                className={`p-4 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={user.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {user.name}
                          {isSelf ? (
                            <span className="ml-1.5 text-xs font-medium text-slate-400">(you)</span>
                          ) : null}
                        </p>
                        <p className="truncate text-sm text-slate-500">@{user.username}</p>
                      </div>
                      <UserRowActions
                        user={user}
                        isSelf={isSelf}
                        canDelete={canDelete}
                        onView={() => setViewUser(user)}
                        onDelete={() => setPendingDelete(user)}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${
                          isAdmin
                            ? 'bg-blue-50 text-[#1d4ed8] ring-blue-100'
                            : 'bg-slate-100 text-slate-600 ring-slate-200'
                        }`}
                      >
                        {user.role}
                      </span>
                      <StatusCell user={user} canUpdate={canUpdate} updateUser={updateUser} />
                      <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200/80">
                        {permissionSummary(user)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3.5 font-semibold">Team member</th>
                <th className="w-28 px-3 py-3.5 font-semibold">Role</th>
                <th className="w-36 px-3 py-3.5 font-semibold">Status</th>
                <th className="w-40 px-3 py-3.5 font-semibold">Permissions</th>
                <th className="w-28 px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, i) => {
                const isSelf = String(currentUser?._id) === String(user._id);
                const isAdmin = isAdminRole(user.role);

                return (
                  <tr
                    key={user._id}
                    className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)} transition-colors hover:bg-blue-50/25`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={user.name} size={42} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {user.name}
                            {isSelf ? (
                              <span className="ml-2 text-xs font-medium text-slate-400">(you)</span>
                            ) : null}
                          </p>
                          <p className="truncate text-sm text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${
                          isAdmin
                            ? 'bg-blue-50 text-[#1d4ed8] ring-blue-100'
                            : 'bg-slate-100 text-slate-600 ring-slate-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <StatusCell user={user} canUpdate={canUpdate} updateUser={updateUser} />
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <span className="inline-flex max-w-full truncate rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80">
                        {permissionSummary(user)}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <UserRowActions
                        user={user}
                        isSelf={isSelf}
                        canDelete={canDelete}
                        onView={() => setViewUser(user)}
                        onDelete={() => setPendingDelete(user)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailModal
        key={viewUser?._id}
        user={viewUser}
        canUpdate={canUpdate}
        onClose={() => setViewUser(null)}
        onRequestDelete={
          canDelete && viewUser && String(currentUser?._id) !== String(viewUser._id)
            ? () => {
                setPendingDelete(viewUser);
                setViewUser(null);
              }
            : null
        }
      />

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

import { useState } from 'react';
import { AlertCircle, UserPlus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import UserForm from '../components/users/UserForm.jsx';
import UserList from '../components/users/UserList.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import SkeletonTable from '../components/common/loaders/SkeletonTable.jsx';
import { useUsers } from '../hooks/useUsers.js';
import { useAuth } from '../hooks/useAuth.js';
import { PERMISSIONS, hasPermission } from '../utils/permissions.js';

export default function UsersPage() {
  const { user } = useAuth();
  const canCreate = hasPermission(user, PERMISSIONS.USERS_CREATE);
  const canUpdate = hasPermission(user, PERMISSIONS.USERS_UPDATE);
  const { data: users, isLoading, isError, error, refetch } = useUsers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  return (
    <AppLayout
      scrollable
      title="User management"
      subtitle={`${users?.length ?? 0} team members · signed in as ${user?.name || user?.username}`}
      actions={
        canCreate ? (
          <Button size="md" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} />
            Add user
          </Button>
        ) : null
      }
    >
      <div className="relative min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/80">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {isLoading ? (
            <SkeletonTable
              minWidth="min-w-[760px]"
              rows={6}
              showActions
              columns={[
                { key: 'member', label: 'Team member', withAvatar: true },
                { key: 'role', label: 'Role', width: 'w-28' },
                { key: 'status', label: 'Status', width: 'w-36' },
                { key: 'permissions', label: 'Permissions', width: 'w-40' },
              ]}
            />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <AlertCircle size={22} />
              </div>
              <p className="text-sm font-medium text-red-700">
                {error?.message || 'Failed to load team members.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-[#2563EB] underline-offset-2 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <UserList
              users={users}
              onEdit={canUpdate ? setEditUser : undefined}
            />
          )}
        </div>
      </div>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add user"
        description="Create a login for a new teammate."
        size="lg"
      >
        <UserForm onClose={() => setShowAddModal(false)} onSuccess={() => setShowAddModal(false)} />
      </Modal>

      <Modal
        key={editUser?._id}
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        title="Edit user"
        description={
          editUser?.name
            ? `Update details for ${editUser.name}`
            : 'Update name, email, role, status, and permissions.'
        }
        size="lg"
      >
        <UserForm
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => setEditUser(null)}
        />
      </Modal>
    </AppLayout>
  );
}

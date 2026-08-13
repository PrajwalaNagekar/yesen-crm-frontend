import { useState } from 'react';
import { AlertCircle, UserPlus } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import UserForm from '../components/users/UserForm.jsx';
import UserList from '../components/users/UserList.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useUsers } from '../hooks/useUsers.js';
import { useAuth } from '../hooks/useAuth.js';
import { PERMISSIONS, hasPermission } from '../utils/permissions.js';

export default function UsersPage() {
  const { user } = useAuth();
  const canCreate = hasPermission(user, PERMISSIONS.USERS_CREATE);
  const { data: users, isLoading, isError, error, refetch } = useUsers();
  const [showAddModal, setShowAddModal] = useState(false);

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
            <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
              <Spinner size={24} />
            </div>
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
            <UserList users={users} />
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
    </AppLayout>
  );
}

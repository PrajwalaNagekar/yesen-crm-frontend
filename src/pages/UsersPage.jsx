import { AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import UserForm from '../components/users/UserForm.jsx';
import UserList from '../components/users/UserList.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useUsers } from '../hooks/useUsers.js';
import { useAuth } from '../hooks/useAuth.js';

export default function UsersPage() {
  const { user } = useAuth();
  const { data: users, isLoading, isError, error, refetch } = useUsers();

  return (
    <AppLayout
      scrollable
      title="User management"
      subtitle={`${users?.length ?? 0} team members · signed in as ${user?.name || user?.username}`}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:p-8">
        <div className="animate-fade-in-up">
          <UserForm />
        </div>

        <div className="min-w-0 animate-fade-in-up stagger-2">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-white/80">
              <Spinner size={24} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <AlertCircle size={22} />
              </div>
              <p className="text-sm font-medium text-red-700">
                {error?.message || 'Failed to load team members.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-sm font-semibold text-brand-700 underline-offset-2 transition-colors hover:text-brand-900 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <UserList users={users} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

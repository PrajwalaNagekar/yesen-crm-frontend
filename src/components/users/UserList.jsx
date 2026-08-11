import Avatar from '../common/Avatar.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { Users as UsersIcon } from 'lucide-react';
import { useUpdateUser } from '../../hooks/useUsers.js';

export default function UserList({ users }) {
  const updateUser = useUpdateUser();

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
    <div className="surface-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight text-brand-900">Team</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-border">
          {users.length} {users.length === 1 ? 'person' : 'people'}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {users.map((user, i) => (
          <li
            key={user._id}
            className={`flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={user.name} size={40} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-brand-900">{user.name}</p>
                <p className="truncate text-sm text-slate-500">
                  @{user.username}
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="capitalize">{user.role}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateUser.mutate({ id: user._id, updates: { active: !user.active } })}
              disabled={updateUser.isPending}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                user.active
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 ring-1 ring-border hover:bg-slate-200'
              }`}
              title={user.active ? 'Click to deactivate' : 'Click to activate'}
            >
              {user.active ? 'Active' : 'Inactive'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

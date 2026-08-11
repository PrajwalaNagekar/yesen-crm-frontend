import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, ShieldCheck } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { changePassword } from '../api/auth.js';
import { ApiError } from '../api/client.js';

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Something went wrong.'),
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    mutation.mutate();
  }

  return (
    <AppLayout
      scrollable
      title="Settings"
      subtitle={`${user?.role === 'admin' ? 'Administrator' : 'Team member'} · ${user?.name || user?.username}`}
    >
      <div className="mx-auto w-full max-w-xl space-y-6 p-4 sm:p-6 lg:p-8">
        <form
          onSubmit={handleSubmit}
          className="surface-card animate-fade-in-up p-6 sm:p-7"
        >
          <div className="mb-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-brand-900">
                Password reset
              </h2>
              <p className="text-sm text-slate-500">
                Choose a new password. Minimum 8 characters.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Input
              label="Current password"
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Input
              label="New password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="mt-4 animate-fade-in rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700">
              Password updated successfully.
            </div>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <div className="surface-card animate-fade-in-up stagger-2 p-6 sm:p-7">
          <div className="mb-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <ShieldCheck size={18} />
            </div>
            <h2 className="font-display text-lg font-bold tracking-tight text-brand-900">
              Your access
            </h2>
          </div>
          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/90 px-4 py-3 ring-1 ring-border/60">
              <span className="shrink-0 text-slate-500">Name</span>
              <span className="truncate font-semibold text-brand-900">{user?.name || '—'}</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/90 px-4 py-3 ring-1 ring-border/60">
              <span className="shrink-0 text-slate-500">Username</span>
              <span className="truncate font-semibold text-brand-900">@{user?.username}</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/90 px-4 py-3 ring-1 ring-border/60">
              <span className="shrink-0 text-slate-500">Role</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-brand-700 ring-1 ring-brand-100">
                {user?.role}
              </span>
            </div>
            <p className="pt-2 leading-relaxed text-slate-500">
              {user?.role === 'admin'
                ? 'As an administrator you have access to every section and action.'
                : 'You have team member access. Contact an administrator to change your permissions.'}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, KeyRound, Lock, ShieldCheck, UserRound } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout.jsx';
import Avatar from '../components/common/Avatar.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { changePassword } from '../api/auth.js';
import { ApiError } from '../api/client.js';
import {
  getUserPermissionGroups,
  isAdminRole,
} from '../utils/permissions.js';

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isAdmin = isAdminRole(user?.role);
  const permissionGroups = getUserPermissionGroups(user);

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
      subtitle={`${isAdmin ? 'Administrator' : 'Team member'} · ${user?.name || user?.username}`}
    >
      <div className="relative min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/80">
        <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:space-y-6">
          {/* Profile hero */}
          <section className="animate-fade-in-up overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
            <div className="bg-gradient-to-r from-[#2563EB]/8 via-blue-50/60 to-transparent px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <Avatar name={user?.name || user?.username} size={64} className="ring-4 ring-white shadow-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-2xl font-bold tracking-tight text-slate-900">
                    {user?.name || '—'}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">@{user?.username}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${
                        isAdmin
                          ? 'bg-blue-50 text-[#1d4ed8] ring-blue-100'
                          : 'bg-slate-100 text-slate-600 ring-slate-200'
                      }`}
                    >
                      {user?.role}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                        user?.active !== false
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                          : 'bg-slate-100 text-slate-500 ring-slate-200'
                      }`}
                    >
                      {user?.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {/* Password */}
            <form
              onSubmit={handleSubmit}
              className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6"
            >
              <SectionHeader
                icon={KeyRound}
                title="Password"
                description="Update your sign-in password. Minimum 8 characters."
              />

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

              {error ? (
                <div className="mt-4 animate-fade-in rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="mt-4 flex animate-fade-in items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700">
                  <CheckCircle2 size={16} className="shrink-0" />
                  Password updated successfully.
                </div>
              ) : null}

              <Button type="submit" size="lg" className="mt-6 w-full" disabled={mutation.isPending}>
                <Lock size={16} />
                {mutation.isPending ? 'Updating…' : 'Update password'}
              </Button>
            </form>

            {/* Account & access */}
            <div className="animate-fade-in-up stagger-2 space-y-5">
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                <SectionHeader icon={UserRound} title="Account" description="Your profile details in the CRM." />

                <dl className="mt-6 space-y-2.5">
                  {[
                    { label: 'Name', value: user?.name || '—' },
                    { label: 'Username', value: `@${user?.username}` },
                    {
                      label: 'Role',
                      value: (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${
                            isAdmin
                              ? 'bg-blue-50 text-[#1d4ed8] ring-blue-100'
                              : 'bg-slate-100 text-slate-600 ring-slate-200'
                          }`}
                        >
                          {user?.role}
                        </span>
                      ),
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                    >
                      <dt className="shrink-0 text-sm text-slate-500">{row.label}</dt>
                      <dd className="truncate text-right text-sm font-semibold text-slate-900">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
                <SectionHeader
                  icon={ShieldCheck}
                  title="Your access"
                  description={
                    isAdmin
                      ? 'You have full administrator access.'
                      : 'Permissions granted to your account.'
                  }
                />

                <div className="mt-6">
                  {isAdmin ? (
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3.5 text-sm text-[#1d4ed8]">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                      <p className="font-medium leading-relaxed">
                        As an administrator you have access to every section and action in the CRM.
                      </p>
                    </div>
                  ) : permissionGroups.length ? (
                    <div className="space-y-4">
                      {permissionGroups.map((group) => (
                        <div key={group.module}>
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                            {group.label}
                          </p>
                          <ul className="space-y-2">
                            {group.permissions.map((label) => (
                              <li
                                key={label}
                                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-700"
                              >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                                {label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-500">
                      No permissions assigned. Contact an administrator to request access.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

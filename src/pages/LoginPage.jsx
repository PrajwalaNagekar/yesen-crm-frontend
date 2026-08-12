import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ApiError } from '../api/client.js';

export default function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      console.log('username,password', username, password);
      await login(username, password);

      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-atmosphere flex min-h-screen items-center justify-center px-4 py-10">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed left-[10%] top-[20%] h-64 w-64 rounded-full bg-brand-300/20 blur-3xl animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-[15%] right-[12%] h-72 w-72 rounded-full bg-teal-300/15 blur-3xl animate-float"
        style={{ animationDelay: '1.5s' }}
        aria-hidden
      />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-8 shadow-elevated backdrop-blur-xl sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-md shadow-brand-500/30">
              <Lock size={22} className="text-white" />
            </div>
            <div className="flex h-8 items-center gap-1.5 rounded-full bg-brand-50 px-3 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
              <Sparkles size={12} />
              Team access
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Sign in to Yesen CRM to manage your inquiry pipeline.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              placeholder="your.username"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />

            {error && (
              <div className="animate-fade-in rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-7 text-center text-xs leading-relaxed text-slate-400">
            Accounts are created by an administrator in User management.
          </p>
        </div>
      </div>
    </div>
  );
}

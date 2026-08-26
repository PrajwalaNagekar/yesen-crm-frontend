import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  Compass,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Plane,
  User,
} from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { resolvePostAuthPath } from '../utils/permissions.js';
import { ApiError } from '../api/client.js';

const HERO_IMAGE = '/loginPage/marine.jpg';

function AirplaneRoute({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8 58 C 30 20, 70 20, 112 28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      <path
        d="M108 24 L112 28 L108 32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(98, 22) rotate(18)">
        <Plane size={14} strokeWidth={2} />
      </g>
    </svg>
  );
}

function SocialButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-12 flex-1 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
    >
      {children}
    </button>
  );
}

export default function LoginPage() {
  const { login, status, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successMessage = location.state?.message || '';

  if (status === 'authenticated') {
    return (
      <Navigate
        to={resolvePostAuthPath(user, location.state?.from?.pathname)}
        replace
      />
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(username, password);
      navigate(resolvePostAuthPath(loggedInUser, location.state?.from?.pathname), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen h-screen overflow-hidden bg-[#F8FAFC]">
      {/* ── Left hero (desktop) ── */}
      <aside className="relative hidden overflow-hidden lg:flex lg:w-[45%] rounded-tr-[24px] rounded-br-[24px]">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/85 via-[#1D4ED8]/75 to-[#0c4a6e]/80" />

        {/* Floating travel elements */}
        <div
          className="pointer-events-none absolute left-[12%] top-[18%] h-16 w-28 rounded-full bg-white/10 blur-xl animate-float"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[15%] top-[28%] opacity-30 animate-float"
          style={{ animationDelay: '1.2s' }}
          aria-hidden
        >
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            <ellipse cx="20" cy="24" rx="18" ry="10" fill="white" fillOpacity="0.5" />
            <ellipse cx="38" cy="20" rx="22" ry="12" fill="white" fillOpacity="0.4" />
            <ellipse cx="58" cy="22" rx="16" ry="9" fill="white" fillOpacity="0.35" />
          </svg>
        </div>
        <Compass
          size={28}
          className="pointer-events-none absolute bottom-[22%] left-[14%] text-white/25 animate-float"
          style={{ animationDelay: '2s' }}
          aria-hidden
        />
        <MapPin
          size={22}
          className="pointer-events-none absolute bottom-[38%] right-[18%] text-[#0EA5E9]/60 animate-float"
          style={{ animationDelay: '0.8s' }}
          aria-hidden
        />
        <AirplaneRoute className="pointer-events-none absolute right-[10%] top-[42%] h-16 w-24 text-white/40" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Cleaner, smarter marine transportation
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100/80 xl:text-lg">
              Accelerating the transition toward cleaner and smarter marine transportation.
            </p>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Yesen Technologies
          </p>
        </div>
      </aside>

      {/* ── Right login panel ── */}
      <main className="relative flex flex-1 flex-col lg:w-[55%]">
        <div className="absolute inset-0 bg-[#F8FAFC] lg:bg-white" />

        {/* Airplane route decoration */}
        <AirplaneRoute className="pointer-events-none absolute right-6 top-6 hidden h-14 w-20 text-[#0EA5E9]/50 sm:block lg:right-10 lg:top-8" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[420px] animate-fade-in-up">
            <div className="mb-8 text-center">
              <img
                src="/logo/yesen.png"
                alt="Yesen Technologies"
                className="mx-auto h-24 w-auto object-contain sm:h-28"
              />
              <p className="mt-4 text-sm text-slate-500 sm:text-base">Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username with icon */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-[#1D4ED8]"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    required
                    placeholder="your.username"
                    className="w-full rounded-[14px] border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1D4ED8]/40 focus:ring-4 focus:ring-[#1D4ED8]/10"
                  />
                </div>
              </div>

              {/* Password with icon + toggle */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-[#1D4ED8]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-[14px] border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1D4ED8]/40 focus:ring-4 focus:ring-[#1D4ED8]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  state={{ username: username.trim() }}
                  className="text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-[#1D4ED8] sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              {successMessage ? (
                <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              {error && (
                <div
                  role="alert"
                  className="animate-fade-in flex items-start gap-3 rounded-[14px] border border-red-200/80 bg-red-50 px-4 py-3 shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                    <AlertCircle size={16} />
                  </span>
                  <p className="pt-1 text-sm font-medium leading-relaxed text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full rounded-[14px] bg-[#1D4ED8] uppercase tracking-wide shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e40af] hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Signing in…' : 'Login'}
              </Button>
            </form>

    

      

            <p className="mt-4 text-center text-xs text-slate-400 lg:hidden">
              Secure internal access for Yesen Technologies
            </p>
          </div>
        </div>

        {/* Desktop footer landmark decoration */}
        <div className="pointer-events-none relative hidden h-16 overflow-hidden lg:block" aria-hidden>
          <svg
            viewBox="0 0 600 60"
            className="absolute bottom-0 w-full text-[#0EA5E9]/20"
            preserveAspectRatio="xMidYMax slice"
          >
            <path
              fill="currentColor"
              d="M0 60V45 L20 35 L35 50 L50 25 L70 40 L90 20 L110 45 L130 30 L150 50 L170 35 L190 55 L210 40 L230 50 L250 30 L270 45 L290 25 L310 40 L330 50 L350 35 L370 45 L390 30 L410 50 L430 40 L450 55 L470 35 L490 45 L510 30 L530 50 L550 40 L570 55 L590 45 L600 50 V60Z"
            />
          </svg>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { resolvePostAuthPath } from '../utils/permissions.js';
import { ApiError } from '../api/client.js';
import * as authApi from '../api/auth.js';

const HERO_IMAGE = '/loginPage/marine.jpg';
const OTP_LENGTH = 6;
const DEFAULT_OTP_EXPIRY_MINUTES = 10;

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function OtpBoxes({ value, onChange, disabled = false }) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || '');

  function focusIndex(index) {
    const el = inputsRef.current[index];
    if (el) el.focus();
  }

  function updateDigits(nextDigits) {
    onChange(nextDigits.join('').slice(0, OTP_LENGTH));
  }

  function handleChange(index, raw) {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      updateDigits(next);
      return;
    }

    const chars = cleaned.split('');
    const next = [...digits];
    let cursor = index;
    chars.forEach((char) => {
      if (cursor < OTP_LENGTH) {
        next[cursor] = char;
        cursor += 1;
      }
    });
    updateDigits(next);
    focusIndex(Math.min(cursor, OTP_LENGTH - 1));
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        updateDigits(next);
        return;
      }
      if (index > 0) {
        e.preventDefault();
        const next = [...digits];
        next[index - 1] = '';
        updateDigits(next);
        focusIndex(index - 1);
      }
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || '');
    updateDigits(next);
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          className="h-12 w-11 rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-[#1D4ED8]/50 focus:ring-4 focus:ring-[#1D4ED8]/10 disabled:bg-slate-100 disabled:text-slate-400 sm:h-14 sm:w-12"
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { status, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialUsername = location.state?.username || '';

  const [step, setStep] = useState(initialUsername ? 'reset' : 'identify');
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpExpired = otpSent && !otpVerified && otpExpiresAt != null && remainingSeconds <= 0;

  useEffect(() => {
    if (!otpExpiresAt || otpVerified) {
      setRemainingSeconds(0);
      return undefined;
    }

    function tick() {
      const left = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setRemainingSeconds(left);
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [otpExpiresAt, otpVerified]);

  useEffect(() => {
    if (!otpExpired) return;
    setError('Verification code has expired. Please resend a new code.');
    setMessage('');
  }, [otpExpired]);

  useEffect(() => {
    if (!initialUsername) return;
    let cancelled = false;
    (async () => {
      setIsSubmitting(true);
      try {
        const data = await authApi.identifyForgotPassword(initialUsername.trim());
        if (cancelled) return;
        setEmail(data.account.email);
        setUsername(data.account.username);
        setStep('reset');
      } catch (err) {
        if (!cancelled) {
          setStep('identify');
          setError(err instanceof ApiError ? err.message : 'Could not find account');
        }
      } finally {
        if (!cancelled) setIsSubmitting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialUsername]);

  if (status === 'authenticated') {
    return <Navigate to={resolvePostAuthPath(user)} replace />;
  }

  async function handleIdentify(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const data = await authApi.identifyForgotPassword(username.trim());
      setEmail(data.account.email);
      setUsername(data.account.username);
      setStep('reset');
      setOtp('');
      setOtpVerified(false);
      setOtpSent(false);
      setOtpExpiresAt(null);
      setRemainingSeconds(0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not find account');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendOtp() {
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const result = await authApi.sendForgotPasswordOtp(username.trim());
      const expiryMinutes = result?.expiresInMinutes || DEFAULT_OTP_EXPIRY_MINUTES;
      setOtpSent(true);
      setOtpVerified(false);
      setOtp('');
      setOtpExpiresAt(Date.now() + expiryMinutes * 60 * 1000);
      setRemainingSeconds(expiryMinutes * 60);
      setMessage('Verification code sent to your email.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send verification code');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp() {
    setError('');
    setMessage('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit verification code');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.verifyForgotPasswordOtp(username.trim(), otp.trim());
      setOtpVerified(true);
      setMessage('Code verified. You can now set a new password.');
    } catch (err) {
      setOtpVerified(false);
      setError(err instanceof ApiError ? err.message : 'Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!otpVerified) {
      setError('Verify the code before changing your password');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.resetPasswordWithOtp(username.trim(), otp.trim(), newPassword);
      navigate('/login', {
        replace: true,
        state: { message: 'Password updated. Sign in with your new password.' },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reset password');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-[#F8FAFC]">
      <aside className="relative hidden overflow-hidden rounded-br-[24px] rounded-tr-[24px] lg:flex lg:w-[45%]">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/85 via-[#1D4ED8]/75 to-[#0c4a6e]/80" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-2xl bg-white px-3 py-2 shadow-lg shadow-black/10 ring-1 ring-white/30">
              <img src="/logo/yesen-logo.svg" alt="Yesen Technologies" className="h-9 w-auto object-contain" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-white">YESEN CRM</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Reset your password
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100/80 xl:text-lg">
              We&apos;ll send a one-time code to your registered email address.
            </p>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Yesen Technologies</p>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col lg:w-[55%]">
        <div className="absolute inset-0 bg-[#F8FAFC] lg:bg-white" />
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[420px] animate-fade-in-up">
            <Link
              to="/login"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#1D4ED8]"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>

            <div className="mb-8 text-center">
              <h2 className="font-display text-4xl font-bold tracking-tight text-[#1D4ED8] sm:text-5xl">
                {step === 'identify' ? 'Forgot password' : 'Verify email'}
              </h2>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                {step === 'identify'
                  ? 'Enter your username to continue'
                  : 'Check your email for the verification code'}
              </p>
            </div>

            {step === 'identify' ? (
              <form onSubmit={handleIdentify} className="space-y-5">
                <div>
                  <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[#1D4ED8]">
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
                      required
                      placeholder="your.username"
                      className="w-full rounded-[14px] border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1D4ED8]/40 focus:ring-4 focus:ring-[#1D4ED8]/10"
                    />
                  </div>
                </div>

                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-[14px] border border-red-200/80 bg-red-50 px-4 py-3"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                ) : null}

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full rounded-[14px]">
                  {isSubmitting ? 'Checking…' : 'Continue'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 shadow-sm">
                  <div className="flex items-center gap-3.5 px-4 py-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1D4ED8] text-white shadow-md shadow-blue-500/25">
                      <Mail size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Email address
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 sm:text-base">
                        {email || '—'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">OTP will be sent to this email</p>
                    </div>
                  </div>
                  <input id="email" name="email" type="email" value={email} readOnly className="sr-only" />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full rounded-[14px]"
                  disabled={isSubmitting}
                  onClick={handleSendOtp}
                >
                  {otpSent ? 'Resend code' : 'Send OTP'}
                </Button>

                <div>
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <label className="block text-sm font-medium text-[#1D4ED8]">Verification code</label>
                    {otpSent && !otpVerified ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
                          otpExpired
                            ? 'bg-red-50 text-red-600 ring-1 ring-red-100'
                            : remainingSeconds <= 60
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                              : 'bg-blue-50 text-[#1D4ED8] ring-1 ring-blue-100'
                        }`}
                      >
                        <Clock size={13} />
                        {otpExpired ? 'Expired' : formatCountdown(remainingSeconds)}
                      </span>
                    ) : null}
                  </div>
                  <OtpBoxes
                    value={otp}
                    disabled={!otpSent || otpVerified || isSubmitting || otpExpired}
                    onChange={(next) => {
                      setOtp(next);
                      setOtpVerified(false);
                      setError('');
                    }}
                  />
                  {otpSent && !otpVerified && !otpExpired ? (
                    <p className="mt-2 text-center text-xs text-slate-500">
                      Code expires in {formatCountdown(remainingSeconds)}
                    </p>
                  ) : null}
                </div>

                {!otpVerified ? (
                  <Button
                    type="button"
                    size="lg"
                    className="w-full rounded-[14px]"
                    disabled={
                      isSubmitting || otp.length !== OTP_LENGTH || !otpSent || otpExpired
                    }
                    onClick={handleVerifyOtp}
                  >
                    {isSubmitting ? 'Verifying…' : 'Verify code'}
                  </Button>
                ) : null}

                {otpVerified ? (
                  <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                    <div>
                      <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-[#1D4ED8]">
                        New password
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          placeholder="Minimum 8 characters"
                          className="w-full rounded-[14px] border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1D4ED8]/40 focus:ring-4 focus:ring-[#1D4ED8]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Input
                      label="Confirm password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                    />
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {message}
                  </div>
                ) : null}

                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-[14px] border border-red-200/80 bg-red-50 px-4 py-3"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                ) : null}

                {otpVerified ? (
                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full rounded-[14px]">
                    {isSubmitting ? 'Updating…' : 'Update password'}
                  </Button>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

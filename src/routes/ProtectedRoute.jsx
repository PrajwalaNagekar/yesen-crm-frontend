import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { hasPermission } from '../utils/permissions.js';
import Spinner from '../components/common/Spinner.jsx';

export default function ProtectedRoute({ children, adminOnly = false, permission = null }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-page">
        <Spinner size={32} />
        <p className="text-sm text-slate-500">Loading your workspace…</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

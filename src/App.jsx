import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import PipelinePage from './pages/PipelinePage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import CsmProjectsPage from './pages/CsmProjectsPage.jsx';
import TestimonialsPage from './pages/TestimonialsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute module="pipeline">
            <PipelinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute module="users">
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/csm/projects"
        element={
          <ProtectedRoute>
            <CsmProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/testimonials"
        element={
          <ProtectedRoute>
            <TestimonialsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

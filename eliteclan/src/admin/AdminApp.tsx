import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth } from './auth/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginForm } from './components/LoginForm';
import { TwoFactorForm } from './components/TwoFactorForm';
import { MediaProvider } from './media/MediaContext';
import DashboardPage from './pages/Dashboard';
import DiscographyManagerPage from './pages/DiscographyManager';
import EventsManagerPage from './pages/EventsManager';
import MediaManagerPage from './pages/MediaManager';
import MembersManagerPage from './pages/MembersManager';
import ServicesManagerPage from './pages/ServicesManager';
import ShowsManagerPage from './pages/ShowsManager';
import TestimonialsManagerPage from './pages/TestimonialsManager';

function LoginPage() {
  const { status } = useAuth();

  if (status === 'authenticated') {
    return <Navigate to="/admin" replace />;
  }

  if (status === 'challenge') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#0b1020,#130b2e)', color: 'white' }}>
        <TwoFactorForm />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#0b1020,#130b2e)', color: 'white' }}>
      <LoginForm />
    </div>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="services" element={<ServicesManagerPage />} />
          <Route path="shows" element={<ShowsManagerPage />} />
          <Route path="discography" element={<DiscographyManagerPage />} />
          <Route path="members" element={<MembersManagerPage />} />
          <Route path="testimonials" element={<TestimonialsManagerPage />} />
          <Route path="events" element={<EventsManagerPage />} />
          <Route path="media" element={<MediaManagerPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <MediaProvider>
        <AdminRoutes />
      </MediaProvider>
    </AuthProvider>
  );
}

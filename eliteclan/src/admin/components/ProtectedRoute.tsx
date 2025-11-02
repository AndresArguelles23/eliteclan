import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { Role } from '../../services/api';
import { useAuth } from '../auth/AuthContext';

type Props = {
  roles?: Role[];
};

export function ProtectedRoute({ roles }: Props) {
  const location = useLocation();
  const { status, role } = useAuth();

  if (status === 'loading') {
    return (
      <div style={{ padding: '3rem', color: 'white' }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (status === 'challenge') {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';

const NAV_LINKS = [
  { to: '/admin', label: 'Panel' },
  { to: '/admin/services', label: 'Servicios' },
  { to: '/admin/shows', label: 'Shows' },
  { to: '/admin/discography', label: 'Discografía' },
  { to: '/admin/members', label: 'Integrantes' },
  { to: '/admin/testimonials', label: 'Testimonios' },
  { to: '/admin/events', label: 'Próximos eventos' },
  { to: '/admin/media', label: 'Media' },
];

export function AdminLayout() {
  const { user, role, signOut } = useAuth();

  return (
    <div style={{ display: 'grid', minHeight: '100vh', gridTemplateColumns: '260px 1fr', background: '#06070b' }}>
      <aside
        style={{
          background: 'rgba(12, 14, 22, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '2rem 1.5rem',
          display: 'grid',
          gap: '2rem',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '0.08em' }}>EliteClan</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Control Center</p>
        </div>
        <nav style={{ display: 'grid', gap: '0.75rem' }}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              style={({ isActive }) => ({
                display: 'block',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: isActive ? 'rgba(116, 66, 255, 0.16)' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => signOut()}
          style={{
            marginTop: 'auto',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cerrar sesión
        </button>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          {user?.email ?? 'Usuario invitado'} · {role}
        </div>
      </aside>
      <main style={{ padding: '2rem', overflow: 'auto', color: 'white' }}>
        <Outlet />
      </main>
    </div>
  );
}

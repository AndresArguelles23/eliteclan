import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CTAButton } from '../components/Button';
import { usePartners } from '../data/hooks';
import { LogosMarquee } from '../components/LogosMarquee';
import '../App.css';

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Servicios' },
  { to: '/shows', label: 'Shows' },
  { to: '/discography', label: 'Discografía' },
  { to: '/contact', label: 'Contacto' },
];

export default function SiteLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const partners = usePartners();

  return (
    <div className="app-shell">
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(16px)',
          background: 'rgba(15,17,21,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="site-container header-bar">
          <NavLink to="/" aria-label="EliteClan Home" className="brand-mark">
            ELITECLAN
          </NavLink>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            className="btn secondary nav-toggle"
          >
            <span className="visually-hidden">Abrir navegación</span>
            <span aria-hidden>{isMenuOpen ? '✕' : '☰'}</span>
          </button>
          <nav
            id="primary-navigation"
            className={`primary-nav ${isMenuOpen ? 'open' : ''}`}
            aria-label="Navegación principal"
          >
            {navigation.slice(0, -1).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'active-link' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="btn cta-inline"
            >
              Bookings
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ paddingBlock: '3rem', marginTop: 'auto' }}>
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <LogosMarquee partners={partners} />
          <div style={{ display: 'grid', gap: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
              Creamos experiencias musicales hiperconectadas.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <CTAButton href="mailto:hola@eliteclan.com">hola@eliteclan.com</CTAButton>
              <CTAButton href="https://wa.me/5215512345678" target="_blank" rel="noreferrer" variant="secondary">
                WhatsApp
              </CTAButton>
            </div>
            <small style={{ color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} EliteClan. Producción escénica y storytelling inmersivo para artistas visionarios.
            </small>
          </div>
        </div>
      </footer>
    </div>
  );
}

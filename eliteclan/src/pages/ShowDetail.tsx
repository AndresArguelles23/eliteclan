import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CTAButton } from '../components/Button';
import { MediaCarousel } from '../components/MediaCarousel';
import { useShowBySlug } from '../data/hooks';
import '../App.css';

export default function ShowDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const show = useShowBySlug(slug);

  const formattedDate = useMemo(() => {
    if (!show) return '';
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(show.date));
  }, [show]);

  if (!show) {
    return (
      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>Show no encontrado</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            El show que buscas no está disponible o fue archivado. Explora otros eventos disponibles.
          </p>
          <CTAButton to="/shows">Ver todos los shows</CTAButton>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
        <Link to="/shows" className="btn secondary" style={{ justifySelf: 'start' }}>
          ← Volver a shows
        </Link>
        <div className="hero-layout">
          <div className="card" style={{ display: 'grid', gap: '1rem' }}>
            <span className="chip">{show.genre ?? 'Show'}</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{show.title}</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>{show.description}</p>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '1rem' }}>
              <span>
                <strong>Fecha:</strong> {formattedDate}
              </span>
              <span>
                <strong>Ubicación:</strong> {show.venue} · {show.city}, {show.country}
              </span>
              <span>
                <strong>Etiquetas:</strong> {(show.tags ?? []).join(', ')}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <CTAButton to="/contact">Solicitar booking</CTAButton>
              <CTAButton href="https://wa.me/5215512345678" target="_blank" rel="noreferrer" variant="secondary">
                Coordinar por WhatsApp
              </CTAButton>
            </div>
          </div>
          <MediaCarousel items={show.media ?? []} />
        </div>
      </div>
    </section>
  );
}

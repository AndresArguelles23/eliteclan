import { CTAButton } from '../components/Button';
import { FilterableShowGrid } from '../components/FilterableShowGrid';
import { MediaCarousel } from '../components/MediaCarousel';
import { useShows } from '../data/hooks';
import '../App.css';

export default function ShowsPage() {
  const shows = useShows();
  const upcoming = useShows({ upcomingOnly: true });
  const featured = upcoming[0] ?? shows[0];

  return (
    <div>
      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
          <div className="section-header">
            <div className="chip">Shows</div>
            <h2>Experiencias en vivo y formatos especiales</h2>
            <p>
              Agenda abierta para festivales, giras, residencias artísticas y workshops con tecnología inmersiva de última
              generación.
            </p>
          </div>
          {featured && (
            <div className="grid" style={{ gap: '2rem' }}>
              <div className="card" style={{ display: 'grid', gap: '1rem' }}>
                <span className="chip">Destacado</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>{featured.title}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{featured.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <span>
                    {featured.venue} · {featured.city}, {featured.country}
                  </span>
                  <span>{new Date(featured.date).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <CTAButton to={`/shows/${featured.slug}`}>Ver detalle</CTAButton>
              </div>
              <MediaCarousel items={featured.media ?? []} />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <div className="section-header">
            <div className="chip">Catálogo</div>
            <h2>Filtra por formato o experiencia</h2>
            <p>Selecciona la categoría para explorar shows pasados y próximos con sus especificaciones.</p>
          </div>
          <FilterableShowGrid shows={shows} />
        </div>
      </section>
    </div>
  );
}

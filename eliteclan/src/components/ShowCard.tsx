import { Link } from 'react-router-dom';
import type { Show } from '../services/api';
import '../App.css';

export const ShowCard = ({ show }: { show: Show }) => {
  const date = new Date(show.date);
  const formatted = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return (
    <article className="card" aria-labelledby={`${show.slug}-title`}>
      <div className="media-ratio" aria-hidden>
        <img src={show.heroImage ?? show.media[0]?.url ?? ''} alt={show.title} loading="lazy" />
      </div>
      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
        <div className="badge-row" aria-label="Etiquetas del show">
          {(show.tags ?? []).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        <h3 id={`${show.slug}-title`} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
          {show.title}
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }}>{show.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.95rem' }}>
          <span>
            <strong>{formatted}</strong>
          </span>
          <span>
            {show.venue} · {show.city}, {show.country}
          </span>
        </div>
        <Link className="btn secondary" to={`/shows/${show.slug}`} aria-label={`Ver detalles de ${show.title}`}>
          Ver detalles
        </Link>
      </div>
    </article>
  );
};

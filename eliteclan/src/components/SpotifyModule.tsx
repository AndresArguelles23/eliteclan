import type { Release } from '../data';
import '../App.css';

type SpotifyModuleProps = {
  release: Release;
};

export const SpotifyModule = ({ release }: SpotifyModuleProps) => {
  return (
    <section className="card" style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="chip">Escucha</div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>{release.title}</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>{release.description}</p>
      </div>
      <iframe
        title={`Escucha ${release.title}`}
        src={release.spotifyEmbed}
        style={{ borderRadius: '12px', width: '100%', border: 'none', minHeight: '352px' }}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </section>
  );
};

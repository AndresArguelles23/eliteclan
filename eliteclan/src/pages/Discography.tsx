import { CTAButton } from '../components/Button';
import { useDiscography } from '../data/hooks';
import '../App.css';

export default function DiscographyPage() {
  const releases = useDiscography();
  const album = releases.find((release) => release.type === 'Album');
  const singles = releases.filter((release) => release.type === 'Single');

  return (
    <div>
      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
          <div className="section-header">
            <div className="chip">Discografía</div>
            <h2>Sonidos que conectan universos</h2>
            <p>
              Explora el catálogo de EliteClan: álbum conceptual, sencillos de club y piezas experimentales diseñadas para
              experiencias inmersivas.
            </p>
          </div>
          {album && (
            <article className="card" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="hero-layout" style={{ alignItems: 'stretch' }}>
                <img
                  src={album.cover}
                  alt={`Portada de ${album.title}`}
                  loading="lazy"
                  style={{ borderRadius: 'var(--radius-lg)', width: '100%', objectFit: 'cover' }}
                />
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <span className="chip">Álbum</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>{album.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>{album.description}</p>
                  <CTAButton href={album.spotifyEmbed} target="_blank" rel="noreferrer" variant="secondary">
                    Escuchar en Spotify
                  </CTAButton>
                </div>
              </div>
              <iframe
                title={`Escucha ${album.title}`}
                src={album.spotifyEmbed}
                style={{ borderRadius: '12px', width: '100%', border: 'none', minHeight: '352px' }}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </article>
          )}
        </div>
      </section>

      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <div className="section-header">
            <div className="chip">Singles</div>
            <h2>Piezas destacadas</h2>
            <p>Tracks que exploran ritmos híbridos, texturas binaurales y colaboraciones con vocalistas invitados.</p>
          </div>
          <div className="grid auto-fit">
            {singles.map((single) => (
              <article key={single.id} className="card" style={{ display: 'grid', gap: '1rem' }}>
                <img
                  src={single.cover}
                  alt={`Portada de ${single.title}`}
                  loading="lazy"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <span className="chip">Single · {single.year}</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>{single.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>{single.description}</p>
                </div>
                <iframe
                  title={`Escucha ${single.title}`}
                  src={single.spotifyEmbed}
                  style={{ borderRadius: '12px', width: '100%', border: 'none', minHeight: '152px' }}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

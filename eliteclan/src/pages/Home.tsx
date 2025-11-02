import { CTAButton } from '../components/Button';
import { MediaCarousel } from '../components/MediaCarousel';
import { ShowCard } from '../components/ShowCard';
import { SpotifyModule } from '../components/SpotifyModule';
import { Testimonials } from '../components/Testimonials';
import { useDiscography, useShows, useTestimonials } from '../data/hooks';
import '../App.css';

export default function HomePage() {
  const upcomingShows = useShows({ upcomingOnly: true });
  const heroShow = upcomingShows[0] ?? upcomingShows[1];
  const testimonials = useTestimonials();
  const releases = useDiscography();
  const featuredRelease = releases.find((release) => release.type === 'Album') ?? releases[0];

  return (
    <div>
      <section className="section" id="home">
        <div className="site-container hero-layout" style={{ gap: '2.5rem' }}>
          <div className="fade-up" style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="chip">Nuevo ciclo</div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 8vw, 4.5rem)',
                letterSpacing: '0.08em',
                lineHeight: 1.1,
              }}
            >
              Producción inmersiva, storytelling radical y beats que hackean sentidos.
            </h1>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '56ch' }}>
              EliteClan diseña experiencias musicales que combinan tecnología XR, visuales en tiempo real y
              colaboraciones con marcas para amplificar cada show.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <CTAButton to="/shows">Próximos shows</CTAButton>
              <CTAButton to="/services" variant="secondary">
                Explorar servicios
              </CTAButton>
            </div>
          </div>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <video
              src="https://cdn.coverr.co/videos/coverr-crowd-at-a-concert-0489/1080p.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <section className="section" id="upcoming">
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <div className="section-header">
            <div className="chip">Agenda</div>
            <h2>Próximos shows</h2>
            <p>Explora experiencias inmersivas listas para desplegarse alrededor del continente.</p>
          </div>
          <div className="grid auto-fit">
            {upcomingShows.slice(0, 3).map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </section>

      {heroShow && (
        <section className="section" id="highlight">
          <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
            <div className="section-header">
              <div className="chip">Destacado</div>
              <h2>{heroShow.title}</h2>
              <p>{heroShow.description}</p>
            </div>
            <MediaCarousel items={heroShow.media ?? []} />
          </div>
        </section>
      )}

      {featuredRelease && (
        <section className="section" id="spotify">
          <div className="site-container">
            <SpotifyModule release={featuredRelease} />
          </div>
        </section>
      )}

      <section className="section" id="testimonials">
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <div className="section-header">
            <div className="chip">Feedback</div>
            <h2>Historias que nos impulsan</h2>
            <p>Colaboradores y aliados que confían en la visión sonora y visual de EliteClan.</p>
          </div>
          <Testimonials items={testimonials} />
        </div>
      </section>
    </div>
  );
}

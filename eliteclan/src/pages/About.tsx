import { CTAButton } from '../components/Button';
import '../App.css';

const milestones = [
  {
    year: '2019',
    title: 'Nace el colectivo',
    description: 'EliteClan inicia como laboratorio audiovisual underground explorando visuales reactivos.',
  },
  {
    year: '2021',
    title: 'Integración XR',
    description: 'Se suman especialistas XR para crear narrativas inmersivas con sensores y realidad extendida.',
  },
  {
    year: '2023',
    title: 'Expansión global',
    description: 'Giras en Latinoamérica y Europa, residencias artísticas y alianzas con marcas creativas.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
          <div className="hero-layout">
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="chip">Manifesto</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}>
                Somos storytellers sonoros diseñando futuros compartidos.
              </h1>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '60ch' }}>
                EliteClan es un colectivo creativo que fusiona música electrónica, arte digital, diseño de producción y
                tecnología inmersiva para artistas que quieren transformar cada show en una experiencia inolvidable.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <CTAButton to="/contact">Agendar discovery call</CTAButton>
                <CTAButton to="/discography" variant="secondary">
                  Explorar discografía
                </CTAButton>
              </div>
            </div>
            <div className="card" style={{ display: 'grid', gap: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)' }}>Equipo creativo</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Productores musicales, diseñadoras de escenografía, ingenieras de audio espacial, artistas XR y storytellers
                trabajan de forma modular para co-crear experiencias con cada aliado.
              </p>
              <ul style={{ display: 'grid', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
                <li>· Dirección creativa y escénica</li>
                <li>· Producción técnica y logística</li>
                <li>· Contenido multimedia en tiempo real</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <div className="section-header">
            <div className="chip">Bio</div>
            <h2>Trayectoria y ADN</h2>
            <p>
              Venimos de la escena independiente latinoamericana y colaboramos con festivales globales, marcas tecnológicas y
              residencias artísticas. Documentamos cada proyecto para nutrir el press kit oficial.
            </p>
          </div>
          <div className="grid" style={{ gap: '1.5rem' }}>
            {milestones.map((milestone) => (
              <article key={milestone.year} className="card" style={{ display: 'grid', gap: '0.75rem' }}>
                <span className="chip">{milestone.year}</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>{milestone.title}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{milestone.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container" style={{ display: 'grid', gap: '2rem' }}>
          <div className="section-header">
            <div className="chip">Press Kit</div>
            <h2>Recursos para prensa y partners</h2>
            <p>Descarga assets, fotografías HQ, bio extendida y line sheet técnico.</p>
          </div>
          <div className="card" style={{ display: 'grid', gap: '1rem' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Mantenemos actualizado un press kit con dossier, logotipos, fotografías oficiales y requerimientos técnicos.
            </p>
            <CTAButton
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              style={{ justifySelf: 'start' }}
            >
              Descargar press kit
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}

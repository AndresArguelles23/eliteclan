import { CTAButton } from '../components/Button';
import { services } from '../data/services';
import '../App.css';

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
        <div className="section-header">
          <div className="chip">Servicios</div>
          <h2>Soluciones end-to-end para shows inmersivos</h2>
          <p>
            Desde la visión creativa hasta la operación técnica, habilitamos experiencias memorables con equipos expertos y
            procesos centrados en la audiencia.
          </p>
        </div>
        <div className="grid auto-fit">
          {services.map((service) => (
            <article key={service.id} className="card" style={{ display: 'grid', gap: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{service.description}</p>
              <ul style={{ display: 'grid', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                {service.features.map((feature) => (
                  <li key={feature}>· {feature}</li>
                ))}
              </ul>
              <CTAButton href={service.ctaHref} variant="secondary" style={{ justifySelf: 'start' }}>
                {service.ctaLabel}
              </CTAButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

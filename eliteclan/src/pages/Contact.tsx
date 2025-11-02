import { CTAButton } from '../components/Button';
import { ContactForm } from '../components/ContactForm';
import '../App.css';

export default function ContactPage() {
  return (
    <section className="section">
      <div className="site-container" style={{ display: 'grid', gap: '2.5rem' }}>
        <div className="hero-layout">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="chip">Booking</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}>
              Conecta con nuestro equipo para diseñar la próxima experiencia EliteClan.
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Coordinamos discovery calls, envío de press kit y propuestas de producción en menos de 24 horas.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <CTAButton href="mailto:hola@eliteclan.com">hola@eliteclan.com</CTAButton>
              <CTAButton href="https://wa.me/5215512345678" target="_blank" rel="noreferrer" variant="secondary">
                WhatsApp directo
              </CTAButton>
            </div>
            <div className="card" style={{ display: 'grid', gap: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)' }}>Información clave</h2>
              <ul style={{ display: 'grid', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                <li>· Cobertura: global, base en Ciudad de México y Buenos Aires.</li>
                <li>· Respuesta: menos de 24 horas hábiles.</li>
                <li>· Servicios: producción integral, consultoría creativa, workshops.</li>
              </ul>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

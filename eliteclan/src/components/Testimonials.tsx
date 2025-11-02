import type { Testimonial } from '../services/api';
import '../App.css';

type TestimonialsProps = {
  items: Testimonial[];
};

export const Testimonials = ({ items }: TestimonialsProps) => {
  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      {items.map((testimonial) => (
        <figure key={testimonial.id} className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={`Retrato de ${testimonial.name}`}
                loading="lazy"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 600,
                }}
              >
                {testimonial.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <figcaption style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                {testimonial.name}
              </figcaption>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                {testimonial.role} {testimonial.role && testimonial.company ? '·' : ''} {testimonial.company}
              </p>
            </div>
          </div>
          <blockquote style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
            “{testimonial.quote}”
          </blockquote>
        </figure>
      ))}
    </div>
  );
};

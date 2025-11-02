import { CTAButton } from './Button';

import type { Service } from '../services/api';

type Props = {
  services: Service[];
};

export function ServiceList({ services }: Props) {
  return (
    <div className="grid auto-fit">
      {services.map((service) => (
        <article key={service.id} className="card" style={{ display: 'grid', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>{service.title}</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>{service.description}</p>
          <ul style={{ display: 'grid', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
            {(service.features ?? []).map((feature) => (
              <li key={feature}>· {feature}</li>
            ))}
          </ul>
          <CTAButton to={service.ctaHref} variant="secondary" style={{ justifySelf: 'start' }}>
            {service.ctaLabel}
          </CTAButton>
        </article>
      ))}
    </div>
  );
}

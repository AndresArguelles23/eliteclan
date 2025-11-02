import { useEffect, useState } from 'react';

import { useServices } from '../../data/hooks';
import { fetchDiscography, fetchEvents, fetchShows, fetchTestimonials } from '../../services/api';

type Summary = {
  shows: number;
  services: number;
  testimonials: number;
  releases: number;
  pendingEvents: number;
};

export default function DashboardPage() {
  const services = useServices();
  const [summary, setSummary] = useState<Summary>({ shows: 0, services: services.length, testimonials: 0, releases: 0, pendingEvents: 0 });

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [shows, testimonials, discography, events] = await Promise.all([
          fetchShows(),
          fetchTestimonials(),
          fetchDiscography(),
          fetchEvents(),
        ]);
        if (!ignore) {
          setSummary({
            shows: shows.length,
            services: services.length,
            testimonials: testimonials.length,
            releases: discography.length,
            pendingEvents: events.filter((event) => event.status !== 'published').length,
          });
        }
      } catch (error) {
        console.warn('[dashboard] resumen incompleto', error);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [services.length]);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '2.75rem', margin: 0 }}>Panel de contenido</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
          Gestiona servicios, shows, lanzamientos y testimonios. Los borradores pueden programarse antes de ser publicados.
        </p>
      </header>
      <section style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <DashboardCard title="Servicios publicados" value={summary.services} />
          <DashboardCard title="Shows registrados" value={summary.shows} />
          <DashboardCard title="Testimonios activos" value={summary.testimonials} />
          <DashboardCard title="Lanzamientos" value={summary.releases} />
          <DashboardCard title="Eventos en borrador" value={summary.pendingEvents} accent="#f97316" />
        </div>
      </section>
    </div>
  );
}

type CardProps = {
  title: string;
  value: number;
  accent?: string;
};

function DashboardCard({ title, value, accent = '#6366f1' }: CardProps) {
  return (
    <article
      style={{
        borderRadius: '1rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.14))',
        border: `1px solid ${accent}30`,
        display: 'grid',
        gap: '0.75rem',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{title}</span>
      <strong style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)' }}>{value}</strong>
    </article>
  );
}

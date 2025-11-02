import type { UpcomingEvent } from '../../services/api';
import { deleteEvent, fetchEvents, saveEvent } from '../../services/api';
import { ResourceManager, type FieldDefinition } from '../components/ResourceManager';

const fields: FieldDefinition<UpcomingEvent>[] = [
  { name: 'title', label: 'Título', type: 'text', required: true },
  { name: 'startsAt', label: 'Fecha y hora', type: 'datetime', required: true },
  { name: 'venue', label: 'Venue', type: 'text', required: true },
  { name: 'city', label: 'Ciudad', type: 'text', required: true },
  { name: 'country', label: 'País', type: 'text', required: true },
  { name: 'format', label: 'Formato', type: 'text' },
  { name: 'ticketUrl', label: 'URL de tickets', type: 'url' },
  { name: 'tags', label: 'Etiquetas', type: 'tags' },
  { name: 'status', label: 'Estado', type: 'status' },
];

export default function EventsManagerPage() {
  return (
    <ResourceManager<UpcomingEvent>
      title="Próximos eventos"
      description="Calendario de eventos y actividades con posibilidad de publicar o dejar en borrador."
      fetchItems={fetchEvents}
      saveItem={saveEvent}
      deleteItem={deleteEvent}
      initialValue={() => ({
        id: '',
        title: '',
        startsAt: new Date().toISOString(),
        venue: '',
        city: '',
        country: '',
        format: '',
        ticketUrl: '',
        tags: [],
        status: 'draft',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })}
      fields={fields}
      renderPreview={(item) => <EventPreview event={item} />}
    />
  );
}

function EventPreview({ event }: { event: UpcomingEvent }) {
  return (
    <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <span className="chip">{event.format ?? 'Evento'}</span>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>{event.title}</h3>
      <p style={{ color: 'var(--color-text-muted)' }}>
        {new Date(event.startsAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })} · {event.venue} ·{' '}
        {event.city}, {event.country}
      </p>
      {event.ticketUrl && (
        <a href={event.ticketUrl} style={{ color: 'var(--color-accent)' }}>
          Ver boletos
        </a>
      )}
    </article>
  );
}

import type { DiscographyItem } from '../../services/api';
import { deleteDiscographyItem, fetchDiscography, saveDiscographyItem } from '../../services/api';
import { ResourceManager, type FieldDefinition } from '../components/ResourceManager';

const fields: FieldDefinition<DiscographyItem>[] = [
  { name: 'title', label: 'Título', type: 'text', required: true },
  {
    name: 'type',
    label: 'Tipo',
    type: 'select',
    required: true,
    options: [
      { label: 'Álbum', value: 'Album' },
      { label: 'EP', value: 'EP' },
      { label: 'Single', value: 'Single' },
    ],
  },
  { name: 'year', label: 'Año', type: 'number', required: true },
  { name: 'cover', label: 'Portada (URL)', type: 'url', required: true },
  { name: 'spotifyEmbed', label: 'Spotify embed URL', type: 'url', required: true },
  { name: 'description', label: 'Descripción', type: 'textarea', required: true },
  { name: 'status', label: 'Estado', type: 'status' },
];

export default function DiscographyManagerPage() {
  return (
    <ResourceManager<DiscographyItem>
      title="Discografía"
      description="Controla lanzamientos musicales con metadatos consistentes y previsualiza los embeds."
      fetchItems={fetchDiscography}
      saveItem={saveDiscographyItem}
      deleteItem={deleteDiscographyItem}
      initialValue={() => ({
        id: '',
        title: '',
        type: 'Single',
        year: new Date().getFullYear(),
        cover: '',
        spotifyEmbed: '',
        description: '',
        status: 'draft',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })}
      fields={fields}
      renderPreview={(item) => <DiscographyPreview item={item} />}
    />
  );
}

function DiscographyPreview({ item }: { item: DiscographyItem }) {
  return (
    <article className="card" style={{ display: 'grid', gap: '1rem' }}>
      <img
        src={item.cover}
        alt={`Portada de ${item.title}`}
        style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
      />
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <span className="chip">
          {item.type} · {item.year}
        </span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>{item.title}</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
      </div>
      <iframe
        title={`Escucha ${item.title}`}
        src={item.spotifyEmbed}
        style={{ border: 'none', width: '100%', minHeight: '200px', borderRadius: '12px' }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </article>
  );
}

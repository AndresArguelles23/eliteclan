import { Fragment } from 'react';

import { MediaCarousel } from '../../components/MediaCarousel';
import { ShowCard } from '../../components/ShowCard';
import type { MediaAsset, Show } from '../../services/api';
import { deleteShow, fetchShows, saveShow } from '../../services/api';
import { ResourceManager, type FieldDefinition } from '../components/ResourceManager';

type ShowForm = Show & { mediaSources: string[] };

const fields: FieldDefinition<ShowForm>[] = [
  { name: 'title', label: 'Título', type: 'text', required: true },
  { name: 'slug', label: 'Slug', type: 'text', required: true, helperText: 'Se usa en la URL /shows/[slug]' },
  { name: 'description', label: 'Descripción', type: 'textarea', required: true },
  { name: 'date', label: 'Fecha y hora', type: 'datetime', required: true },
  { name: 'venue', label: 'Venue', type: 'text', required: true },
  { name: 'city', label: 'Ciudad', type: 'text', required: true },
  { name: 'country', label: 'País', type: 'text', required: true },
  { name: 'genre', label: 'Género', type: 'text' },
  {
    name: 'mediaSources',
    label: 'Media (formato tipo|url|alt)',
    type: 'list',
    helperText: "Ej: image|https://...|Descripción o embed|https://www.youtube.com/...",
  },
  { name: 'setlist', label: 'Setlist (una canción por línea)', type: 'list' },
  { name: 'tags', label: 'Etiquetas (separadas por coma)', type: 'tags' },
  { name: 'heroImage', label: 'Imagen principal', type: 'url' },
  { name: 'status', label: 'Estado', type: 'status' },
];

function toForm(show: Show): ShowForm {
  return {
    ...show,
    mediaSources: show.media.map((asset) => `${asset.type}|${asset.url}|${asset.alt ?? ''}`),
  };
}

function toDomain(show: Partial<ShowForm>): Partial<Show> {
  const media: MediaAsset[] = (show.mediaSources ?? []).map((entry, index) => {
    const [type = 'image', url = '', alt = ''] = entry.split('|');
    const normalizedType = type === 'video' || type === 'embed' ? 'embed' : 'image';
    return {
      id: `${show.id ?? 'media'}-${index}`,
      type: normalizedType as MediaAsset['type'],
      url,
      alt: alt || undefined,
      provider: normalizedType === 'embed' ? inferProvider(url) : 'unknown',
    } satisfies MediaAsset;
  });

  return {
    ...show,
    media,
  } as Partial<Show>;
}

const inferProvider = (url: string): MediaAsset['provider'] => {
  if (/youtube|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo/.test(url)) return 'vimeo';
  if (/instagram/.test(url)) return 'instagram';
  return 'unknown';
};

export default function ShowsManagerPage() {
  return (
    <ResourceManager<ShowForm>
      title="Shows"
      description="Gestiona shows pasados y futuros, incluyendo visuales asociados y setlist."
      fetchItems={async () => (await fetchShows()).map(toForm)}
      saveItem={async (item, user) => toForm(await saveShow(toDomain(item), user))}
      deleteItem={deleteShow}
      initialValue={() => ({
        id: '',
        title: '',
        slug: '',
        description: '',
        date: new Date().toISOString(),
        venue: '',
        city: '',
        country: '',
        genre: '',
        media: [],
        mediaSources: [],
        setlist: [],
        tags: [],
        heroImage: '',
        status: 'draft',
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })}
      fields={fields}
      renderPreview={(item) => <ShowPreview show={item} />}
    />
  );
}

function ShowPreview({ show }: { show: ShowForm }) {
  const media: MediaAsset[] = (show.mediaSources ?? []).map((entry, index) => {
    const [type = 'image', url = '', alt = ''] = entry.split('|');
    const normalizedType = type === 'video' || type === 'embed' ? 'embed' : 'image';
    return {
      id: `${show.id ?? 'preview'}-${index}`,
      type: normalizedType as MediaAsset['type'],
      url,
      alt: alt || undefined,
      provider: normalizedType === 'embed' ? inferProvider(url) : 'unknown',
    } satisfies MediaAsset;
  });

  const normalizedShow: Show = {
    ...show,
    media,
  };

  return (
    <Fragment>
      <ShowCard show={normalizedShow} />
      {media.length > 0 && <MediaCarousel items={media} />}
    </Fragment>
  );
}

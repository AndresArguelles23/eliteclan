import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

import type { Show as StaticShow } from '../data/shows';
import { shows as fallbackShows } from '../data/shows';
import type { Service as StaticService } from '../data/services';
import { services as fallbackServices } from '../data/services';
import { discography as fallbackDiscography } from '../data/discography';
import type { Release as StaticDiscographyItem } from '../data/discography';
import { testimonials as fallbackTestimonials } from '../data/testimonials';

export type ContentStatus = 'draft' | 'published';

export type Role = 'Admin' | 'Editor';

export type ChangeLogEntry = {
  id: string;
  userId: string;
  userEmail?: string;
  change: string;
  createdAt: string;
};

export type MediaAsset = {
  id: string;
  type: 'image' | 'video' | 'embed';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  provider?: 'youtube' | 'vimeo' | 'instagram' | 'unknown';
  metadata?: Record<string, unknown>;
};

type BaseContent = {
  id: string;
  title: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  history: ChangeLogEntry[];
  tags?: string[];
};

export type Service = BaseContent & {
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  category?: string;
};

export type Show = BaseContent & {
  slug: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  genre?: string;
  description: string;
  setlist?: string[];
  heroImage?: string;
  media: MediaAsset[];
};

export type DiscographyItem = BaseContent & {
  type: 'Album' | 'EP' | 'Single';
  year: number;
  cover: string;
  spotifyEmbed: string;
  description: string;
};

export type Member = BaseContent & {
  role: string;
  avatar?: string;
  bio: string;
  social?: {
    platform: string;
    url: string;
  }[];
};

export type Testimonial = BaseContent & {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
};

export type UpcomingEvent = BaseContent & {
  startsAt: string;
  venue: string;
  city: string;
  country: string;
  format?: string;
  ticketUrl?: string;
};

export type MediaUploadRequest = {
  file: File;
  alt?: string;
  optimize?: boolean;
  width?: number;
  height?: number;
};

export type MediaResult = {
  asset: MediaAsset;
  variants?: MediaAsset[];
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as Crypto).randomUUID() : `tmp-${Math.random().toString(36).slice(2)}`;

function getClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
      },
    });
  }
  return cachedClient;
}

type Fetcher<T> = () => Promise<T>;

async function withFallback<T>(fetcher: Fetcher<T>, fallback: T): Promise<T> {
  try {
    const client = getClient();
    if (!client) return fallback;
    return await fetcher();
  } catch (error) {
    console.warn('[api] Using fallback data due to error', error);
    return fallback;
  }
}

function mapStaticService(service: StaticService): Service {
  return {
    ...service,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  };
}

function mapStaticShow(show: StaticShow): Show {
  return {
    ...show,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
    media: show.media.map((item) => ({
      id: `${show.id}-${item.src}`,
      type: item.type === 'video' ? 'embed' : 'image',
      url: item.src,
      alt: item.alt,
      provider: item.type === 'video' ? 'youtube' : 'unknown',
    })),
  };
}

function mapStaticDiscography(item: StaticDiscographyItem): DiscographyItem {
  return {
    ...item,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  };
}

export async function fetchServices(): Promise<Service[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client) return fallbackServices.map(mapStaticService);
    const { data, error } = await client.from('services').select('*').order('title');
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      features: row.features ?? [],
      ctaLabel: row.cta_label,
      ctaHref: row.cta_href,
      status: (row.status ?? 'draft') as ContentStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history: (row.history ?? []) as ChangeLogEntry[],
      tags: row.tags ?? [],
      category: row.category ?? undefined,
    } satisfies Service));
  }, fallbackServices.map(mapStaticService));
}

export async function fetchShows(): Promise<Show[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client) return fallbackShows.map(mapStaticShow);
    const { data, error } = await client
      .from('shows')
      .select('*, media:media(*)')
      .order('date', { ascending: true });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      date: row.date,
      venue: row.venue,
      city: row.city,
      country: row.country,
      genre: row.genre ?? undefined,
      description: row.description,
      status: (row.status ?? 'draft') as ContentStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history: (row.history ?? []) as ChangeLogEntry[],
      media: (row.media ?? []).map((media: any) => ({
        id: media.id,
        type: media.type,
        url: media.url,
        alt: media.alt,
        thumbnailUrl: media.thumbnail_url ?? undefined,
        provider: media.provider ?? 'unknown',
        metadata: media.metadata ?? undefined,
      })),
      tags: row.tags ?? [],
      setlist: row.setlist ?? [],
      heroImage: row.hero_image ?? undefined,
    } satisfies Show));
  }, fallbackShows.map(mapStaticShow));
}

export async function fetchDiscography(): Promise<DiscographyItem[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client) return fallbackDiscography.map(mapStaticDiscography);
    const { data, error } = await client.from('discography').select('*').order('year', { ascending: false });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      year: row.year,
      cover: row.cover,
      spotifyEmbed: row.spotify_embed,
      description: row.description,
      status: (row.status ?? 'draft') as ContentStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history: (row.history ?? []) as ChangeLogEntry[],
      tags: row.tags ?? [],
    } satisfies DiscographyItem));
  }, fallbackDiscography.map(mapStaticDiscography));
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client)
      return fallbackTestimonials.map((testimonial) => ({
        ...testimonial,
        title: testimonial.name,
        status: 'published' as ContentStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [],
      }));
    const { data, error } = await client.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      title: row.title ?? row.name,
      name: row.name ?? row.author,
      role: row.role ?? undefined,
      quote: row.quote,
      company: row.company ?? undefined,
      avatar: row.avatar ?? undefined,
      status: (row.status ?? 'draft') as ContentStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history: (row.history ?? []) as ChangeLogEntry[],
    } satisfies Testimonial));
  }, fallbackTestimonials.map((testimonial) => ({
    ...testimonial,
    title: testimonial.name,
    status: 'published' as ContentStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  })));
}

export async function fetchMembers(): Promise<Member[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client.from('members').select('*').order('display_order');
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      title: row.name,
      role: row.role,
      avatar: row.avatar ?? undefined,
      bio: row.bio,
      status: (row.status ?? 'draft') as ContentStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history: (row.history ?? []) as ChangeLogEntry[],
      social: row.social ?? [],
    } satisfies Member));
  }, []);
}

export async function fetchEvents(): Promise<UpcomingEvent[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client.from('events').select('*').order('starts_at');
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      startsAt: row.starts_at,
      venue: row.venue,
      city: row.city,
      country: row.country,
      format: row.format ?? undefined,
      ticketUrl: row.ticket_url ?? undefined,
      status: (row.status ?? 'draft') as ContentStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history: (row.history ?? []) as ChangeLogEntry[],
      tags: row.tags ?? [],
    } satisfies UpcomingEvent));
  }, []);
}

type UpsertOptions<T extends BaseContent> = {
  table: string;
  payload: Partial<T> & { id?: string };
  user: User | null;
  changeSummary: string;
};

async function upsertContent<T extends BaseContent>({ table, payload, user, changeSummary }: UpsertOptions<T>): Promise<T> {
  const client = getClient();
  if (!client) {
    throw new Error('Supabase client is not configured');
  }

  const id = payload.id ?? generateId();
  const now = new Date().toISOString();

  const historyEntry: ChangeLogEntry = {
    id: generateId(),
    userId: user?.id ?? 'unknown',
    userEmail: user?.email ?? 'unknown',
    change: changeSummary,
    createdAt: now,
  };

  const { data, error } = await client
    .from(table)
    .upsert({
      ...payload,
      id,
      updated_at: now,
      history: [...((payload as any)?.history ?? []), historyEntry],
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...(data as T),
    history: (data.history ?? []) as ChangeLogEntry[],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } satisfies T;
}

export async function saveService(service: Partial<Service>, user: User | null): Promise<Service> {
  return upsertContent<Service>({
    table: 'services',
    payload: service,
    user,
    changeSummary: `Actualización de servicio: ${service.title ?? service.id}`,
  });
}

export async function saveShow(show: Partial<Show>, user: User | null): Promise<Show> {
  return upsertContent<Show>({
    table: 'shows',
    payload: show,
    user,
    changeSummary: `Actualización de show: ${show.title ?? show.id}`,
  });
}

export async function saveDiscographyItem(item: Partial<DiscographyItem>, user: User | null): Promise<DiscographyItem> {
  return upsertContent<DiscographyItem>({
    table: 'discography',
    payload: item,
    user,
    changeSummary: `Actualización de release: ${item.title ?? item.id}`,
  });
}

export async function saveMember(member: Partial<Member>, user: User | null): Promise<Member> {
  return upsertContent<Member>({
    table: 'members',
    payload: member,
    user,
    changeSummary: `Actualización de integrante: ${member.title ?? member.id}`,
  });
}

export async function saveTestimonial(testimonial: Partial<Testimonial>, user: User | null): Promise<Testimonial> {
  return upsertContent<Testimonial>({
    table: 'testimonials',
    payload: testimonial,
    user,
    changeSummary: `Actualización de testimonio: ${testimonial.title ?? testimonial.id}`,
  });
}

export async function saveEvent(event: Partial<UpcomingEvent>, user: User | null): Promise<UpcomingEvent> {
  return upsertContent<UpcomingEvent>({
    table: 'events',
    payload: event,
    user,
    changeSummary: `Actualización de evento: ${event.title ?? event.id}`,
  });
}

async function removeById(table: string, id: string) {
  const client = getClient();
  if (!client) {
    throw new Error('Supabase client is not configured');
  }
  const { error } = await client.from(table).delete().eq('id', id);
  if (error) throw error;
}

export const deleteService = (id: string) => removeById('services', id);
export const deleteShow = (id: string) => removeById('shows', id);
export const deleteDiscographyItem = (id: string) => removeById('discography', id);
export const deleteMember = (id: string) => removeById('members', id);
export const deleteTestimonial = (id: string) => removeById('testimonials', id);
export const deleteEvent = (id: string) => removeById('events', id);
export const deleteMediaAsset = (id: string) => removeById('media_assets', id);

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  session: Session;
};

export async function restoreSession(tokens: AuthTokens): Promise<Session | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.auth.setSession({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });
  if (error) throw error;
  return data.session ?? null;
}

export { getClient as getSupabaseClient, isSupabaseConfigured };

export async function fetchMediaLibrary(): Promise<MediaAsset[]> {
  return withFallback(async () => {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client.from('media_assets').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      type: row.type,
      url: row.url,
      alt: row.alt ?? undefined,
      width: row.width ?? undefined,
      height: row.height ?? undefined,
      thumbnailUrl: row.thumbnail_url ?? undefined,
      provider: row.provider ?? 'unknown',
      metadata: row.metadata ?? undefined,
    } satisfies MediaAsset));
  }, []);
}

export async function registerMediaAsset(asset: MediaAsset & { createdAt?: string; updatedAt?: string }) {
  const client = getClient();
  const now = new Date().toISOString();
  const payload = {
    id: asset.id ?? generateId(),
    type: asset.type,
    url: asset.url,
    alt: asset.alt ?? null,
    width: asset.width ?? null,
    height: asset.height ?? null,
    thumbnail_url: asset.thumbnailUrl ?? null,
    provider: asset.provider ?? 'unknown',
    metadata: asset.metadata ?? {},
    created_at: asset.createdAt ?? now,
    updated_at: now,
  };

  if (!client) {
    return {
      id: payload.id,
      type: payload.type,
      url: payload.url,
      alt: asset.alt,
      width: asset.width,
      height: asset.height,
      thumbnailUrl: asset.thumbnailUrl,
      provider: asset.provider ?? 'unknown',
      metadata: asset.metadata,
    } satisfies MediaAsset;
  }

  const { data, error } = await client.from('media_assets').upsert(payload).select().single();
  if (error) throw error;

  return {
    id: data.id,
    type: data.type,
    url: data.url,
    alt: data.alt ?? undefined,
    width: data.width ?? undefined,
    height: data.height ?? undefined,
    thumbnailUrl: data.thumbnail_url ?? undefined,
    provider: data.provider ?? 'unknown',
    metadata: data.metadata ?? undefined,
  } satisfies MediaAsset;
}

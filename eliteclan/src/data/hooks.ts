import { useEffect, useMemo, useState } from 'react';

import type {
  DiscographyItem,
  Service as ServiceWithMeta,
  Show as ShowWithMeta,
  Testimonial as TestimonialWithMeta,
} from '../services/api';
import { fetchDiscography, fetchServices, fetchShows, fetchTestimonials } from '../services/api';
import { discography as staticDiscography } from './discography';
import { partners } from './partners';
import { services as staticServices } from './services';
import { shows as staticShows } from './shows';
import { testimonials as staticTestimonials } from './testimonials';

const nowISO = () => new Date().toISOString();

const mapService = (service: typeof staticServices[number]): ServiceWithMeta => ({
  ...service,
  status: 'published',
  createdAt: nowISO(),
  updatedAt: nowISO(),
  history: [],
});

const mapShow = (show: typeof staticShows[number]): ShowWithMeta => ({
  ...show,
  status: 'published',
  createdAt: nowISO(),
  updatedAt: nowISO(),
  history: [],
  media: show.media.map((media) => ({
    id: `${show.id}-${media.src}`,
    type: media.type === 'video' ? 'embed' : 'image',
    url: media.src,
    alt: media.alt,
    provider: media.type === 'video' ? 'youtube' : 'unknown',
  })),
});

const mapDiscography = (release: typeof staticDiscography[number]): DiscographyItem => ({
  ...release,
  status: 'published',
  createdAt: nowISO(),
  updatedAt: nowISO(),
  history: [],
});

const mapTestimonial = (item: typeof staticTestimonials[number]): TestimonialWithMeta => ({
  ...item,
  title: item.name,
  status: 'published',
  createdAt: nowISO(),
  updatedAt: nowISO(),
  history: [],
});

export const useServices = () => {
  const [items, setItems] = useState<ServiceWithMeta[]>(staticServices.map(mapService));

  useEffect(() => {
    let ignore = false;
    fetchServices()
      .then((result) => {
        if (!ignore) setItems(result);
      })
      .catch((error) => console.error('[services] fetch error', error));
    return () => {
      ignore = true;
    };
  }, []);

  return useMemo(() => items.filter((item) => item.status === 'published'), [items]);
};

export const useShows = (filters?: { tag?: string; upcomingOnly?: boolean }) => {
  const [items, setItems] = useState<ShowWithMeta[]>(staticShows.map(mapShow));

  useEffect(() => {
    let ignore = false;
    fetchShows()
      .then((result) => {
        if (!ignore) setItems(result);
      })
      .catch((error) => console.error('[shows] fetch error', error));
    return () => {
      ignore = true;
    };
  }, []);

  return useMemo(() => {
    const now = new Date();
    return items.filter((show) => {
      if (show.status !== 'published') return false;
      if (filters?.upcomingOnly && new Date(show.date) < now) return false;
      if (filters?.tag && !(show.tags ?? []).includes(filters.tag)) return false;
      return true;
    });
  }, [filters?.tag, filters?.upcomingOnly, items]);
};

export const useShowBySlug = (slug?: string) => {
  const shows = useShows();
  return useMemo(() => shows.find((show) => show.slug === slug), [shows, slug]);
};

export const useDiscography = () => {
  const [items, setItems] = useState<DiscographyItem[]>(staticDiscography.map(mapDiscography));

  useEffect(() => {
    let ignore = false;
    fetchDiscography()
      .then((result) => {
        if (!ignore) setItems(result);
      })
      .catch((error) => console.error('[discography] fetch error', error));
    return () => {
      ignore = true;
    };
  }, []);

  return useMemo(() => items.filter((item) => item.status === 'published'), [items]);
};

export const useTestimonials = () => {
  const [items, setItems] = useState<TestimonialWithMeta[]>(staticTestimonials.map(mapTestimonial));

  useEffect(() => {
    let ignore = false;
    fetchTestimonials()
      .then((result) => {
        if (!ignore) setItems(result);
      })
      .catch((error) => console.error('[testimonials] fetch error', error));
    return () => {
      ignore = true;
    };
  }, []);

  return useMemo(() => items.filter((item) => item.status === 'published'), [items]);
};

export const usePartners = () => useMemo(() => partners, []);

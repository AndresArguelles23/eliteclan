import { useMemo } from 'react';
import { discography, partners, services, shows, testimonials } from './index';

export const useServices = () => useMemo(() => services, []);

export const useShows = (filters?: { tag?: string; upcomingOnly?: boolean }) =>
  useMemo(() => {
    const now = new Date();
    return shows.filter((show) => {
      if (filters?.upcomingOnly && new Date(show.date) < now) return false;
      if (filters?.tag && !show.tags.includes(filters.tag)) return false;
      return true;
    });
  }, [filters?.tag, filters?.upcomingOnly]);

export const useShowBySlug = (slug?: string) =>
  useMemo(() => shows.find((show) => show.slug === slug), [slug]);

export const useDiscography = () => useMemo(() => discography, []);

export const useTestimonials = () => useMemo(() => testimonials, []);

export const usePartners = () => useMemo(() => partners, []);

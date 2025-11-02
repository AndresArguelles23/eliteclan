export type Release = {
  id: string;
  title: string;
  type: 'Album' | 'Single';
  year: number;
  cover: string;
  spotifyEmbed: string;
  description: string;
};

export const discography: Release[] = [
  {
    id: 'hyperreal-album',
    title: 'Hyperreal Atlas',
    type: 'Album',
    year: 2023,
    cover: 'https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?auto=format&fit=crop&w=800&q=80',
    spotifyEmbed: 'https://open.spotify.com/embed/album/1Xyo4u8uXC1ZmMpatF05PJ?utm_source=generator&theme=0',
    description:
      'Un viaje narrativo por texturas electrónicas, percusiones híbridas y voces procesadas inspiradas en paisajes futuristas.',
  },
  {
    id: 'single-aurora',
    title: 'Aurora Bloom',
    type: 'Single',
    year: 2024,
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    spotifyEmbed: 'https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b?utm_source=generator&theme=0',
    description: 'Melodías etéreas con sintetizadores modulados y ritmos inspirados en las auroras árticas.',
  },
  {
    id: 'single-neon',
    title: 'Neon Pulse',
    type: 'Single',
    year: 2022,
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    spotifyEmbed: 'https://open.spotify.com/embed/track/7ouMYWpwJ422jRcDASZB7P?utm_source=generator&theme=0',
    description: 'Groove club contundente con bajos 3D y percusiones futuristas diseñadas para sistemas inmersivos.',
  },
];

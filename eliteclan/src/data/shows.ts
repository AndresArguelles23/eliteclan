export type ShowMedia = {
  type: 'image' | 'video';
  src: string;
  alt: string;
};

export type Show = {
  id: string;
  slug: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  genre: string;
  description: string;
  tags: string[];
  heroImage: string;
  media: ShowMedia[];
};

export const shows: Show[] = [
  {
    id: 'quantum-lights',
    slug: 'quantum-lights-world-tour',
    title: 'Quantum Lights World Tour',
    date: '2024-11-16T20:00:00Z',
    venue: 'Luna Park Arena',
    city: 'Buenos Aires',
    country: 'Argentina',
    genre: 'Electronic',
    description:
      'Un espectáculo inmersivo con pantallas holográficas y visuales sincronizadas con beats futuristas.',
    tags: ['Gira', 'Inmersivo'],
    heroImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        type: 'video',
        src: 'https://www.youtube.com/embed/0p_eQGKFY3Q?autoplay=0&mute=1',
        alt: 'Aftermovie Quantum Lights',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        alt: 'Visuales LED sincronizadas con el público',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1200&q=80',
        alt: 'Show con luces verdes',
      },
    ],
  },
  {
    id: 'neon-sands',
    slug: 'neon-sands-festival',
    title: 'Neon Sands Festival',
    date: '2024-12-09T22:00:00Z',
    venue: 'Dunes Open Air',
    city: 'Iquique',
    country: 'Chile',
    genre: 'Bass / Trap',
    description:
      'Performance nocturna en el desierto con instalaciones lumínicas responsivas al movimiento del público.',
    tags: ['Festival', 'Outdoor'],
    heroImage: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        alt: 'Festival Neon Sands en el desierto',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        alt: 'Visuales púrpura en escenario principal',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
        alt: 'Público vibrando con la música',
      },
    ],
  },
  {
    id: 'skyline-sessions',
    slug: 'skyline-sessions',
    title: 'Skyline Sessions Rooftop',
    date: '2025-01-14T19:30:00Z',
    venue: 'Mirador Andino',
    city: 'Bogotá',
    country: 'Colombia',
    genre: 'House',
    description: 'Set sunset con transmisión en streaming 4K y audio espacial binaural.',
    tags: ['Streaming', 'Experiencia'],
    heroImage: 'https://images.unsplash.com/photo-1526481280695-3c46917bd318?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        alt: 'DJ set al atardecer en rooftop',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1461783436728-0a9217714694?auto=format&fit=crop&w=1200&q=80',
        alt: 'Ciudad iluminada al fondo',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        alt: 'Contraluces violetas sobre el público',
      },
    ],
  },
  {
    id: 'aqua-sonar',
    slug: 'aqua-sonar-experience',
    title: 'Aqua Sonar Immersive',
    date: '2025-02-22T21:00:00Z',
    venue: 'Centro de Convenciones Pacifico',
    city: 'Lima',
    country: 'Perú',
    genre: 'Ambient / IDM',
    description:
      'Instalación sonora 360° con mapping acuático, sensores biométricos y visuales orgánicos.',
    tags: ['Inmersivo', 'Tecnología'],
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
        alt: 'Instalación con visuales azules',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',
        alt: 'Público rodeado de luces aqua',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        alt: 'Detalle de hardware musical',
      },
    ],
  },
  {
    id: 'pulse-lab',
    slug: 'pulse-lab-workshop',
    title: 'Pulse Lab x Ableton',
    date: '2024-10-02T16:00:00Z',
    venue: 'Ableton Studio MX',
    city: 'Ciudad de México',
    country: 'México',
    genre: 'Workshop',
    description: 'Laboratorio creativo para productores con sesiones 1:1 y live set colaborativo.',
    tags: ['Educativo', 'Workshop'],
    heroImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
        alt: 'Productores en laboratorio musical',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        alt: 'Equipo de audio profesional',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1200&q=80',
        alt: 'Hands-on con controladores MIDI',
      },
    ],
  },
  {
    id: 'aurora-nights',
    slug: 'aurora-nights',
    title: 'Aurora Nights Residency',
    date: '2025-03-30T23:00:00Z',
    venue: 'Svalbard Sound Lab',
    city: 'Longyearbyen',
    country: 'Noruega',
    genre: 'Experimental',
    description: 'Residencia artística audiovisual inspirada en auroras boreales y sonidos árticos procesados.',
    tags: ['Residencia', 'Experimental'],
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    media: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
        alt: 'Paisaje de auroras boreales',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        alt: 'Setup de sintetizadores',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        alt: 'Intervención lumínica en hielo',
      },
    ],
  },
];

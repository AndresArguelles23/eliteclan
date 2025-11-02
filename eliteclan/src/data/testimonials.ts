export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 'sonarx',
    quote:
      'EliteClan transforma cada show en un universo inmersivo. Su control técnico y sentido artístico superó los estándares de nuestro festival.',
    name: 'Valentina Suárez',
    role: 'Directora de Producción',
    company: 'SonarX Festival',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ableton-latam',
    quote:
      'El equipo diseñó workshops interactivos impecables que conectaron a creadores emergentes con nuestra tecnología de manera orgánica.',
    name: 'Ernesto Martínez',
    role: 'Head of Education LATAM',
    company: 'Ableton',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
];

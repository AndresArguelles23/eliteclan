export type Service = {
  id: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const services: Service[] = [
  {
    id: 'tour-production',
    title: 'Tour Production & Stage Management',
    description:
      'Coordinación integral de giras nacionales e internacionales con equipos técnicos especializados y logística de primer nivel.',
    features: [
      'Diseño técnico de escenario y rider',
      'Gestión de staff, backline y transporte',
      'Operación en vivo y control de riesgos',
    ],
    ctaLabel: 'Solicitar agenda',
    ctaHref: '/contact',
  },
  {
    id: 'creative-direction',
    title: 'Creative Direction & Visual Storytelling',
    description:
      'Construimos narrativas visuales inmersivas que conectan con audiencias globales combinando arte, motion y tecnología.',
    features: [
      'Dirección artística y moodboards',
      'Producción de contenido multimedia',
      'Activaciones interactivas y mapping',
    ],
    ctaLabel: 'Revisar press kit',
    ctaHref: '/about',
  },
  {
    id: 'brand-partnerships',
    title: 'Brand Partnerships & Experiences',
    description:
      'Activaciones co-creadas con marcas que amplifican el proyecto musical e impulsan comunidades hiperconectadas.',
    features: [
      'Diseño de experiencias phygital',
      'Gestión comercial y contratos',
      'Métricas de impacto y reporting',
    ],
    ctaLabel: 'Hablemos',
    ctaHref: '/contact',
  },
];

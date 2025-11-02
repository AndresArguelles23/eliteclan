export type Partner = {
  id: string;
  name: string;
  logo: string;
  website: string;
};

export const partners: Partner[] = [
  {
    id: 'ableton',
    name: 'Ableton',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ableton_logo.svg',
    website: 'https://www.ableton.com/',
  },
  {
    id: 'native-instruments',
    name: 'Native Instruments',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/NI_Logo.svg',
    website: 'https://www.native-instruments.com/',
  },
  {
    id: 'red-bull',
    name: 'Red Bull Music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Red_Bull_logo.svg',
    website: 'https://www.redbull.com/',
  },
];

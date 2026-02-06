import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tarra | OAU Commerce',
    short_name: 'Tarra',
    description: 'Buy, sell, and discover trusted student brands and services in OAU.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#0F172A',
    icons: [
      {
        src: '/assets/favicon_nobg.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}

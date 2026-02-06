import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tarra.ng';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/status/',
        '/lighthouse',
        '/admin',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

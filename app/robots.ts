import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cockpit/', '/api/'],
      },
    ],
    sitemap: 'https://nellimmo.fr/sitemap.xml',
  };
}

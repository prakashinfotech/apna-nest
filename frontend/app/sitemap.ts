import type { MetadataRoute } from 'next'
import { LOCALITIES, NEWS_ARTICLES } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://apnanest.in'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/localities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/agents`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/tools/emi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/affordability`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/tools/rent-receipt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/post-property`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Dynamic routes from constants
  const localityRoutes: MetadataRoute.Sitemap = LOCALITIES.map((l) => ({
    url: `${base}/localities/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const newsRoutes: MetadataRoute.Sitemap = NEWS_ARTICLES.map((a) => ({
    url: `${base}/news/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...localityRoutes, ...newsRoutes]
}

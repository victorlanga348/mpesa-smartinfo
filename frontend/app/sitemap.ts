import type { MetadataRoute } from 'next'

const routes = [
  '/',
  '/login',
  '/register',
  '/auth',
  '/app/map',
  '/app/help',
  '/app/calculator',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `https://mpesa-smartinfo.vercel.app${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }))
}

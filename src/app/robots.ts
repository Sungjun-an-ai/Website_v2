import type { MetadataRoute } from 'next'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hsurethane.com').replace(/\/$/, '')
const gated = process.env.SITE_GATE_ENABLED === 'true'

export default function robots(): MetadataRoute.Robots {
  if (gated) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${siteUrl}/sitemap.xml`,
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/enter'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

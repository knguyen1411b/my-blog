import type { MetadataRoute } from 'next'

import { SITE_CONFIG } from '@/config/site'
import { getBlogs } from '@/features/blog/service/blog.service'
import { toSeoDate } from '@/lib/seo-date'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await getBlogs()
    return [
        { url: SITE_CONFIG.url, changeFrequency: 'weekly', priority: 1 },
        ...blogs.map(blog => ({
            url: `${SITE_CONFIG.url}/${blog.slug || blog.id}`,
            lastModified: toSeoDate(blog.updatedAt) || toSeoDate(blog.publishedAt) || toSeoDate(blog.createdAt),
            changeFrequency: 'monthly' as const,
            priority: blog.featured ? 0.9 : 0.8
        }))
    ]
}

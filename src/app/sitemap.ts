import type { MetadataRoute } from 'next'

import { SITE_CONFIG } from '@/config/site'
import { getBlogs } from '@/features/blog/service/blog.service'

const SITE_URL = SITE_CONFIG.url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const blogs = await getBlogs()

        const blogUrls: MetadataRoute.Sitemap = blogs.map(blog => {
            const slug = blog.slug || blog.id || String(blog.number)
            return {
                url: `${SITE_URL}/${slug}`,
                lastModified: blog.createdAt ? new Date(blog.createdAt) : new Date(),
                changeFrequency: 'weekly',
                priority: blog.featured ? 0.9 : 0.8
            }
        })

        return [
            {
                url: SITE_URL,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0
            },
            ...blogUrls
        ]
    } catch {
        return [
            {
                url: SITE_URL,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0
            }
        ]
    }
}

import type { MetadataRoute } from 'next'

import { SITE_CONFIG } from '@/config/site'

/**
 * Tối ưu hóa robots.txt cho:
 * 1. SEO: Googlebot, Bingbot, DuckDuckBot và các công cụ tìm kiếm truyền thống.
 * 2. GEO (Generative Engine Optimization): GPTBot, Google-Extended, PerplexityBot, ClaudeBot
 *    cho phép các hệ thống AI thu thập dữ liệu công khai để trích dẫn trực tiếp bài viết.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/admin/*']
            },
            {
                // Cho phép các AI Agents / LLM Web Crawlers đọc dữ liệu để trả lời câu hỏi và trích dẫn
                userAgent: SITE_CONFIG.aiCrawlers,
                allow: ['/', '/*'],
                disallow: ['/admin', '/admin/*']
            }
        ],
        sitemap: `${SITE_CONFIG.url}/sitemap.xml`
    }
}

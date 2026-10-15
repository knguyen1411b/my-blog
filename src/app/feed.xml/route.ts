import { NextResponse } from 'next/server'

import { SITE_CONFIG } from '@/config/site'
import { getBlogs } from '@/features/blog/service/blog.service'
import { toSeoDate } from '@/lib/seo-date'

export const revalidate = 3600 // Cache RSS feed for 1 hour

export async function GET() {
    try {
        const blogs = await getBlogs()

        const itemsXml = blogs
            .map(blog => {
                const slug = blog.slug || blog.id || String(blog.number)
                const articleUrl = `${SITE_CONFIG.url}/${slug}`
                const published = toSeoDate(blog.publishedAt) || toSeoDate(blog.createdAt)
                const pubDate = published ? new Date(published).toUTCString() : undefined
                const description = (blog.summary || blog.bodyText || blog.content || '').slice(0, 300)

                return `
        <item>
            <title><![CDATA[${blog.title}]]></title>
            <link>${articleUrl}</link>
            <guid isPermaLink="true">${articleUrl}</guid>
            <description><![CDATA[${description}]]></description>
            ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
            <author>${SITE_CONFIG.author.name}</author>
            ${(blog.tags || []).map(tag => `<category><![CDATA[${tag}]]></category>`).join('')}
        </item>`
            })
            .join('')

        const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title><![CDATA[${SITE_CONFIG.name}]]></title>
        <link>${SITE_CONFIG.url}</link>
        <description><![CDATA[${SITE_CONFIG.description}]]></description>
        <language>vi</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${SITE_CONFIG.url}/feed.xml" rel="self" type="application/rss+xml"/>
        ${itemsXml}
    </channel>
</rss>`

        return new NextResponse(rssXml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate'
            }
        })
    } catch {
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

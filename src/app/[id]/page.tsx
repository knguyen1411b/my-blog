import { cache } from 'react'

import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/config/site'
import { BlogSite } from '@/features/blog'
import { getBlog } from '@/features/blog/service/blog.service'

interface BlogDetailPageProps {
    params: Promise<{ id: string }>
}

const getCachedBlog = cache(async (id: string) => {
    try {
        return await getBlog(id)
    } catch {
        return null
    }
})

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { id } = await params
    const blog = await getCachedBlog(id)

    if (!blog) {
        return {
            title: 'Không Tìm Thấy Bài Viết',
            description: 'Bài viết không tồn tại hoặc đã được chuyển đi nơi khác.'
        }
    }

    const title = blog.title
    const description = (blog.summary || blog.bodyText || blog.content || '').slice(0, 160)
    const publishedTime = blog.publishedAt || blog.createdAt
    const tags = blog.tags || []
    const author = blog.author?.name || SITE_CONFIG.author.name
    const articleUrl = `${SITE_CONFIG.url}/${blog.slug || id}`
    const imageUrl = blog.coverImage || SITE_CONFIG.ogImage

    return {
        title,
        description,
        metadataBase: new URL(SITE_CONFIG.url),
        alternates: {
            canonical: articleUrl
        },
        authors: [{ name: author, url: SITE_CONFIG.portfolioUrl }],
        openGraph: {
            title,
            description,
            type: 'article',
            url: articleUrl,
            publishedTime,
            authors: [author],
            tags,
            locale: SITE_CONFIG.locale,
            siteName: 'Khanh Nguyen Blog',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: SITE_CONFIG.author.twitter,
            images: [imageUrl]
        }
    }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { id } = await params

    if (!id) notFound()

    const blog = await getCachedBlog(id)
    if (!blog) notFound()

    const articleUrl = `${SITE_CONFIG.url}/${blog.slug || id}`
    const imageUrl = blog.coverImage || SITE_CONFIG.ogImage

    return (
        <>
            <ArticleJsonLd
                title={blog.title}
                description={blog.summary || ''}
                url={articleUrl}
                imageUrl={imageUrl}
                datePublished={blog.publishedAt || blog.createdAt || ''}
                tags={blog.tags}
            />
            <BlogSite postId={id} initialBlog={blog} />
        </>
    )
}

import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { BlogSite } from '@/features/blog'
import { getBlog } from '@/features/blog/service/blog.service'

interface BlogDetailPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { id } = await params

    try {
        const blog = await getBlog(id)
        return {
            title: `${blog.title} | My Blog`,
            description: blog.body.slice(0, 160)
        }
    } catch {
        return { title: 'Post Not Found | My Blog' }
    }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { id } = await params

    const postId = Number(id)

    if (!Number.isFinite(postId)) notFound()

    return <BlogSite postId={postId} />
}

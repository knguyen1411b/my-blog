import type { IBlog } from '@/features/blog/types/blog'

import revisions from '../content/blogs.json' with { type: 'json' }
import posts from '../content/posts.json' with { type: 'json' }

const contentById: Record<string, Partial<IBlog>> = revisions

export function applyBlogContent(blog: IBlog): IBlog {
    const content = contentById[blog.id]
    if (!content) return blog
    const updatedAt = Date.parse(blog.updatedAt || '')
    if (updatedAt > Date.parse(content.updatedAt || '')) return blog
    return { ...blog, ...content, id: blog.id, slug: blog.slug }
}

const localPosts: IBlog[] = posts.map<IBlog>(post => ({ ...post, status: 'published' }))

export function getLocalBlog(slugOrId: string): IBlog | null {
    return localPosts.find(post => post.id === slugOrId || post.slug === slugOrId) || null
}

export function mergePublishedBlogs(
    remotePosts: IBlog[],
    { category, maxPosts = 50 }: { category?: string; maxPosts?: number } = {}
): IBlog[] {
    const localIds = new Set(localPosts.map(post => post.id))
    const localSlugs = new Set(localPosts.map(post => post.slug))
    const combined = [
        ...localPosts,
        ...remotePosts.filter(post => !localIds.has(post.id) && !localSlugs.has(post.slug))
    ].filter(post => post.status !== 'draft')
    const date = (post: IBlog) =>
        Date.parse(post.publishedAt) || Date.parse(post.createdAt || post.updatedAt || '') || 0

    return combined
        .filter(
            post =>
                !category || category === 'ALL' || post.category.slug === category || post.category.name === category
        )
        .sort((a, b) => date(b) - date(a) || a.slug.localeCompare(b.slug))
        .slice(0, maxPosts)
}

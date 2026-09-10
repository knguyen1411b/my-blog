import { getFirebaseBlogBySlug, getFirebaseBlogs } from '@/features/blog/service/firebase-blog.service'
import type { IBlog, IBlogDetail } from '@/features/blog/types/blog'

export async function getBlogs(): Promise<IBlog[]> {
    try {
        return await getFirebaseBlogs({ status: 'published' })
    } catch {
        return []
    }
}

export async function getBlog(postId: unknown): Promise<IBlogDetail | null> {
    const idStr = String(postId)
    try {
        return await getFirebaseBlogBySlug(idStr)
    } catch {
        return null
    }
}

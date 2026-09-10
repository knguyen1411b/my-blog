import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore'

import type { IBlog, IBlogDetail } from '@/features/blog/types/blog'
import { db } from '@/lib/firebase'

const BLOGS_COLLECTION = 'blogs'

/**
 * Chuyển chuỗi tiếng Việt thành slug URL chuẩn SEO
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export interface GetBlogsOptions {
    status?: 'published' | 'draft' | 'all'
    category?: string
    search?: string
    maxPosts?: number
}

/**
 * Chuyển Firestore Timestamp thành chuỗi ISO 8601 để an toàn khi truyền từ Server Component sang Client Component.
 * Next.js 16 không cho phép truyền object có phương thức .toJSON() (ví dụ: Firestore Timestamp).
 */
function serializeTimestamp(value: unknown): string | null {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value && typeof (value as { toDate?: unknown }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().toISOString()
    }
    return String(value)
}

/**
 * Chuyển một document Firestore thành plain object an toàn cho Server → Client Component.
 */
function sanitizeDoc(id: string, data: Record<string, unknown>): Record<string, unknown> {
    return {
        ...Object.fromEntries(
            Object.entries(data).map(([k, v]) => {
                // Chuyển Timestamp fields thành string
                if (v && typeof (v as { toDate?: unknown }).toDate === 'function') {
                    return [k, serializeTimestamp(v)]
                }
                return [k, v]
            })
        ),
        id
    }
}

/**
 * Lấy danh sách bài viết từ Firestore (hỗ trợ lọc theo trạng thái, chuyên mục)
 */
export async function getFirebaseBlogs(options: GetBlogsOptions = {}): Promise<IBlog[]> {
    const { status = 'published', category, maxPosts = 50 } = options

    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        let q = query(blogsRef, limit(maxPosts))

        if (status !== 'all') {
            q = query(blogsRef, where('status', '==', status), limit(maxPosts))
        }

        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            return []
        }

        let posts = snapshot.docs.map(docSnap => {
            const data = docSnap.data() as Record<string, unknown>
            return {
                id: docSnap.id,
                slug: (data.slug as string) || docSnap.id,
                title: (data.title as string) || '',
                summary: (data.summary as string) || '',
                content: (data.content as string) || '',
                category: data.category || { id: 'general', name: 'Công Cụ Hữu Ích', slug: 'cong-cu-huu-ich' },
                tags: (data.tags as string[]) || [],
                author: data.author || {
                    name: 'Nguyễn Đình Khánh Nguyên',
                    role: 'Fullstack Software Engineer',
                    avatar: 'https://github.com/knguyen1411b.png'
                },
                publishedAt: serializeTimestamp(data.publishedAt) || (data.publishedAt as string) || 'Vừa xong',
                readingTime: (data.readingTime as string) || '2 phút',
                views: (data.views as number) || 0,
                status: (data.status as string) || 'published',
                featured: Boolean(data.featured),
                coverImage: (data.coverImage as string) || ''
            } as IBlog
        })

        // Lọc category phía client nếu có
        if (category && category !== 'ALL') {
            posts = posts.filter(p => p.category?.slug === category || p.category?.name === category)
        }

        return posts
    } catch {
        return []
    }
}

/**
 * Lấy chi tiết bài viết theo slug hoặc ID từ Firestore.
 * Tách riêng 2 try-catch để luôn thực hiện fallback getDoc ngay cả khi query slug thất bại.
 */
export async function getFirebaseBlogBySlug(slugOrId: string): Promise<IBlogDetail | null> {
    // 1. Thử tìm theo trường slug (có thể fail nếu thiếu index hoặc lỗi network)
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        const q = query(blogsRef, where('slug', '==', slugOrId), limit(1))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            const docSnap = snapshot.docs[0]
            const data = docSnap.data() as Record<string, unknown>
            return sanitizeDoc(docSnap.id, data) as unknown as IBlogDetail
        }
    } catch {
        // Slug query thất bại → tiếp tục thử bước 2
    }

    // 2. Fallback: tìm trực tiếp theo document ID
    try {
        const docRef = doc(db, BLOGS_COLLECTION, slugOrId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const data = docSnap.data() as Record<string, unknown>
            return sanitizeDoc(docSnap.id, data) as unknown as IBlogDetail
        }
    } catch {
        return null
    }

    return null
}

/**
 * Tạo bài viết mới trên Firestore
 */
export async function createFirebaseBlog(blogData: Omit<IBlog, 'id'>): Promise<string> {
    const slug = blogData.slug ? generateSlug(blogData.slug) : generateSlug(blogData.title)
    const blogsRef = collection(db, BLOGS_COLLECTION)

    const docRef = await addDoc(blogsRef, {
        ...blogData,
        slug,
        views: blogData.views || 0,
        status: blogData.status || 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    })

    return docRef.id
}

/**
 * Cập nhật bài viết trên Firestore
 */
export async function updateFirebaseBlog(id: string, blogData: Partial<IBlog>): Promise<void> {
    const docRef = doc(db, BLOGS_COLLECTION, id)
    const updatePayload: Record<string, unknown> = {
        ...blogData,
        updatedAt: serverTimestamp()
    }

    if (blogData.title && !blogData.slug) {
        updatePayload.slug = generateSlug(blogData.title)
    }

    await setDoc(docRef, updatePayload, { merge: true })
}

/**
 * Xóa bài viết khỏi Firestore
 */
export async function deleteFirebaseBlog(id: string): Promise<void> {
    const docRef = doc(db, BLOGS_COLLECTION, id)
    await deleteDoc(docRef)
}

/**
 * Bật/tắt trạng thái Featured
 */
export async function toggleFirebaseBlogFeatured(id: string, currentFeatured: boolean): Promise<boolean> {
    const docRef = doc(db, BLOGS_COLLECTION, id)
    const nextVal = !currentFeatured
    await updateDoc(docRef, { featured: nextVal })
    return nextVal
}

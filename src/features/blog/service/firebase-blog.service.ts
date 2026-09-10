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
            const data = docSnap.data()
            return {
                id: docSnap.id,
                slug: data.slug || docSnap.id,
                title: data.title || '',
                summary: data.summary || '',
                content: data.content || '',
                category: data.category || { id: 'general', name: 'Công Cụ Hữu Ích', slug: 'cong-cu-huu-ich' },
                tags: data.tags || [],
                author: data.author || {
                    name: 'Nguyễn Đình Khánh Nguyên',
                    role: 'Fullstack Software Engineer',
                    avatar: 'https://github.com/knguyen1411b.png'
                },
                publishedAt: data.publishedAt || 'Vừa xong',
                readingTime: data.readingTime || '2 phút',
                views: data.views || 0,
                status: data.status || 'published',
                featured: Boolean(data.featured),
                coverImage: data.coverImage || ''
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
 * Lấy chi tiết bài viết theo slug hoặc ID từ Firestore
 */
export async function getFirebaseBlogBySlug(slugOrId: string): Promise<IBlogDetail | null> {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)

        // 1. Thử tìm theo trường slug
        const q = query(blogsRef, where('slug', '==', slugOrId), limit(1))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            const docSnap = snapshot.docs[0]
            const data = docSnap.data()
            return {
                id: docSnap.id,
                ...data
            } as IBlogDetail
        }

        // 2. Thử tìm theo document ID trực tiếp
        const docRef = doc(db, BLOGS_COLLECTION, slugOrId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as IBlogDetail
        }

        return null
    } catch {
        return null
    }
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

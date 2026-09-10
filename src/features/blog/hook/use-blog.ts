'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    type GetBlogsOptions,
    createFirebaseBlog,
    deleteFirebaseBlog,
    getFirebaseBlogBySlug,
    getFirebaseBlogs,
    toggleFirebaseBlogFeatured,
    updateFirebaseBlog
} from '@/features/blog/service/firebase-blog.service'
import type { IBlog, IBlogDetail } from '@/features/blog/types/blog'

export function useBlogs(options: GetBlogsOptions = {}, initialData?: IBlog[], enabled = true) {
    return useQuery({
        queryKey: ['blogs', options, enabled],
        queryFn: async (): Promise<IBlog[]> => {
            return await getFirebaseBlogs(options)
        },
        initialData,
        enabled
    })
}

export function useBlogDetail(slugOrId: number | string, initialData?: IBlogDetail | null) {
    const key = String(slugOrId)
    return useQuery({
        queryKey: ['blogs', key],
        queryFn: async (): Promise<IBlogDetail | null> => {
            return await getFirebaseBlogBySlug(key)
        },
        enabled: Boolean(slugOrId),
        initialData
    })
}

export function useCreateBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (blogData: Omit<IBlog, 'id'>) => {
            return await createFirebaseBlog(blogData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })
}

export function useUpdateBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<IBlog> }) => {
            return await updateFirebaseBlog(id, data)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            queryClient.invalidateQueries({ queryKey: ['blogs', variables.id] })
        }
    })
}

export function useDeleteBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            return await deleteFirebaseBlog(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })
}

export function useToggleFeaturedBlog() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
            return await toggleFirebaseBlogFeatured(id, featured)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })
}

'use client'

import { useQuery } from '@tanstack/react-query'

import type { IBlog, IBlogDetail } from '@/features/blog/types/blog'

export function useBlogs() {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async (): Promise<IBlog[]> => {
            const response = await fetch('/api/blogs')
            if (!response.ok) {
                throw new Error('Failed to fetch blogs')
            }
            return response.json()
        }
    })
}

export function useBlogDetail(id: number) {
    return useQuery({
        queryKey: ['blogs', id],
        queryFn: async (): Promise<IBlogDetail> => {
            const response = await fetch(`/api/blogs/${id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch blog detail')
            }
            return response.json()
        },
        enabled: Number.isInteger(id) && id > 0
    })
}

'use client'

import { useQuery } from '@tanstack/react-query'

import type { IMe } from '@/features/home/types/me'

export const useMe = () => {
    const query = useQuery({
        queryKey: ['me', 'profile'],
        queryFn: async (): Promise<IMe> => {
            const response = await fetch('/api/me')
            if (!response.ok) {
                throw new Error('Failed to fetch profile')
            }
            return response.json()
        }
    })

    return {
        me: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch
    }
}

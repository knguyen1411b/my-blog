'use client'

import { type ReactNode, useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactLenis } from 'lenis/react'

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1
                    }
                }
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
                {children}
            </ReactLenis>
        </QueryClientProvider>
    )
}

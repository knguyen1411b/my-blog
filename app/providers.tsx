'use client'

import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 10 * 60 * 1000,
                        retry: 1,
                        refetchOnReconnect: true,
                        refetchOnWindowFocus: false,
                        placeholderData: (previousData: unknown) => previousData
                    }
                }
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                enableColorScheme
            >
                {children}
            </NextThemesProvider>
        </QueryClientProvider>
    )
}

'use client'

import { usePathname } from 'next/navigation'

export function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    return (
        <main id="main-content" className={`flex-1 ${isAdmin ? '' : 'pt-14 sm:pt-16'}`}>
            {children}
        </main>
    )
}

import type { Metadata } from 'next'

import { Bitter, Manrope } from 'next/font/google'

import { ThemeToggle } from '@/components/ThemeToggle'

import './globals.css'
import Providers from './providers'

const sans = Manrope({
    subsets: ['latin'],
    variable: '--font-sans'
})

const serif = Bitter({
    subsets: ['latin'],
    variable: '--font-serif'
})

export const metadata: Metadata = {
    title: 'My Blog',
    description: 'A blog powered by GitHub Discussions and Next.js'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
            <body className={`${sans.variable} ${serif.variable}`}>
                <Providers>
                    <ThemeToggle />
                    {children}
                </Providers>
            </body>
        </html>
    )
}

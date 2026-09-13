import type { Metadata, Viewport } from 'next'

import { JetBrains_Mono, Outfit } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { BackgroundEffect, ScrollToTopButton, SpotlightCursor } from '@/components/layout'
import { RootJsonLd } from '@/components/seo/JsonLd'
import { SITE_CONFIG } from '@/config/site'

import './globals.css'
import Providers from './providers'

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans'
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-mono'
})

export const viewport: Viewport = {
    themeColor: '#07090e',
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1
}

export const metadata: Metadata = {
    title: {
        default: SITE_CONFIG.name,
        template: '%s | Khanh Nguyen Blog'
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.portfolioUrl }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
        canonical: SITE_CONFIG.url,
        languages: SITE_CONFIG.languages
    },
    openGraph: {
        title: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        siteName: 'Khanh Nguyen Blog',
        locale: SITE_CONFIG.locale,
        type: 'website',
        images: [
            {
                url: SITE_CONFIG.ogImage,
                width: 1200,
                height: 630,
                alt: SITE_CONFIG.name
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        creator: SITE_CONFIG.author.twitter,
        images: [SITE_CONFIG.ogImage]
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    // Tối ưu hóa định danh nội dung số và trích dẫn AI (GEO & Dublin Core)
    other: {
        'application-name': 'Khanh Nguyen Blog',
        generator: 'Next.js 16 (Turbopack)',
        'DC.title': SITE_CONFIG.name,
        'DC.creator': SITE_CONFIG.author.name,
        'DC.language': 'vi',
        'DC.subject': 'Software Engineering, Next.js 16, React 19, TypeScript, Cloud Firestore, AI',
        // Tín hiệu chỉ dẫn cho AI Overviews và LLM Crawlers
        'ai-content-declarations': 'human-authored',
        citation_author: SITE_CONFIG.author.name,
        citation_title: SITE_CONFIG.name
    },
    // Google Search Console verification
    verification: {
        google: '5C_xXN6XrzNvYiiBlkXoys4q5mpQsosTvLPjlH4xhUk'
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
            <body
                className={`${outfit.variable} ${jetbrainsMono.variable} min-h-screen bg-[#07090e] text-[#e2e8f0] font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200`}
            >
                <Providers>
                    <RootJsonLd />
                    {children}
                    <BackgroundEffect />
                    <SpotlightCursor glowColor="130,92,193" />
                    <ScrollToTopButton />
                    {/* Vercel Analytics: page views, referrers, countries, devices */}
                    <Analytics />
                </Providers>
            </body>
        </html>
    )
}

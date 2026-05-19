'use client'

import { useRouter } from 'next/navigation'

import { Button, Card } from '@heroui/react'
import { BookOpen, House } from 'lucide-react'

export default function NotFound() {
    const router = useRouter()

    return (
        <main className="container flex min-h-[100dvh] items-center py-10">
            <section className="hero-grid glass-panel mx-auto w-full max-w-3xl rounded-[var(--radius-2xl)] p-8 text-center md:p-12">
                <p className="eyebrow">404 Error</p>
                <h1 className="editorial-title mt-4 text-4xl font-black md:text-6xl">This page could not be found</h1>
                <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
                    The page may have been moved, removed, or the URL might be incorrect.
                </p>
                <Card className="glass-panel mx-auto mt-8 max-w-md rounded-[var(--radius-xl)]">
                    <Card.Content className="p-6">
                        <p className="text-sm text-[var(--text-muted)]">
                            Try returning to the homepage and open an article from the latest list.
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-3">
                            <Button
                                variant="primary"
                                className="rounded-full px-6 font-semibold"
                                onPress={() => router.push('/')}
                            >
                                <House size={16} aria-hidden="true" />
                                Back Home
                            </Button>
                            <Button
                                variant="ghost"
                                className="rounded-full border border-[var(--border)] font-semibold"
                                onPress={() => router.push('/#posts')}
                            >
                                <BookOpen size={16} aria-hidden="true" />
                                Browse Posts
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
            </section>
        </main>
    )
}

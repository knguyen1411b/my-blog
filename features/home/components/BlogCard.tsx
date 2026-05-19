import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button, Card } from '@heroui/react'
import { ArrowRight } from 'lucide-react'

import type { IBlog } from '@/features/blog/types/blog'

export function BlogCard({ blog }: { blog: IBlog }) {
    const router = useRouter()
    const publishedAt = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(blog.createdAt))

    return (
        <Card className="group rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:bg-[var(--surface-soft)]/55">
            <Card.Content className="space-y-4 pt-5">
                <h2 className="editorial-title text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                    {blog.title}
                </h2>
                <p className="line-clamp-3 text-sm text-[var(--text-muted)] md:text-base">
                    {blog.bodyText.slice(0, 220)}…
                </p>
            </Card.Content>

            <Card.Footer className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Image
                        src={blog.author.avatarUrl}
                        alt={`${blog.author.login} avatar`}
                        width={36}
                        height={36}
                        className="rounded-full border border-[var(--border)] object-cover"
                    />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{blog.author.login}</p>
                        <p className="text-xs text-[var(--text-muted)]">{publishedAt}</p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="rounded-full px-5 font-semibold shadow-none"
                    onPress={() => router.push(`/${blog.number}`)}
                >
                    Read
                    <ArrowRight size={16} aria-hidden="true" />
                </Button>
            </Card.Footer>
        </Card>
    )
}

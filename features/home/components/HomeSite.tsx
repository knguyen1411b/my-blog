'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button, Card } from '@heroui/react'
import { Compass, GitBranchIcon } from 'lucide-react'

import { Loading } from '@/components/Loading'
import { useBlogs } from '@/features/blog/hook/use-blog'
import { useMe } from '@/features/home/hook/use-me'
import { REPOSITORY_NAME, REPOSITORY_OWNER } from '@/lib/contansts'

import { BlogCard } from './BlogCard'

export const HomeSite = () => {
    const router = useRouter()
    const { me, error: meError, isLoading: meIsLoading } = useMe()
    const { data: blogs, error: blogsError, isLoading: blogsIsLoading } = useBlogs()

    if (meIsLoading || blogsIsLoading) return <Loading />

    return (
        <main id="main-content" className="container py-10 md:py-14">
            <section className="hero-grid glass-panel mb-12 overflow-hidden rounded-[var(--radius-2xl)] p-8 md:p-12">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className="eyebrow">Personal Engineering Journal</p>
                        <h1 className="editorial-title mt-5 max-w-3xl text-4xl font-black md:text-6xl">
                            Ideas, Systems, and Lessons from Building on the Web
                        </h1>
                        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--text-muted)] md:text-base">
                            A concise collection of practical posts from GitHub Discussions, presented in a calm
                            editorial reading experience for daily engineering work.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                variant="primary"
                                className="rounded-full px-6 font-semibold"
                                onPress={() =>
                                    window.open(`https://github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}`, '_blank')
                                }
                            >
                                <GitBranchIcon size={16} aria-hidden="true" />
                                Open GitHub
                            </Button>
                            <Button
                                variant="ghost"
                                className="rounded-full border border-[var(--border)] font-semibold"
                                onPress={() => router.push('#posts')}
                            >
                                <Compass size={16} aria-hidden="true" />
                                Explore Posts
                            </Button>
                        </div>
                    </div>

                    <Card className="glass-panel w-full max-w-xs rounded-[var(--radius-xl)]">
                        <Card.Content className="flex items-center gap-4 p-5">
                            {me?.avatarUrl ? (
                                <Image
                                    src={me.avatarUrl}
                                    alt={`${me?.login || 'author'} avatar`}
                                    width={64}
                                    height={64}
                                    className="h-16 w-16 rounded-full border border-[var(--border)] object-cover"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full border border-[var(--border)] bg-[var(--surface-soft)]" />
                            )}
                            <div>
                                <p className="eyebrow">Author</p>
                                <p className="mt-1 text-xl font-bold">{me?.name || me?.login || 'Loading...'}</p>
                                <p className="text-sm text-[var(--text-muted)]">{blogs?.length ?? 0} published posts</p>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </section>

            <section id="posts" className="space-y-6">
                <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/85 p-5 md:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="eyebrow">Archive</p>
                            <h2 className="editorial-title mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                                Latest Articles
                            </h2>
                        </div>
                        <div className="hidden h-px w-32 bg-[var(--border)] md:block md:w-52" />
                    </div>
                </div>

                {blogsError || meError ? (
                    <Card className="glass-panel rounded-[var(--radius-xl)]">
                        <Card.Content className="p-8 text-center text-[var(--text-muted)]">
                            Cannot load data from GitHub. Check token or repository setup.
                        </Card.Content>
                    </Card>
                ) : blogs?.length === 0 ? (
                    <Card className="glass-panel rounded-[var(--radius-xl)]">
                        <Card.Content className="p-8 text-center text-[var(--text-muted)]">No posts yet.</Card.Content>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {blogs?.map(blog => (
                            <BlogCard key={blog.number} blog={blog} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

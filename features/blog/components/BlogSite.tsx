'use client'

import { useMemo } from 'react'

import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'

import { Button, Card } from '@heroui/react'
import { GitBranchIcon, MoveLeft } from 'lucide-react'

import { Loading } from '@/components/Loading'
import { useBlogDetail } from '@/features/blog/hook/use-blog'
import { REPOSITORY_NAME, REPOSITORY_OWNER } from '@/lib/contansts'
import { extractToc } from '@/lib/toc'

import { MarkdownRenderer } from './MarkdownRenderer'
import { TableOfContents } from './TableOfContents'

export function BlogSite({ postId }: { postId: number }) {
    const router = useRouter()
    const { data: blog, isLoading, isError } = useBlogDetail(postId)
    const tocItems = useMemo(() => extractToc(blog?.body ?? ''), [blog?.body])

    if (isLoading) return <Loading />
    if (isError) notFound()
    if (!blog) return <Loading />

    return (
        <main id="main-content" className="container py-10 md:py-14">
            <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onPress={() => router.push('/')}
                    className="rounded-full border border-[var(--border)]"
                >
                    <MoveLeft size={16} aria-hidden="true" />
                    Back to all posts
                </Button>
                <div className="flex items-center gap-3">
                    <Image
                        src={blog.author.avatarUrl}
                        alt={`${blog.author.login} avatar`}
                        width={36}
                        height={36}
                        className="rounded-full border border-[var(--border)] object-cover"
                    />
                    <div>
                        <p className="text-sm font-semibold">{blog.author.login}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(blog.createdAt))}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <div className="space-y-6">
                    <Card className="p-10 glass-panel rounded-[var(--radius-2xl)]">
                        <Card.Header className="pb-3">
                            <div>
                                <p className="eyebrow">Article</p>
                                <h1 className="editorial-title mt-2 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                                    {blog.title}
                                </h1>
                            </div>
                        </Card.Header>
                        <Card.Content>
                            <div className="mb-6 h-px w-full bg-[var(--border)]" />
                            <MarkdownRenderer content={blog.body} className="markdown-body" />
                        </Card.Content>
                    </Card>

                    <Card className="p-10 glass-panel rounded-[var(--radius-xl)]">
                        <Card.Header>
                            <div>
                                <p className="eyebrow">Discussion</p>
                                <h2 className="editorial-title mt-2 text-2xl font-black tracking-tight">
                                    Comments ({blog.comments.totalCount})
                                </h2>
                            </div>
                        </Card.Header>
                        <Card.Content className="space-y-5">
                            {blog.comments.nodes.length === 0 ? (
                                <p className="text-sm text-[var(--text-muted)]">No comments yet.</p>
                            ) : (
                                blog.comments.nodes.map((comment, index) => (
                                    <article
                                        key={`${comment.author.login}-${comment.createdAt}-${index}`}
                                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/55 p-4"
                                    >
                                        <div className="mb-2 flex items-center gap-2 text-sm">
                                            <span className="font-semibold">{comment.author.login}</span>
                                            <span className="text-[var(--text-muted)]">
                                                {new Intl.DateTimeFormat('en-US', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                }).format(new Date(comment.createdAt))}
                                            </span>
                                        </div>
                                        <MarkdownRenderer content={comment.body} className="markdown-body" />

                                        {comment.replies.nodes.length > 0 && (
                                            <div className="mt-4 space-y-3 border-l border-[var(--border)] pl-4">
                                                {comment.replies.nodes.map((reply, replyIndex) => (
                                                    <article
                                                        key={`${reply.author.login}-${reply.createdAt}-${replyIndex}`}
                                                        className="rounded-xl bg-[var(--surface)] p-3"
                                                    >
                                                        <div className="mb-1 flex items-center gap-2 text-xs">
                                                            <span className="font-semibold">{reply.author.login}</span>
                                                            <span className="text-[var(--text-muted)]">
                                                                {new Intl.DateTimeFormat('en-US', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short'
                                                                }).format(new Date(reply.createdAt))}
                                                            </span>
                                                        </div>
                                                        <MarkdownRenderer
                                                            content={reply.body}
                                                            className="markdown-body"
                                                        />
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))
                            )}
                        </Card.Content>
                    </Card>
                </div>

                <div className="space-y-6 xl:sticky xl:top-6 xl:max-h-[calc(100dvh-3rem)] xl:overflow-auto">
                    <Button
                        variant="primary"
                        className="w-full rounded-full font-semibold"
                        onPress={() =>
                            window.open(
                                `https://github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/discussions/${postId}`,
                                '_blank'
                            )
                        }
                    >
                        <GitBranchIcon size={16} aria-hidden="true" />
                        Open GitHub
                    </Button>
                    <TableOfContents items={tocItems} />
                </div>
            </section>
        </main>
    )
}

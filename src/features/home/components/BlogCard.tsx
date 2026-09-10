'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, Clock, Eye, Sparkles } from 'lucide-react'

import type { IBlog } from '@/features/blog/types/blog'

export function BlogCard({ blog }: { blog: IBlog }) {
    const publishedAt =
        blog.publishedAt ||
        (blog.createdAt
            ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(blog.createdAt))
            : 'Mới xuất bản')

    const authorName = blog.author?.name || blog.author?.login || 'Nguyễn Đình Khánh Nguyên'
    const authorAvatar = blog.author?.avatar || blog.author?.avatarUrl || 'https://github.com/knguyen1411b.png'

    const excerpt = blog.summary || blog.bodyText || blog.content || ''
    const postSlug = blog.slug || blog.id || String(blog.number)

    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c101c]/80 p-6 sm:p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-[#0e1424] hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]">
            {/* Cover Image Thumbnail */}
            {blog.coverImage && (
                <Link
                    href={`/${postSlug}`}
                    prefetch
                    className="group/thumb relative -mx-2 -mt-2 mb-4 block overflow-hidden rounded-2xl border border-white/[0.08] aspect-[16/9] shadow-md transition-all duration-300 hover:border-sky-400/40"
                >
                    <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 group-hover/thumb:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-[#0c101c]/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-40" />
                </Link>
            )}

            <div className="space-y-4">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {blog.category?.name && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-400">
                                <Sparkles size={11} />
                                <span>{blog.category.name}</span>
                            </span>
                        )}

                        {blog.featured && (
                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                                ★ Nổi bật
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                            <Clock size={13} className="text-slate-500" />
                            <span>{blog.readingTime || '2 phút'}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Eye size={13} className="text-slate-500" />
                            <span>{blog.views ?? 0}</span>
                        </span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/${postSlug}`} className="block group-hover:text-sky-300 transition-colors">
                    <h2 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-white line-clamp-2">
                        {blog.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="line-clamp-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {excerpt.slice(0, 240)}…
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {blog.tags.slice(0, 4).map(tag => (
                            <span
                                key={tag}
                                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Image
                        src={authorAvatar}
                        alt={`${authorName} avatar`}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border border-white/10 object-cover"
                    />
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{authorName}</p>
                        <p className="text-[11px] text-slate-500">{publishedAt}</p>
                    </div>
                </div>

                <Link
                    href={`/${postSlug}`}
                    prefetch
                    className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 shadow-sm transition hover:border-sky-400 hover:bg-sky-500 hover:text-white group-hover:scale-[1.03]"
                >
                    <span>Đọc bài</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </article>
    )
}

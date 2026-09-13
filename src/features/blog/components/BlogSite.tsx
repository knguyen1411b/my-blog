'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'

import { motion, useScroll, useSpring } from 'framer-motion'
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    Copy,
    Eye,
    Globe,
    Heart,
    Home,
    ImageIcon,
    MessageSquare,
    Send,
    Share2,
    Sparkles,
    Tag,
    UserCheck
} from 'lucide-react'

import { Loading } from '@/components/Loading'
import { useBlogDetail } from '@/features/blog/hook/use-blog'
import type { IBlogDetail, IComment } from '@/features/blog/types/blog'
import { extractToc } from '@/lib/toc'

import { MarkdownRenderer } from './MarkdownRenderer'
import { TableOfContents } from './TableOfContents'

const PORTFOLIO_URL = 'https://ndknguyen.io.vn'

export function BlogSite({ postId, initialBlog }: { postId: number | string; initialBlog?: IBlogDetail }) {
    const router = useRouter()
    const { data: blog, isLoading, isError } = useBlogDetail(postId, initialBlog)

    const [copied, setCopied] = useState(false)
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(() => initialBlog?.likes ?? 42)
    const [commentAuthor, setCommentAuthor] = useState('')
    const [commentText, setCommentText] = useState('')
    const [localComments, setLocalComments] = useState<IComment[]>([])

    // Scroll reading progress
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const articleContent = blog?.content || blog?.body || blog?.bodyText || ''
    const tocItems = useMemo(() => extractToc(articleContent), [articleContent])

    if (isLoading && !blog) return <Loading />
    if (isError || !blog) notFound()

    const authorName = blog.author?.name || blog.author?.login || 'Nguyễn Đình Khánh Nguyên'
    const authorAvatar = blog.author?.avatar || blog.author?.avatarUrl || 'https://github.com/knguyen1411b.png'
    const publishedDate =
        blog.publishedAt ||
        (blog.createdAt
            ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(blog.createdAt))
            : '01 tháng 09, 2026')
    const categoryName = blog.category?.name || 'Công Cụ Hữu Ích'
    const readingTime = blog.readingTime || '2 phút'
    const viewCount = blog.views ?? 208
    const coverImage =
        blog.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop'

    const handleCopyLink = async () => {
        try {
            if (typeof window !== 'undefined') {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                setTimeout(() => setCopied(false), 2500)
            }
        } catch {
            setCopied(false)
        }
    }

    const handleToggleLike = () => {
        if (liked) {
            setLiked(false)
            setLikeCount(prev => Math.max(0, prev - 1))
        } else {
            setLiked(true)
            setLikeCount(prev => prev + 1)
        }
    }

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim()) return

        const newComment: IComment = {
            id: String(Date.now()),
            authorName: commentAuthor.trim() || 'Lập trình viên khách',
            content: commentText.trim(),
            createdAt: new Intl.DateTimeFormat('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(new Date())
        }

        setLocalComments(prev => [newComment, ...prev])
        setCommentText('')
    }

    const allComments = [...localComments, ...(blog.comments || [])]

    return (
        <>
            {/* Top Reading Progress Laser */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 shadow-[0_0_14px_rgba(56,189,248,0.7)] origin-left"
                style={{ scaleX }}
            />

            <main id="main-content" className="container min-h-screen py-6 md:py-10">
                {/* Breadcrumbs & Navigation Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400"
                    >
                        <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-cyan-300">
                            <Home size={14} aria-hidden="true" />
                            <span>Blog</span>
                        </Link>
                        <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
                        <span className="font-medium text-cyan-400">{categoryName}</span>
                        <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
                        <span className="line-clamp-1 max-w-xs sm:max-w-sm text-slate-200">{blog.title}</span>
                    </nav>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300 active:scale-95"
                    >
                        <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
                        <span>Về danh sách bài viết</span>
                    </button>
                </div>

                {/* Hero Editorial Header Section */}
                <header className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c101c]/85 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl">
                    {/* Atmospheric Glow */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[120px]" />
                    <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-96 rounded-full bg-purple-500/15 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 font-mono text-xs font-semibold text-cyan-300 shadow-inner">
                            <Sparkles size={12} className="text-cyan-400" />
                            <span>{categoryName}</span>
                            <span className="h-1 w-1 rounded-full bg-cyan-400" />
                            <span className="text-[11px] text-slate-400">ENGINEERING</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="mt-5 text-2xl font-black leading-snug tracking-tight text-white sm:text-4xl md:text-[2.6rem]">
                            {blog.title}
                        </h1>

                        {/* Metadata Telemetry Deck */}
                        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] rounded-2xl border border-white/10 bg-slate-950/60 p-2 sm:p-3 md:grid-cols-4 shadow-xl backdrop-blur-md">
                            {/* Author */}
                            <div className="flex items-center gap-3 p-2.5">
                                <div className="relative">
                                    <Image
                                        src={authorAvatar}
                                        alt={authorName}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full border border-cyan-400/40 object-cover shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Tác giả
                                    </p>
                                    <p className="text-xs font-bold text-white line-clamp-1">{authorName}</p>
                                </div>
                            </div>

                            {/* Publish Date */}
                            <div className="flex items-center gap-3 p-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-purple-400">
                                    <Calendar size={17} aria-hidden="true" />
                                </div>
                                <div className="text-left">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Ngày đăng
                                    </p>
                                    <p className="text-xs font-bold text-slate-200 line-clamp-1">{publishedDate}</p>
                                </div>
                            </div>

                            {/* Reading Time */}
                            <div className="flex items-center gap-3 p-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-400">
                                    <Clock size={17} aria-hidden="true" />
                                </div>
                                <div className="text-left">
                                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Thời lượng
                                    </p>
                                    <p className="text-xs font-bold text-slate-200">{readingTime}</p>
                                </div>
                            </div>

                            {/* Views & Likes */}
                            <div className="flex items-center justify-between gap-2 p-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-400">
                                        <Eye size={17} aria-hidden="true" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            Lượt xem
                                        </p>
                                        <p className="text-xs font-bold text-slate-200">{viewCount}</p>
                                    </div>
                                </div>

                                {/* Interactive Like Pill */}
                                <button
                                    type="button"
                                    onClick={handleToggleLike}
                                    className={`group/like flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                                        liked
                                            ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-rose-400/40 hover:text-rose-300'
                                    }`}
                                    aria-label="Thích bài viết"
                                >
                                    <Heart
                                        size={14}
                                        className={`transition-transform duration-300 group-hover/like:scale-125 ${
                                            liked ? 'fill-rose-400 text-rose-400' : ''
                                        }`}
                                    />
                                    <span>{likeCount}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured 16:9 Cover Image Showcase Banner */}
                {coverImage && (
                    <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-[#090d16] p-2 shadow-2xl">
                        {/* Volumetric Backlight Glow */}
                        <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 opacity-60 blur-2xl" />

                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950">
                            {/* Subtle 4 Corner Telemetry Marks */}
                            <span className="pointer-events-none absolute top-3 left-3 z-20 h-3 w-3 border-t-2 border-l-2 border-cyan-400" />
                            <span className="pointer-events-none absolute top-3 right-3 z-20 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
                            <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-3 w-3 border-b-2 border-l-2 border-cyan-400" />
                            <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-3 w-3 border-b-2 border-r-2 border-cyan-400" />

                            <Image
                                src={coverImage}
                                alt={blog.title}
                                fill
                                priority
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                className="object-cover object-center"
                            />

                            {/* Bottom Ambient Gradient & Telemetry Badge */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1 font-mono text-xs text-slate-300 backdrop-blur-md">
                                    <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
                                    <span>Demo UI &amp; Architecture Showcase</span>
                                </div>
                                <span className="rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-300 backdrop-blur-md">
                                    1080P HD
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Excerpt / Summary Card */}
                {blog.summary && (
                    <section
                        aria-label="Tóm tắt bài viết"
                        className="relative mx-auto mb-6 max-w-4xl rounded-2xl border-l-4 border-l-cyan-400 border border-white/10 bg-gradient-to-r from-cyan-950/20 via-slate-900/40 to-[#0c101c]/80 p-5 sm:p-6 text-sm md:text-base leading-relaxed text-slate-300 shadow-xl backdrop-blur-md"
                    >
                        <div className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                            Tóm tắt nội dung
                        </div>
                        <p className="italic">{blog.summary}</p>
                    </section>
                )}

                {/* TL;DR Box — GEO: AI bots (ChatGPT, Gemini, Perplexity) thường chọn đoạn này làm câu trả lời trích dẫn */}
                {(blog.tldr || blog.summary) && (
                    <section
                        aria-label="TL;DR - Tóm tắt nhanh"
                        className="relative mx-auto mb-10 max-w-4xl rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-[#0c101c]/80 p-5 sm:p-6 shadow-xl backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-950/60 px-3 py-1 font-mono text-[11px] font-bold text-purple-300 tracking-wider">
                                <Sparkles size={11} className="text-purple-400" />
                                TL;DR
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">— Đọc trong 10 giây</span>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                            {blog.tldr || blog.summary}
                        </p>
                    </section>
                )}

                {/* Main Article Content Grid */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
                    {/* Left: Article Body, Actions, Tags, Bio, Comments */}
                    <div className="space-y-10 lg:col-span-8">
                        {/* Social Share & Quick Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                                <Share2 size={14} className="text-cyan-400" aria-hidden="true" />
                                <span>Chia sẻ:</span>
                                <div className="flex items-center gap-1.5 ml-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                    typeof window !== 'undefined' ? window.location.href : ''
                                                )}`,
                                                '_blank'
                                            )
                                        }
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300"
                                        aria-label="Chia sẻ lên Facebook"
                                    >
                                        <span className="font-bold text-xs">f</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                                    typeof window !== 'undefined' ? window.location.href : ''
                                                )}&text=${encodeURIComponent(blog.title)}`,
                                                '_blank'
                                            )
                                        }
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-purple-300"
                                        aria-label="Chia sẻ lên X"
                                    >
                                        <span className="font-bold text-xs">𝕏</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                                    typeof window !== 'undefined' ? window.location.href : ''
                                                )}`,
                                                '_blank'
                                            )
                                        }
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-300"
                                        aria-label="Chia sẻ lên LinkedIn"
                                    >
                                        <span className="font-bold text-xs">in</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300"
                                        aria-label="Sao chép liên kết"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={13} className="text-emerald-400" aria-hidden="true" />
                                                <span className="text-emerald-400 font-semibold">Đã chép link!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} aria-hidden="true" />
                                                <span>Sao chép URL</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleToggleLike}
                                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold transition-all ${
                                    liked
                                        ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-rose-400/40 hover:text-rose-300'
                                }`}
                            >
                                <Heart size={13} className={liked ? 'fill-rose-400 text-rose-400' : ''} />
                                <span>Thích bài viết ({likeCount})</span>
                            </button>
                        </div>

                        {/* Markdown Body Section */}
                        <article className="rounded-3xl border border-white/[0.08] bg-[#0c101c]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                            <MarkdownRenderer content={articleContent} />
                        </article>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                <Tag size={15} className="text-slate-500 mr-1" aria-hidden="true" />
                                {blog.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-1 font-mono text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-200"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Hub & Spoke Author Box — chuyển đổi người đọc sang Portfolio */}
                        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0e1324]/90 via-[#0a0d18]/90 to-[#07090e]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                            {/* Header label */}
                            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.07]">
                                <UserCheck size={14} className="text-cyan-400" />
                                <span className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                                    Về tác giả
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-5">
                                <div className="relative shrink-0">
                                    <Image
                                        src={authorAvatar}
                                        alt={authorName}
                                        width={72}
                                        height={72}
                                        className="h-18 w-18 rounded-2xl border border-cyan-400/40 object-cover shadow-[0_0_16px_rgba(56,189,248,0.3)]"
                                    />
                                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                        <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-cyan-500" />
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold text-white">{authorName}</h3>
                                        <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-950/50 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                                            <UserCheck size={11} />
                                            <span>VERIFIED AUTHOR</span>
                                        </span>
                                    </div>
                                    <p className="mt-1 font-mono text-xs font-medium text-purple-400">
                                        {blog.author?.role || 'Fullstack Software Engineer'}
                                    </p>
                                    {/* Bio — contextual in-text CTA */}
                                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                                        {blog.author?.bio ||
                                            'Kỹ sư phần mềm Fullstack chuyên sâu về Next.js 16, React 19, TypeScript, Java Spring Boot và giải pháp cơ sở dữ liệu đám mây Cloud Firestore.'}{' '}
                                        Bạn có thể xem các dự án thực tế tại{' '}
                                        <a
                                            href={PORTFOLIO_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                                        >
                                            Portfolio cá nhân
                                        </a>
                                        .
                                    </p>

                                    {/* Tech Chips */}
                                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                                        {['Next.js 16', 'React 19', 'TypeScript', 'Java Spring', 'Cloud Firestore'].map(
                                            tech => (
                                                <span
                                                    key={tech}
                                                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400"
                                                >
                                                    {tech}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    {/* Hub & Spoke CTA row */}
                                    <div className="mt-5 flex flex-wrap items-center gap-3">
                                        <a
                                            href={PORTFOLIO_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 px-4 py-2 font-mono text-xs font-bold text-cyan-300 shadow-lg transition-all hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] active:scale-95"
                                        >
                                            <Globe size={13} />
                                            <span>Xem Portfolio ↗</span>
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/knguyen1411b"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-950/30 px-4 py-2 font-mono text-xs font-bold text-sky-300 transition-all hover:border-sky-400 hover:bg-sky-500/20 active:scale-95"
                                        >
                                            <span className="font-black text-[11px]">in</span>
                                            <span>Kết nối LinkedIn</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Comments Terminal */}
                        <section
                            aria-label="Bình luận bài viết"
                            className="rounded-3xl border border-white/[0.08] bg-[#0c101c]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-400">
                                        <MessageSquare size={16} aria-hidden="true" />
                                    </div>
                                    <h3 className="font-bold text-white text-base">Bình luận ({allComments.length})</h3>
                                </div>
                                <span className="font-mono text-[11px] text-slate-500">Live Feedback Terminal</span>
                            </div>

                            {/* Comment Input Form */}
                            <form onSubmit={handleAddComment} className="mt-6 space-y-3.5">
                                <input
                                    type="text"
                                    value={commentAuthor}
                                    onChange={e => setCommentAuthor(e.target.value)}
                                    placeholder="Tên của bạn..."
                                    maxLength={50}
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 shadow-inner transition-colors focus:border-cyan-400 focus:outline-none"
                                />
                                <div className="relative">
                                    <textarea
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        placeholder="Chia sẻ phản hồi hoặc câu hỏi của bạn..."
                                        maxLength={2000}
                                        rows={4}
                                        required
                                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 shadow-inner transition-colors focus:border-cyan-400 focus:outline-none"
                                    />
                                    <div className="mt-2.5 flex items-center justify-between">
                                        <span className="font-mono text-[11px] text-slate-500">
                                            {commentText.length}/2000 ký tự
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim()}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 px-5 py-2 font-mono text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Send size={13} aria-hidden="true" />
                                            <span>GỬI PHẢN HỒI</span>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Comments Stream */}
                            <div className="mt-8 border-t border-white/[0.08] pt-6">
                                {allComments.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                        <MessageSquare
                                            size={32}
                                            className="mx-auto text-slate-600"
                                            aria-hidden="true"
                                        />
                                        <p className="mt-3 font-mono text-xs text-slate-500">
                                            Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3.5">
                                        {allComments.map((comment, index) => (
                                            <div
                                                key={comment.id || index}
                                                className="rounded-2xl border border-white/[0.06] bg-slate-950/50 p-4 shadow-inner"
                                            >
                                                <div className="flex items-center justify-between font-mono text-xs">
                                                    <span className="font-bold text-cyan-300">
                                                        {comment.authorName}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        {comment.createdAt}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right: Sticky Table of Contents Sidebar */}
                    <div className="lg:sticky lg:top-20 lg:col-span-4 space-y-6">
                        <TableOfContents items={tocItems} />

                        {/* Direct CTA Box to Portfolio */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e1324] to-[#07090e] p-5 shadow-xl">
                            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300">
                                <Sparkles size={13} className="text-cyan-400" />
                                <span>KHÁM PHÁ THÊM</span>
                            </div>
                            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                Tìm hiểu thêm về các dự án công nghệ, kiến trúc mã nguồn mở và hồ sơ năng lực của tác
                                giả.
                            </p>
                            <a
                                href={PORTFOLIO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-semibold text-slate-200 transition-all hover:border-purple-400/60 hover:bg-purple-500/20 hover:text-white"
                            >
                                <span>Trang chủ Portfolio</span>
                                <ChevronRight size={14} className="text-purple-400" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

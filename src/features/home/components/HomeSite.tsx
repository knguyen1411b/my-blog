'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { ArrowRight, ArrowUpRight, BookOpen, Globe, RotateCcw, Search, Sparkles, X } from 'lucide-react'

import { Footer, Navbar } from '@/components/layout'
import { useBlogs } from '@/features/blog/hook/use-blog'
import type { IBlog } from '@/features/blog/types/blog'

import { BlogCard } from './BlogCard'

const PORTFOLIO_URL = 'https://knguyen1411b.vercel.app'

export const HomeSite = ({ initialBlogs = [] }: { initialBlogs?: IBlog[] } = {}) => {
    const { data: blogs = initialBlogs, error: blogsError } = useBlogs({ status: 'published' }, initialBlogs)

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Keyboard shortcut listener: Ctrl+K or / to focus search, Esc to clear
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
                (e.key === '/' &&
                    document.activeElement?.tagName !== 'INPUT' &&
                    document.activeElement?.tagName !== 'TEXTAREA')
            ) {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
            if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
                setSearchQuery('')
                searchInputRef.current?.blur()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Extract categories
    const categories = useMemo(() => {
        const set = new Set<string>()
        blogs.forEach(b => {
            if (b.category?.name) set.add(b.category.name)
        })
        return Array.from(set)
    }, [blogs])

    // Category counts mapping
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { ALL: blogs.length }
        blogs.forEach(b => {
            if (b.category?.name) {
                counts[b.category.name] = (counts[b.category.name] || 0) + 1
            }
        })
        return counts
    }, [blogs])

    const handleResetSearch = () => {
        setSearchQuery('')
        setSelectedCategory('ALL')
        searchInputRef.current?.focus()
    }

    // Filter blogs
    const filteredBlogs = useMemo(() => {
        return blogs.filter(post => {
            const query = searchQuery.trim().toLowerCase()
            const matchesSearch =
                !query ||
                post.title.toLowerCase().includes(query) ||
                post.summary.toLowerCase().includes(query) ||
                post.tags?.some(t => t.toLowerCase().includes(query))

            const matchesCategory = selectedCategory === 'ALL' || post.category?.name === selectedCategory

            return matchesSearch && matchesCategory
        })
    }, [blogs, searchQuery, selectedCategory])

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar isView={1} />
            <main id="main-content" className="container flex-1 pt-20 sm:pt-24 pb-12">
                {/* Hero Showcase Section */}
                <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c101c]/80 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl hero-grid">
                    {/* Ambient Radial Glow */}
                    <div
                        className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-sky-500/15 blur-[120px]"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-[120px]"
                        aria-hidden="true"
                    />

                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
                                <Sparkles size={14} aria-hidden="true" />
                                <span>Khanh Nguyen Blog · Engineering & Insights</span>
                            </div>

                            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.18] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                Kiến thức, Công cụ &{' '}
                                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                    Trải nghiệm Lập trình.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-300">
                                Không gian ghi chép các công cụ hữu ích, kiến trúc hệ thống phân tán, giải pháp tối ưu
                                hóa ứng dụng web và kinh nghiệm thực chiến từ Nguyễn Đình Khánh Nguyên.
                            </p>

                            {/* Action CTAs - Replicated Cyber-Titanium Buttons from Portfolio */}
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                {/* Primary CTA: Khám phá bài viết - Rotating Conic Border Beam & Shimmer Ray */}
                                <a
                                    href="#articles"
                                    className="group relative flex h-13 w-full cursor-pointer items-center justify-center overflow-visible rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] sm:w-[220px]"
                                >
                                    {/* Volumetric Neon Ambient Glow Behind */}
                                    <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-45 blur-xl transition-all duration-500 group-hover:opacity-90 group-hover:blur-2xl" />

                                    {/* Rotating Conic Border Beam */}
                                    <div className="btn-border-beam relative flex h-full w-full items-center justify-center rounded-2xl p-[1.5px] shadow-[0_0_24px_rgba(168,85,247,0.35)] transition-shadow duration-300 group-hover:shadow-[0_0_36px_rgba(168,85,247,0.6)]">
                                        {/* Inner Capsule Body */}
                                        <div className="relative flex h-full w-full items-center justify-between overflow-hidden rounded-[14.5px] bg-gradient-to-r from-[#090d16] via-[#10142b] to-[#120c24] px-5 py-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.6)]">
                                            {/* Continuous Sweeping Light Ray */}
                                            <div className="animate-shine-sweep pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                                            {/* Left: Pulsing Beacon + Label */}
                                            <div className="relative z-10 flex items-center gap-2.5">
                                                <span className="relative flex h-2 w-2 shrink-0">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80" />
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                                                </span>
                                                <span className="font-mono text-xs font-bold tracking-wide text-white sm:text-[13px]">
                                                    Bài viết
                                                </span>
                                            </div>

                                            {/* Right: Elevated Arrow Badge */}
                                            <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white shadow-inner backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-purple-400/80 group-hover:bg-purple-500/40 group-hover:shadow-[0_0_12px_#a855f7]">
                                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                {/* Secondary CTA: Trang chủ Portfolio - Cyber-Titanium Frosted Glass with Corner Telemetry */}
                                <a
                                    href={PORTFOLIO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex h-13 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75 px-5 font-mono text-xs font-semibold text-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-purple-500/50 hover:bg-slate-900/90 hover:text-white hover:shadow-[0_0_28px_rgba(168,85,247,0.25),inset_0_1px_0_rgba(255,255,255,0.18)] active:scale-[0.97] sm:w-[220px]"
                                >
                                    {/* Subtle Corner Telemetry Marks */}
                                    <span className="pointer-events-none absolute top-1.5 left-1.5 h-1.5 w-1.5 border-t border-l border-white/20 transition-colors group-hover:border-purple-400" />
                                    <span className="pointer-events-none absolute top-1.5 right-1.5 h-1.5 w-1.5 border-t border-r border-white/20 transition-colors group-hover:border-purple-400" />
                                    <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-1.5 w-1.5 border-b border-l border-white/20 transition-colors group-hover:border-purple-400" />
                                    <span className="pointer-events-none absolute right-1.5 bottom-1.5 h-1.5 w-1.5 border-r border-b border-white/20 transition-colors group-hover:border-purple-400" />

                                    {/* Ambient Radial Hover Bloom */}
                                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-sky-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Content Container */}
                                    <div className="relative z-10 flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:border-purple-400/50 group-hover:bg-purple-500/20 group-hover:text-purple-300 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                                                <Globe className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="tracking-wide text-slate-300 transition-colors group-hover:text-white sm:text-[13px]">
                                                Portfolio
                                            </span>
                                        </div>

                                        {/* Dynamic Action Arrow */}
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-purple-400/40 group-hover:bg-purple-500/15 group-hover:text-purple-300">
                                            <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Stat Counter Card */}
                        <div className="w-full max-w-xs rounded-2xl border border-white/[0.08] bg-black/40 p-6 text-center backdrop-blur-md">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                                <BookOpen size={26} aria-hidden="true" />
                            </div>
                            <p className="mt-4 text-3xl font-black text-white">{blogs.length}</p>
                            <p className="mt-1 font-mono text-xs uppercase tracking-wider font-semibold text-slate-400">
                                Bài viết đã xuất bản
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Cloud Firestore Live</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Articles Search & Filter Section */}
                <section id="articles" className="space-y-6">
                    {/* Header & Cyber Search Bar */}
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between border-b border-white/[0.06] pb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                                </span>
                                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                    Kho Lưu Trữ Bài Viết
                                </span>
                            </div>
                            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Bài Viết Mới Nhất
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm text-slate-400">
                                Khám phá các bài viết chia sẻ về công nghệ, lập trình và trải nghiệm thực tế.
                            </p>
                        </div>

                        {/* Advanced Cyber Search Bar */}
                        <div className="relative group w-full sm:w-80 md:w-96">
                            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-purple-500/20 opacity-0 blur transition-all duration-500 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:from-cyan-500/30 group-focus-within:to-purple-500/30" />
                            <div className="relative flex items-center rounded-2xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 focus-within:border-cyan-400/60 focus-within:bg-slate-900/90 focus-within:shadow-[0_0_24px_rgba(56,189,248,0.22)]">
                                <Search
                                    className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-cyan-400"
                                    aria-hidden="true"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Tìm bài viết, tag, từ khóa..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent px-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                                />

                                {/* Shortcut Hint or Clear Button */}
                                {searchQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('')
                                            searchInputRef.current?.focus()
                                        }}
                                        aria-label="Xóa từ khóa tìm kiếm"
                                        title="Xóa tìm kiếm (Esc)"
                                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                ) : (
                                    <div className="hidden sm:flex items-center gap-1 select-none pointer-events-none">
                                        <kbd className="w-13! inline-flex items-center rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-400 shadow-sm">
                                            Ctrl K
                                        </kbd>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter Console: Category Matrix & Telemetry */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Category Pills Filter */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory('ALL')}
                                    className={`group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                                        selectedCategory === 'ALL'
                                            ? 'border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 shadow-[0_0_16px_rgba(56,189,248,0.25)]'
                                            : 'border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                                    }`}
                                >
                                    <span>Tất cả</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                                            selectedCategory === 'ALL'
                                                ? 'bg-cyan-400/20 text-cyan-300'
                                                : 'bg-white/10 text-slate-400 group-hover:text-white'
                                        }`}
                                    >
                                        {categoryCounts.ALL || blogs.length}
                                    </span>
                                </button>

                                {categories.map(cat => {
                                    const isSelected = selectedCategory === cat
                                    const count = categoryCounts[cat] || 0
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                                                isSelected
                                                    ? 'border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 shadow-[0_0_16px_rgba(56,189,248,0.25)]'
                                                    : 'border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                                            }`}
                                        >
                                            <span>{cat}</span>
                                            <span
                                                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                                                    isSelected
                                                        ? 'bg-cyan-400/20 text-cyan-300'
                                                        : 'bg-white/10 text-slate-400 group-hover:text-white'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Reset Filter Button if active */}
                        {(searchQuery.trim() !== '' || selectedCategory !== 'ALL') && (
                            <button
                                type="button"
                                onClick={handleResetSearch}
                                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-mono text-rose-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-rose-200"
                            >
                                <RotateCcw className="h-3 w-3" />
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}
                    </div>

                    {/* Telemetry Counter Readout */}
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <p>
                            Hiển thị <span className="font-bold text-cyan-400">{filteredBlogs.length}</span> /{' '}
                            {blogs.length} bài viết
                            {searchQuery.trim() && (
                                <span className="ml-1 text-slate-500">
                                    (khớp từ khóa &quot;{searchQuery.trim()}&quot;)
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Articles Grid */}
                    {blogsError ? (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0c101c]/80 p-8 text-center text-slate-400">
                            Không thể kết nối đến Cloud Firestore. Vui lòng kiểm tra lại cấu hình Firebase.
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#0c101c]/60 p-12 text-center backdrop-blur-xl">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                                <Search className="h-6 w-6" />
                            </div>
                            <p className="mt-4 text-base font-semibold text-white">
                                Không tìm thấy bài viết nào phù hợp
                            </p>
                            <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-400">
                                {searchQuery.trim()
                                    ? `Không có kết quả nào cho "${searchQuery.trim()}". Hãy thử từ khóa khác hoặc xóa bộ lọc danh mục.`
                                    : 'Hiện chưa có bài viết nào trong danh mục đã chọn.'}
                            </p>
                            <button
                                type="button"
                                onClick={handleResetSearch}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:text-cyan-200"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Xóa bộ lọc & Hiển thị tất cả</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredBlogs.map(blog => (
                                <BlogCard key={blog.id || blog.slug || blog.number} blog={blog} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    )
}

'use client'

import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { type User, onAuthStateChanged, signOut } from 'firebase/auth'
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Edit3,
    ExternalLink,
    Eye,
    FileText,
    Loader2,
    LogOut,
    Plus,
    Search,
    Star,
    Trash2
} from 'lucide-react'

import { useBlogs, useDeleteBlog, useToggleFeaturedBlog } from '@/features/blog/hook/use-blog'
import type { IBlog } from '@/features/blog/types/blog'
import { auth } from '@/lib/firebase'

export default function AdminDashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    // Query all blogs (status: 'all' for admin dashboard, chỉ thực hiện khi đã xác thực Firebase Auth)
    const { data: blogs = [], isLoading: loadingBlogs } = useBlogs({ status: 'all' }, undefined, Boolean(user))
    const deleteMutation = useDeleteBlog()
    const toggleFeaturedMutation = useToggleFeaturedBlog()

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'published' | 'draft'>('ALL')
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

    // Modal state
    const [deleteTarget, setDeleteTarget] = useState<IBlog | null>(null)
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            if (!currentUser) {
                router.push('/admin/login')
            } else {
                setUser(currentUser)
                setLoadingAuth(false)
            }
        })
        return () => unsubscribe()
    }, [router])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(''), 4000)
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/admin/login')
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            await deleteMutation.mutateAsync(deleteTarget.id)
            showToast(`Đã xóa bài viết "${deleteTarget.title}"`)
            setDeleteTarget(null)
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Lỗi khi xóa bài viết'
            alert(`Lỗi: ${msg}`)
        }
    }

    const handleToggleFeatured = async (post: IBlog) => {
        try {
            const nextVal = await toggleFeaturedMutation.mutateAsync({
                id: post.id,
                featured: Boolean(post.featured)
            })
            showToast(nextVal ? `Đã thêm vào mục Nổi Bật: "${post.title}"` : `Đã gỡ khỏi mục Nổi Bật: "${post.title}"`)
        } catch (err) {
            console.error('Toggle featured error:', err)
        }
    }

    // Filter categories dynamically
    const categories = useMemo(() => {
        const set = new Set<string>()
        blogs.forEach(b => {
            if (b.category?.name) set.add(b.category.name)
        })
        return Array.from(set)
    }, [blogs])

    // Filtered blogs
    const filteredBlogs = useMemo(() => {
        return blogs.filter(post => {
            const matchesSearch =
                !searchQuery ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesStatus =
                statusFilter === 'ALL' || (statusFilter === 'draft' ? post.status === 'draft' : post.status !== 'draft')

            const matchesCategory = categoryFilter === 'ALL' || post.category?.name === categoryFilter

            return matchesSearch && matchesStatus && matchesCategory
        })
    }, [blogs, searchQuery, statusFilter, categoryFilter])

    // Stat metrics
    const stats = useMemo(() => {
        const total = blogs.length
        const published = blogs.filter(b => b.status !== 'draft').length
        const drafts = blogs.filter(b => b.status === 'draft').length
        const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)
        return { total, published, drafts, totalViews }
    }, [blogs])

    if (loadingAuth) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090e] text-white">
                <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                <p className="mt-4 text-xs font-mono text-slate-400">Đang kiểm tra quyền truy cập Admin...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#07090e] text-[#e2e8f0] pb-16">
            {/* Top Navigation Bar */}
            <div className="border-b border-white/[0.08] bg-[#090d16]/80 backdrop-blur-xl px-4 py-3.5 sm:px-8">
                <div className="container flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 font-bold font-mono">
                            KN
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm font-bold text-white">Bảng Quản Trị Blog</h1>
                                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
                                    Admin Console
                                </span>
                            </div>
                            <p className="font-mono text-xs text-slate-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <span>Xem trang Blog</span>
                            <ExternalLink size={13} className="opacity-60" />
                        </Link>

                        <Link
                            href="/admin/editor"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:opacity-95"
                        >
                            <Plus size={15} />
                            <span>Soạn bài mới</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
                            title="Đăng xuất"
                        >
                            <LogOut size={14} />
                            <span className="hidden sm:inline">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-sky-500/40 bg-slate-900/95 px-5 py-3 text-xs font-medium text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.3)] backdrop-blur-xl">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <main className="container pt-8 space-y-8">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Tổng Bài Viết</span>
                            <FileText size={18} className="text-sky-400" />
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Đã Xuất Bản</span>
                            <CheckCircle2 size={18} className="text-emerald-400" />
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-bold text-emerald-400">{stats.published}</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Bản Nháp</span>
                            <Clock size={18} className="text-amber-400" />
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-bold text-amber-400">{stats.drafts}</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-medium uppercase tracking-wider">Lượt Xem</span>
                            <Eye size={18} className="text-purple-400" />
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-bold text-purple-400">{stats.totalViews}</p>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-[#0d121f]/70 p-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm theo tiêu đề, tóm tắt hoặc thẻ tag..."
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Status */}
                        <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/60 p-1">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('ALL')}
                                className={`rounded-lg px-2.5 py-1 transition ${
                                    statusFilter === 'ALL'
                                        ? 'bg-sky-500/20 text-sky-400 font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('published')}
                                className={`rounded-lg px-2.5 py-1 transition ${
                                    statusFilter === 'published'
                                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Đã xuất bản
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('draft')}
                                className={`rounded-lg px-2.5 py-1 transition ${
                                    statusFilter === 'draft'
                                        ? 'bg-amber-500/20 text-amber-400 font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Bản nháp
                            </button>
                        </div>

                        {/* Category Dropdown if available */}
                        {categories.length > 0 && (
                            <select
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                                className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
                            >
                                <option value="ALL">Tất cả chuyên mục</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Posts Table / List */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c101c]/80 shadow-xl backdrop-blur-md">
                    {loadingBlogs ? (
                        <div className="flex flex-col items-center justify-center p-14 text-slate-400">
                            <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
                            <p className="mt-3 text-xs">Đang tải danh sách bài viết từ Firestore...</p>
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <FileText size={40} className="mx-auto mb-3 opacity-40 text-slate-500" />
                            <p className="text-sm font-medium text-slate-300">Không tìm thấy bài viết nào phù hợp.</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Hãy tạo bài viết mới hoặc điều chỉnh lại bộ lọc tìm kiếm.
                            </p>
                            <div className="mt-5">
                                <Link
                                    href="/admin/editor"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/20 border border-sky-500/30 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/30"
                                >
                                    <Plus size={14} />
                                    <span>Tạo bài viết đầu tiên</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.06]">
                            {filteredBlogs.map(post => (
                                <div
                                    key={post.id}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 transition hover:bg-white/[0.02]"
                                >
                                    {/* Left Info */}
                                    <div className="flex-1 space-y-1.5 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Status Badge */}
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                    post.status === 'draft'
                                                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                }`}
                                            >
                                                {post.status === 'draft' ? 'Bản nháp' : 'Đã xuất bản'}
                                            </span>

                                            {/* Category */}
                                            {post.category?.name && (
                                                <span className="text-[11px] font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                                                    {post.category.name}
                                                </span>
                                            )}

                                            {/* Featured Star */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleFeatured(post)}
                                                className={`p-1 rounded-md transition ${
                                                    post.featured
                                                        ? 'text-amber-400 hover:text-amber-300'
                                                        : 'text-slate-600 hover:text-slate-400'
                                                }`}
                                                title={
                                                    post.featured
                                                        ? 'Đang là bài nổi bật (Bấm để gỡ)'
                                                        : 'Đánh dấu bài nổi bật'
                                                }
                                            >
                                                <Star size={14} className={post.featured ? 'fill-amber-400' : ''} />
                                            </button>
                                        </div>

                                        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-sky-300 transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">{post.summary}</p>

                                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                                            <span>Slug: /{post.slug || post.id}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} /> {post.views || 0} lượt xem
                                            </span>
                                            <span>•</span>
                                            <span>{post.publishedAt || 'Chưa cập nhật'}</span>
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        <Link
                                            href={`/${post.slug || post.id}`}
                                            target="_blank"
                                            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                                            title="Xem bài viết trên web"
                                        >
                                            <ExternalLink size={13} />
                                            <span className="hidden md:inline">Xem</span>
                                        </Link>

                                        <Link
                                            href={`/admin/editor?id=${post.id}`}
                                            className="flex h-8 items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 text-xs font-medium text-sky-300 hover:bg-sky-500/20"
                                            title="Chỉnh sửa bài viết"
                                        >
                                            <Edit3 size={13} />
                                            <span>Sửa</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(post)}
                                            className="flex h-8 items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20"
                                            title="Xóa bài viết"
                                        >
                                            <Trash2 size={13} />
                                            <span>Xóa</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0d121f] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-400">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="text-base font-bold text-white">Xác nhận xóa bài viết</h3>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Bạn có chắc chắn muốn xóa vĩnh viễn bài viết{' '}
                            <strong className="text-white font-semibold">&ldquo;{deleteTarget.title}&rdquo;</strong>{' '}
                            không? Thao tác này sẽ xóa tài liệu khỏi Cloud Firestore và không thể khôi phục lại.
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-rose-500 disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Đang xóa...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={13} />
                                        <span>Xóa vĩnh viễn</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

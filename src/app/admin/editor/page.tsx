'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { type User, onAuthStateChanged } from 'firebase/auth'
import {
    ArrowLeft,
    Bold,
    CheckCircle2,
    Code,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Save,
    Table
} from 'lucide-react'

import { MarkdownRenderer } from '@/features/blog/components/MarkdownRenderer'
import { useCreateBlog, useUpdateBlog } from '@/features/blog/hook/use-blog'
import { generateSlug, getFirebaseBlogBySlug } from '@/features/blog/service/firebase-blog.service'
import { auth } from '@/lib/firebase'

function BlogEditorContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('id')

    const [, setUser] = useState<User | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)
    const [fetchingPost, setFetchingPost] = useState(Boolean(editId))

    // Blog form states
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [autoSlug, setAutoSlug] = useState(true)
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [categoryName, setCategoryName] = useState('Công Cụ Hữu Ích')
    const [tagsInput, setTagsInput] = useState('PDF, AI, Dịch thuật')
    const [coverImage, setCoverImage] = useState('')
    const [status, setStatus] = useState<'published' | 'draft'>('published')
    const [featured, setFeatured] = useState(false)
    const [authorName, setAuthorName] = useState('Nguyễn Đình Khánh Nguyên')

    // Preview mode
    const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split')
    const [toastMessage, setToastMessage] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const createMutation = useCreateBlog()
    const updateMutation = useUpdateBlog()

    // Auth check
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

    // Load existing post if editing
    useEffect(() => {
        if (!editId) return

        async function loadPost() {
            setFetchingPost(true)
            try {
                const post = await getFirebaseBlogBySlug(editId as string)
                if (post) {
                    setTitle(post.title || '')
                    setSlug(post.slug || '')
                    setAutoSlug(false)
                    setSummary(post.summary || '')
                    setContent(post.content || post.body || '')
                    setCategoryName(post.category?.name || 'Công Cụ Hữu Ích')
                    setTagsInput(post.tags?.join(', ') || '')
                    setCoverImage(post.coverImage || '')
                    setStatus(post.status || 'published')
                    setFeatured(Boolean(post.featured))
                    setAuthorName(post.author?.name || 'Khanh Nguyen')
                }
            } catch (err) {
                console.error('Error loading post:', err)
            } finally {
                setFetchingPost(false)
            }
        }

        loadPost()
    }, [editId])

    // Title change auto updates slug if autoSlug enabled
    const handleTitleChange = (val: string) => {
        setTitle(val)
        if (autoSlug) {
            setSlug(generateSlug(val))
        }
    }

    // Calculated metrics
    const wordCount = useMemo(() => {
        return content.trim() ? content.trim().split(/\s+/).length : 0
    }, [content])

    const readingTime = useMemo(() => {
        const minutes = Math.max(1, Math.ceil(wordCount / 200))
        return `${minutes} phút`
    }, [wordCount])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(''), 4000)
    }

    // Insert Markdown snippet into textarea
    const insertMarkdown = (before: string, after: string = '') => {
        const textarea = document.getElementById('markdown-editor-area') as HTMLTextAreaElement | null
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const selection = text.substring(start, end)
        const replacement = before + (selection || 'nội dung') + after

        setContent(text.substring(0, start) + replacement + text.substring(end))

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, start + before.length + (selection.length || 7))
        }, 10)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề bài viết.')
            return
        }

        setIsSaving(true)

        const tagsArray = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)

        const postData = {
            title: title.trim(),
            slug: slug.trim() || generateSlug(title),
            summary: summary.trim(),
            content: content.trim(),
            category: {
                id: generateSlug(categoryName),
                name: categoryName.trim(),
                slug: generateSlug(categoryName)
            },
            tags: tagsArray,
            author: {
                name: authorName.trim() || 'Nguyễn Đình Khánh Nguyên',
                role: 'Fullstack Software Engineer',
                avatar: 'https://github.com/knguyen1411b.png'
            },
            publishedAt: new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date()),
            readingTime,
            status,
            featured,
            coverImage: coverImage.trim(),
            views: 0
        }

        try {
            if (editId) {
                await updateMutation.mutateAsync({ id: editId, data: postData })
                showToast('Đã lưu các thay đổi bài viết thành công!')
            } else {
                const newId = await createMutation.mutateAsync(postData)
                showToast('Đã xuất bản bài viết mới thành công!')
                router.push(`/admin/editor?id=${newId}`)
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Không thể lưu bài viết'
            alert(`Lỗi: ${msg}`)
        } finally {
            setIsSaving(false)
        }
    }

    if (loadingAuth || fetchingPost) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090e] text-white">
                <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                <p className="mt-4 text-xs font-mono text-slate-400">
                    {fetchingPost ? 'Đang nạp dữ liệu bài viết...' : 'Đang kiểm tra quyền truy cập...'}
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#07090e] text-[#e2e8f0] pb-16">
            {/* Top Bar */}
            <div className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#090d16]/90 backdrop-blur-xl px-4 py-3 sm:px-8">
                <div className="container flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            title="Về danh sách bài viết"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-sm font-bold text-white">
                                {editId ? 'Chỉnh Sửa Bài Viết' : 'Soạn Thảo Bài Viết Mới'}
                            </h1>
                            <p className="font-mono text-xs text-slate-400">
                                {title ? title.slice(0, 40) + (title.length > 40 ? '...' : '') : 'Chưa có tiêu đề'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Tab mode switches on desktop */}
                        <div className="hidden lg:flex items-center rounded-xl border border-white/10 bg-slate-900/80 p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setActiveTab('edit')}
                                className={`rounded-lg px-3 py-1 transition ${
                                    activeTab === 'edit'
                                        ? 'bg-sky-500/20 text-sky-400 font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Soạn thảo
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('split')}
                                className={`rounded-lg px-3 py-1 transition ${
                                    activeTab === 'split'
                                        ? 'bg-sky-500/20 text-sky-400 font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Song song (Split)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('preview')}
                                className={`rounded-lg px-3 py-1 transition ${
                                    activeTab === 'preview'
                                        ? 'bg-sky-500/20 text-sky-400 font-semibold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Xem trước
                            </button>
                        </div>

                        {/* Save / Publish Button */}
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-[0_0_25px_rgba(56,189,248,0.35)] transition hover:opacity-95 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    <span>{status === 'published' ? 'Lưu & Xuất bản' : 'Lưu bản nháp'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-sky-500/40 bg-slate-900/95 px-5 py-3 text-xs font-medium text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.3)] backdrop-blur-xl">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <main className="container pt-6 space-y-6">
                {/* Meta Settings Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#0c101c]/80 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                            Tiêu Đề Bài Viết *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder="Ví dụ: Công Cụ Dịch PDF Giữ Nguyên Công Thức, Hình Ảnh Và Bố Cục – PDF Translate"
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-base font-bold text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Slug & Auto-slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-8">
                            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                Đường Dẫn Tĩnh (Slug URL)
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-500">/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={e => {
                                        setSlug(e.target.value)
                                        setAutoSlug(false)
                                    }}
                                    placeholder="cong-cu-dich-pdf-giu-nguyen-cong-thuc"
                                    className="flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-mono text-sky-400 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4 flex items-center gap-2 pt-4">
                            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={autoSlug}
                                    onChange={e => {
                                        setAutoSlug(e.target.checked)
                                        if (e.target.checked) setSlug(generateSlug(title))
                                    }}
                                    className="rounded border-white/10 bg-white/5 text-sky-500 accent-sky-500"
                                />
                                <span>Tự động sinh slug từ tiêu đề</span>
                            </label>
                        </div>
                    </div>

                    {/* Excerpt / Summary */}
                    <div>
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                            Tóm Tắt Ngắn (Summary / Excerpt Callout)
                        </label>
                        <textarea
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            rows={2}
                            placeholder="Cần dịch PDF nhưng không muốn mất công thức và bố cục? Khám phá PDF Translate – công cụ mã nguồn mở hỗ trợ dịch tài liệu và bảo toàn layout."
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                        />
                    </div>

                    {/* Category, Tags, Status, Featured */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        <div>
                            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                Chuyên Mục
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={e => setCategoryName(e.target.value)}
                                placeholder="Công Cụ Hữu Ích"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                Thẻ Tags (Phân cách bằng dấu phẩy)
                            </label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={e => setTagsInput(e.target.value)}
                                placeholder="PDF, AI, Dịch thuật"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                Trạng Thái Xuất Bản
                            </label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as 'published' | 'draft')}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                            >
                                <option value="published">Xuất bản (Public)</option>
                                <option value="draft">Bản nháp (Draft)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                Nổi Bật & Tác Giả
                            </label>
                            <div className="flex items-center gap-4 pt-1">
                                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={e => setFeatured(e.target.checked)}
                                        className="rounded border-white/10 bg-white/5 text-amber-500 accent-amber-500"
                                    />
                                    <span>Ghim nổi bật</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Markdown Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-[#0c101c]/80 p-2.5 backdrop-blur-md">
                    <button
                        type="button"
                        onClick={() => insertMarkdown('**', '**')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Đậm (**text**)"
                    >
                        <Bold size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('*', '*')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Nghiêng (*text*)"
                    >
                        <Italic size={15} />
                    </button>
                    <span className="h-4 w-px bg-white/10 mx-1" />
                    <button
                        type="button"
                        onClick={() => insertMarkdown('## ')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Tiêu đề 2 (## Title)"
                    >
                        <Heading2 size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('### ')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Tiêu đề 3 (### Title)"
                    >
                        <Heading3 size={15} />
                    </button>
                    <span className="h-4 w-px bg-white/10 mx-1" />
                    <button
                        type="button"
                        onClick={() => insertMarkdown('> ')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Khối trích dẫn (> quote)"
                    >
                        <Quote size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('```typescript\n', '\n```')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Khối mã (```code```)"
                    >
                        <Code size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('[', '](https://)')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Liên kết ([text](url))"
                    >
                        <LinkIcon size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('![Mô tả ảnh](', ')')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Hình ảnh (![alt](url))"
                    >
                        <ImageIcon size={15} />
                    </button>
                    <span className="h-4 w-px bg-white/10 mx-1" />
                    <button
                        type="button"
                        onClick={() => insertMarkdown('- ')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Danh sách (- item)"
                    >
                        <List size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('1. ')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Danh sách số (1. item)"
                    >
                        <ListOrdered size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('| Cột 1 | Cột 2 |\n|---|---|\n| Dữ liệu 1 | Dữ liệu 2 |\n')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Bảng (| Cột | Cột |)"
                    >
                        <Table size={15} />
                    </button>

                    {/* Stats */}
                    <div className="ml-auto flex items-center gap-3 font-mono text-xs text-slate-400">
                        <span>{wordCount} từ</span>
                        <span>•</span>
                        <span>Ước lượng: {readingTime} đọc</span>
                    </div>
                </div>

                {/* Editor & Preview Area */}
                <div
                    className={`grid gap-6 ${
                        activeTab === 'split'
                            ? 'grid-cols-1 lg:grid-cols-2'
                            : activeTab === 'edit'
                              ? 'grid-cols-1'
                              : 'hidden'
                    }`}
                >
                    {/* Markdown Input Area */}
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0c101c]/90 p-4 shadow-xl">
                        <textarea
                            id="markdown-editor-area"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={24}
                            placeholder="## Viết nội dung bài viết định dạng Markdown tại đây...&#10;&#10;Dịch một tài liệu PDF chuyên ngành chưa bao giờ đơn giản..."
                            className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:border-sky-500 focus:outline-none leading-relaxed"
                        />
                    </div>

                    {/* Live Preview Column in Split Mode */}
                    {activeTab === 'split' && (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0c101c]/90 p-6 shadow-xl overflow-y-auto max-h-[650px]">
                            <div className="border-b border-white/10 pb-3 mb-4">
                                <span className="text-xs font-mono font-semibold uppercase text-sky-400">
                                    Xem Trước Trực Tiếp (Live Preview)
                                </span>
                            </div>
                            <MarkdownRenderer
                                content={content || '*Nội dung xem trước sẽ hiển thị tại đây...*'}
                                className="markdown-body"
                            />
                        </div>
                    )}
                </div>

                {/* Single Preview Mode */}
                {activeTab === 'preview' && (
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0c101c]/90 p-8 shadow-xl">
                        <div className="border-b border-white/10 pb-3 mb-6 flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold uppercase text-sky-400">
                                Xem Trước Bài Viết Hoàn Chỉnh
                            </span>
                            <span className="text-xs font-mono text-slate-400">{readingTime}</span>
                        </div>
                        <MarkdownRenderer content={content || '*Chưa có nội dung.*'} className="markdown-body" />
                    </div>
                )}
            </main>
        </div>
    )
}

export default function BlogEditorPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#07090e] text-white">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                </div>
            }
        >
            <BlogEditorContent />
        </Suspense>
    )
}

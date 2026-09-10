'use client'

import { useEffect } from 'react'

import Link from 'next/link'

import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error('Next.js Segment Error:', error)
    }, [error])

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-rose-500/10 blur-[120px]" />

            <div className="relative z-10 max-w-md rounded-3xl border border-rose-500/20 bg-[#0c101c]/90 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                    <AlertTriangle size={32} />
                </div>

                <div className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-rose-400">
                    Sự Cố Hệ Thống · System Interrupt
                </div>

                <h2 className="mt-2 text-2xl font-black text-white">Đã Xảy Ra Lỗi Bất Thường</h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    Ứng dụng gặp lỗi tạm thời khi tải nội dung này. Bạn có thể nhấn nút thử lại để làm mới tiến trình.
                </p>

                {error.digest && (
                    <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-1.5 font-mono text-[11px] text-slate-500">
                        Error Digest: {error.digest}
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:brightness-110 active:scale-95"
                    >
                        <RefreshCw size={15} />
                        <span>Thử Lại Ngay</span>
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                        <Home size={15} />
                        <span>Trang Chủ Blog</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

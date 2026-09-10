import Link from 'next/link'

import { ExternalLink, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#07090e] p-4">
            {/* Ambient Backlight Glow */}
            <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-purple-600/20 blur-[120px]" />
            <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-sky-500/15 blur-[120px]" />

            <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">
                {/* 404 Badge */}
                <div className="mb-3 inline-block">
                    <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent drop-shadow-lg sm:text-8xl font-mono">
                        404
                    </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Không Tìm Thấy Trang</h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di dời sang địa chỉ mới.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-purple-400/40 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-6 font-medium text-white shadow-[0_0_24px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(147,51,234,0.5)] active:scale-[0.98] sm:w-auto"
                    >
                        <Home className="h-4 w-4" />
                        <span>Về Trang Chủ Blog</span>
                    </Link>

                    <Link
                        href="https://knguyen1411b.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.98] sm:w-auto"
                    >
                        <span>Trang Portfolio</span>
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('Next.js Global Root Error:', error)
    }, [error])

    return (
        <html lang="vi">
            <body className="flex min-h-screen items-center justify-center bg-[#07090e] p-4 text-white font-sans">
                <div className="max-w-md rounded-3xl border border-rose-500/20 bg-[#0c101c] p-8 text-center shadow-2xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono font-bold text-xl">
                        !
                    </div>

                    <h1 className="mt-4 text-2xl font-black text-white">Sự Cố Cấp Hệ Thống</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Đã xảy ra lỗi nghiêm trọng ở cấu trúc ứng dụng. Vui lòng thử tải lại trang.
                    </p>

                    <button
                        type="button"
                        onClick={() => reset()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
                    >
                        Khôi Phục Ứng Dụng
                    </button>
                </div>
            </body>
        </html>
    )
}

'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword
} from 'firebase/auth'
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Database,
    Eye,
    EyeOff,
    Fingerprint,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    Server,
    ShieldAlert,
    ShieldCheck,
    Sparkles
} from 'lucide-react'

import { auth } from '@/lib/firebase'

const PORTFOLIO_URL = 'https://ndknguyen.io.vn'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [isCapsLockOn, setIsCapsLockOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                router.push('/admin')
            } else {
                setCheckingAuth(false)
            }
        })
        return () => unsubscribe()
    }, [router])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.getModifierState) {
            setIsCapsLockOn(e.getModifierState('CapsLock'))
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !password) {
            setError('Vui lòng nhập đầy đủ email quản trị và mật khẩu.')
            return
        }

        setLoading(true)
        setError('')

        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
            await signInWithEmailAndPassword(auth, email.trim(), password)
            router.push('/admin')
        } catch (err: unknown) {
            const errObj = err as { code?: string; message?: string }
            if (
                errObj.code === 'auth/invalid-credential' ||
                errObj.code === 'auth/wrong-password' ||
                errObj.code === 'auth/user-not-found'
            ) {
                setError('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.')
            } else if (errObj.code === 'auth/too-many-requests') {
                setError('Tài khoản tạm thời bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau.')
            } else if (errObj.code === 'auth/operation-not-allowed') {
                setError('Phương thức Email/Password chưa được kích hoạt trong Firebase Authentication.')
            } else if (errObj.code === 'auth/network-request-failed') {
                setError('Lỗi kết nối mạng đến Firebase. Vui lòng kiểm tra lại đường truyền internet.')
            } else {
                setError(errObj.message || 'Xác thực không thành công. Vui lòng kiểm tra thông tin cấu hình.')
            }
        } finally {
            setLoading(false)
        }
    }

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#06080d] px-4">
                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                        <span className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 blur-sm" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-mono text-sm font-semibold text-slate-200">Khởi tạo Phiên Quản Trị</h3>
                        <p className="mt-1 text-xs text-slate-400">Đang kiểm tra trạng thái xác thực Firebase...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#06080d] text-white selection:bg-sky-500 selection:text-white lg:flex-row">
            {/* LEFT COLUMN: VISUAL & TELEMETRY */}
            <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-[#070a10] p-10 lg:flex lg:w-[50%] xl:w-[52%] xl:p-14 2xl:p-16">
                {/* Ambient Glows */}
                <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-sky-600/20 via-indigo-600/15 to-transparent blur-[140px]" />
                <div className="pointer-events-none absolute right-0 -bottom-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-purple-500/15 via-sky-900/15 to-transparent blur-[120px]" />

                {/* Dot matrix grid overlay */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)`,
                        backgroundSize: '28px 28px'
                    }}
                />

                {/* Top Bar on Left */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-500/25 to-purple-500/20 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                            <Fingerprint className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold tracking-tight text-white">Khanh Nguyen Blog</h1>
                            <p className="font-mono text-[11px] text-sky-400">Admin Cloud Console</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-xl transition-all hover:border-white/20 hover:bg-slate-800/80 hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            <span>Về Trang Blog</span>
                        </Link>
                    </div>
                </div>

                {/* Main Hero Info */}
                <div className="relative z-10 my-auto max-w-xl py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 font-mono text-xs text-sky-300 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                        <span>Hệ Thống Quản Lý Nội Dung Blog</span>
                    </div>

                    <h2 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-white xl:text-5xl">
                        Bảo Mật Cấp Doanh Nghiệp &{' '}
                        <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                            Quản Trị Xuất Bản.
                        </span>
                    </h2>

                    <p className="mt-5 text-sm leading-relaxed text-slate-300 xl:text-base">
                        Trung tâm điều khiển trực tiếp các bài viết, chuyên mục và tài nguyên hình ảnh trên Firebase
                        Cloud Firestore. Hỗ trợ soạn thảo Markdown trực quan với tốc độ cập nhật tức thì.
                    </p>

                    {/* Feature Cards */}
                    <div className="mt-8 space-y-3.5">
                        <div className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-md transition-all hover:border-white/15">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-white">Xác Thực Firebase Authentication</h4>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Mã hóa token JWT 256-bit an toàn, bảo vệ toàn diện các quyền thao tác bài viết.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-md transition-all hover:border-white/15">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
                                <Database className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-white">Lưu Trữ Đồng Bộ Cloud Firestore</h4>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Đồng bộ bài viết, nháp và lượt xem theo thời gian thực với TanStack Query.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-md transition-all hover:border-white/15">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400">
                                <Server className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-white">Trình Soạn Thảo Markdown Cao Cấp</h4>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    Tự động tạo slug URL chuẩn SEO, đếm số từ và tính thời gian đọc bài viết chính xác.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Diagnostics */}
                <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/5 bg-black/50 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="font-mono text-xs text-slate-300">Hạ Tầng: Firebase Production</span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs text-slate-400">
                        <Link href={PORTFOLIO_URL} target="_blank" className="hover:text-sky-400 transition-colors">
                            Portfolio: ndknguyen.io.vn ↗
                        </Link>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: AUTHENTICATION FORM */}
            <div className="relative flex flex-1 flex-col justify-between overflow-y-auto bg-[#05070c] p-6 sm:p-10 xl:p-14 2xl:p-16">
                {/* Dynamic Ambient Accent */}
                <div className="pointer-events-none absolute top-1/4 right-0 h-[450px] w-[450px] rounded-full bg-gradient-to-l from-sky-600/15 via-indigo-600/10 to-transparent blur-[120px]" />

                {/* Mobile Header */}
                <div className="mb-8 flex items-center justify-between lg:hidden">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-300 backdrop-blur-md"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Về Blog</span>
                    </Link>

                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3 py-1 font-mono text-[11px] text-emerald-300">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        <span>Auth Online</span>
                    </div>
                </div>

                {/* Desktop Top Right Status */}
                <div className="hidden items-center justify-end lg:flex">
                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-1.5 font-mono text-xs text-emerald-300 backdrop-blur-md">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        <span>Admin Gateway · Port 3000</span>
                    </div>
                </div>

                {/* Center Form */}
                <div className="relative z-10 mx-auto my-auto w-full max-w-md py-8 xl:max-w-lg">
                    <div>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/20 to-purple-500/15 text-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.25)]">
                                <KeyRound className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                Đăng Nhập Quản Trị
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                                Xác thực bằng tài khoản quản trị để truy cập bảng điều khiển soạn thảo và quản lý bài
                                viết blog.
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.15)] sm:text-sm">
                                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                                <div className="flex-1 leading-relaxed">
                                    <strong className="font-semibold text-white">Lỗi xác thực: </strong>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="mb-2 block font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                                    Email Quản Trị
                                </label>
                                <div className="group relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-sky-400" />
                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3.5 pr-4 pl-11 text-sm text-white placeholder-slate-500 transition-all focus:border-sky-500 focus:bg-slate-900/90 focus:shadow-[0_0_25px_rgba(56,189,248,0.25)] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                                        Mật Khẩu
                                    </label>
                                    {isCapsLockOn && (
                                        <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-amber-400">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            Đang bật Caps Lock
                                        </span>
                                    )}
                                </div>
                                <div className="group relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-sky-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3.5 pr-12 pl-11 text-sm text-white placeholder-slate-500 transition-all focus:border-sky-500 focus:bg-slate-900/90 focus:shadow-[0_0_25px_rgba(56,189,248,0.25)] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors hover:text-slate-200"
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-300 select-none sm:text-sm">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-600 accent-sky-500 transition-all"
                                    />
                                    <span>Ghi nhớ phiên đăng nhập trên thiết bị này</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-sky-400/40 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                                            <span>Đang xác thực tài khoản...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Vào Bảng Điều Khiển Quản Trị</span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-8 rounded-2xl border border-white/5 bg-slate-900/30 p-4 text-center">
                            <p className="text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                                🔒 Khu vực quản trị bảo mật. Mọi hoạt động xác thực và sửa đổi nội dung đều được kiểm
                                soát qua Firebase Security Rules.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer on Right */}
                <div className="relative z-10 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-6 font-mono text-xs text-slate-500 sm:flex-row">
                    <span>Khanh Nguyen Admin Console</span>
                    <span>Firebase Protected</span>
                </div>
            </div>
        </div>
    )
}

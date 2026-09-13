'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ArrowUp, ChevronRight, Clock, Cpu, ExternalLink, Layers, MapPin, Shield, Sparkles } from 'lucide-react'

import useLenis from '@/hooks/useLenis'

const PORTFOLIO_URL = 'https://ndknguyen.io.vn'

export function Footer() {
    const pathname = usePathname()
    const currentYear = new Date().getFullYear()
    const [vietnamTime, setVietnamTime] = useState<string>('')
    const { scrollTo } = useLenis()

    useEffect(() => {
        const updateClock = () => {
            try {
                const now = new Date()
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
                setVietnamTime(formatter.format(now))
            } catch {
                setVietnamTime('14:00:00')
            }
        }

        updateClock()
        const timer = setInterval(updateClock, 1000)
        return () => clearInterval(timer)
    }, [])

    if (pathname?.startsWith('/admin')) return null

    const handleScrollToTop = () => {
        scrollTo(0, { duration: 1.2 })
    }

    return (
        <footer className="relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#06080e] via-[#05060b] to-[#020306] pt-16 pb-12 text-white">
            {/* Top Animated Laser Horizon Line */}
            <div className="absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyan-400/60 via-purple-500/60 to-transparent" />

            {/* Atmospheric Ambient Glows */}
            <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="relative z-10 container">
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 gap-10 border-b border-white/[0.06] pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* Column 1: Identity & Engineering Manifesto (5 Cols) */}
                    <div className="space-y-4 lg:col-span-5">
                        <div className="flex items-center gap-3">
                            {/* Glowing KN Monogram Emblem */}
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 font-mono text-sm font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                                KN
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                                </span>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-extrabold tracking-tight text-white">
                                        Nguyen Dinh Khanh Nguyen
                                    </span>
                                </div>
                                <div className="font-mono text-xs font-medium text-purple-300">
                                    Nguyễn Đình Khánh Nguyên · Fullstack Software Engineer
                                </div>
                            </div>
                        </div>

                        <p className="max-w-md text-xs leading-relaxed text-slate-400">
                            Không gian chia sẻ kiến thức chuyên sâu về công nghệ web, giải pháp tối ưu hóa phần mềm, các
                            công cụ hữu ích và kinh nghiệm lập trình thực chiến.
                        </p>

                        {/* Live Operational Status Capsule */}
                        <div className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 font-mono text-[11px] text-emerald-300 shadow-inner">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                            </span>
                            <span>All Systems Operational · Cloud Firestore Connected</span>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links (2 Cols) */}
                    <div className="space-y-3 lg:col-span-2">
                        <div className="font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                            Navigation
                        </div>
                        <ul className="space-y-2 text-xs">
                            {[
                                { name: 'Trang Chủ Blog', href: '/', external: false },
                                { name: 'Portfolio Chính', href: PORTFOLIO_URL, external: true },
                                { name: 'Dự Án Đã Làm', href: `${PORTFOLIO_URL}/#projects`, external: true },
                                { name: 'Về Tôi & Kỹ Năng', href: `${PORTFOLIO_URL}/#about`, external: true },
                                { name: 'Liên Hệ Hợp Tác', href: `${PORTFOLIO_URL}/#contact`, external: true }
                            ].map((nav, i) => (
                                <li key={i}>
                                    <Link
                                        href={nav.href}
                                        target={nav.external ? '_blank' : undefined}
                                        rel={nav.external ? 'noopener noreferrer' : undefined}
                                        className="group flex items-center gap-1.5 text-slate-400 transition-colors duration-200 hover:text-cyan-300"
                                    >
                                        <ChevronRight className="h-3 w-3 text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-400" />
                                        <span>{nav.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Ecosystem & Channels (2 Cols) */}
                    <div className="space-y-3 lg:col-span-2">
                        <div className="font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                            Ecosystem
                        </div>
                        <ul className="space-y-2 text-xs">
                            {[
                                { name: 'GitHub Profile', href: 'https://github.com/knguyen1411b' },
                                { name: 'Portfolio Vercel', href: PORTFOLIO_URL },
                                { name: 'YouTube Channel', href: 'https://www.youtube.com/@knguyen1411b' },
                                { name: 'Facebook Community', href: 'https://www.facebook.com/knguyen1411b' }
                            ].map((channel, i) => (
                                <li key={i}>
                                    <a
                                        href={channel.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between text-slate-400 transition-colors duration-200 hover:text-purple-300"
                                    >
                                        <span>{channel.name}</span>
                                        <ExternalLink className="h-2.5 w-2.5 text-slate-600 opacity-0 transition-all duration-200 group-hover:text-purple-400 group-hover:opacity-100" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Architecture & Security (3 Cols) */}
                    <div className="space-y-3 lg:col-span-3">
                        <div className="font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                            Architecture &amp; Specs
                        </div>

                        <div className="space-y-2 rounded-xl border border-white/[0.08] bg-slate-950/60 p-3 font-mono text-[11px] text-slate-400 shadow-inner">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <Cpu className="h-3 w-3 text-cyan-400" />
                                    <span>Next.js 16 Turbopack</span>
                                </span>
                                <span className="text-[10px] text-emerald-400">EDGE</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <Layers className="h-3 w-3 text-purple-400" />
                                    <span>React 19 &amp; TypeScript</span>
                                </span>
                                <span className="text-[10px] text-slate-500">STRICT</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <Sparkles className="h-3 w-3 text-amber-400" />
                                    <span>Lenis Smooth Physics</span>
                                </span>
                                <span className="text-[10px] text-sky-400">60FPS</span>
                            </div>
                        </div>

                        {/* Admin Console Entry */}
                        <Link
                            href="/admin"
                            className="group flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:border-purple-400/40 hover:bg-purple-950/30 hover:text-white"
                        >
                            <span className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5 text-purple-400 transition-transform duration-200 group-hover:scale-110" />
                                <span className="font-mono text-[11px]">Admin Terminal</span>
                            </span>
                            <span className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-purple-300 uppercase">
                                SECURE
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Telemetry Bar */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
                    {/* Location & Live Clock */}
                    <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] sm:justify-start">
                        <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Hue, Vietnam</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-cyan-300">
                            <Clock className="h-3 w-3" />
                            <span>{vietnamTime || '14:00:00'} ICT (UTC+7)</span>
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="text-center font-mono text-[11px] text-slate-400">
                        &copy; {currentYear} <strong className="text-white">Nguyễn Đình Khánh Nguyên</strong>. All
                        rights reserved.
                    </div>

                    {/* Return to Top Trigger */}
                    <button
                        type="button"
                        onClick={handleScrollToTop}
                        className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-200 active:scale-95"
                        aria-label="Return to top"
                    >
                        <span>Return to Orbit</span>
                        <ArrowUp className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-cyan-400" />
                    </button>
                </div>
            </div>
        </footer>
    )
}

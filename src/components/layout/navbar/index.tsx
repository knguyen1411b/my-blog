'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, X } from 'lucide-react'

import GithubButton from '@/components/ui/github-btn'

import Menu from './menu'
import MmenuResponsive from './menu-rp'

export function Navbar({ isView = 1 }: { isView?: number }) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    // Hide public navbar on all admin routes (/admin, /admin/login, /admin/editor, etc.)
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <>
            <header
                className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#07090e]/80 px-4 py-3 backdrop-blur-xl transition-all duration-300 sm:px-8 sm:py-3.5"
                data-aos="fade-down"
                data-aos-duration="500"
            >
                <Link href="/" className="group flex cursor-pointer items-center gap-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 font-mono text-sm font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.15)] transition-all group-hover:border-purple-400/50 group-hover:shadow-[0_0_18px_rgba(168,85,247,0.3)]">
                        KN
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight text-slate-100 transition-colors group-hover:text-purple-300">
                            Khanh Nguyen
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">Fullstack Engineer</span>
                    </div>
                </Link>

                <div className="hidden lg:block">
                    <Menu isView={isView} />
                </div>

                <div className="flex items-center gap-3">
                    <GithubButton />
                    <button
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle mobile menu"
                        aria-expanded={open}
                    >
                        {open ? <X size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {open && <MmenuResponsive isView={isView} closeMenu={() => setOpen(false)} />}
            </AnimatePresence>
        </>
    )
}

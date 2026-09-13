'use client'

import { usePathname, useRouter } from 'next/navigation'

import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Briefcase } from 'lucide-react'

import useLenis from '@/hooks/useLenis'

const PORTFOLIO_URL = 'https://ndknguyen.io.vn'

const navItems = [
    { id: 'blog', viewId: 1, label: 'Blog', icon: BookOpen },
    { id: 'portfolio', viewId: 2, label: 'Portfolio', icon: Briefcase, external: true }
]

export default function Menu({ isView = 1 }: { isView?: number }) {
    const { scrollTo } = useLenis()
    const router = useRouter()
    const pathname = usePathname()

    const handleNavClick = (id: string, external?: boolean) => {
        if (id === 'blog') {
            if (pathname !== '/') {
                router.push('/')
                return
            }
            scrollTo(0)
            return
        }

        if (external || id === 'portfolio') {
            window.open(PORTFOLIO_URL, '_blank')
        }
    }

    return (
        <nav className="relative flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-slate-950/65 p-[7px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            {navItems.map(item => {
                const Icon = item.icon
                const isActive = isView === item.viewId

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id, item.external)}
                        className={`relative flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-[15px] font-medium transition-colors duration-200 ${
                            isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="navbar-active-pill"
                                className="absolute inset-0 rounded-full border border-purple-400/35 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-sky-500/20 shadow-[0_0_16px_rgba(168,85,247,0.25)]"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                        )}
                        <Icon className="relative z-10 h-[18px] w-[18px]" />
                        <span className="relative z-10">{item.label}</span>
                        {item.external && <ArrowUpRight className="relative z-10 h-3.5 w-3.5 opacity-60" />}
                    </button>
                )
            })}
        </nav>
    )
}

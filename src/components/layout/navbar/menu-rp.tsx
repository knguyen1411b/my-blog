'use client'

import { useEffect } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Briefcase } from 'lucide-react'

import useLenis from '@/hooks/useLenis'

interface MmenuResponsiveProps {
    closeMenu: () => void
    isView?: number
}

const PORTFOLIO_URL = 'https://knguyen1411b.vercel.app'

export default function MmenuResponsive({ closeMenu, isView = 1 }: MmenuResponsiveProps) {
    const { scrollTo } = useLenis()
    const router = useRouter()
    const pathname = usePathname()

    const navItems = [
        { id: 'blog', viewId: 1, label: 'Blog', icon: BookOpen },
        { id: 'portfolio', viewId: 2, label: 'Portfolio', icon: Briefcase, external: true }
    ]

    const handleNavClick = (id: string, external?: boolean) => {
        closeMenu()
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

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [])

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-down Menu Drawer */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed top-0 right-0 left-0 z-40 w-full border-b border-white/10 bg-[#07090e]/95 pt-[68px] pb-6 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
                <div className="flex flex-col px-6">
                    <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
                        <span className="font-mono text-xs font-medium tracking-wider text-slate-400 uppercase">
                            Điều Hướng
                        </span>
                        <span className="font-mono text-[11px] text-purple-400">Mục {isView}/2</span>
                    </div>

                    <ul className="flex flex-col space-y-2">
                        {navItems.map(item => {
                            const Icon = item.icon
                            const isActive = isView === item.viewId

                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleNavClick(item.id, item.external)}
                                        className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-4 text-base font-medium transition-all active:scale-[0.98] ${
                                            isActive
                                                ? 'border border-purple-400/30 bg-purple-500/15 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                                                : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                className={`h-5 w-5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`}
                                            />
                                            <span>{item.label}</span>
                                            {item.external && <ArrowUpRight className="h-4 w-4 opacity-60" />}
                                        </div>
                                        {isActive && (
                                            <span className="flex h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                        )}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </motion.div>
        </>
    )
}

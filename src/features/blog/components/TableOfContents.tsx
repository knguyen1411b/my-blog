'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronDown } from 'lucide-react'

import type { TocItem } from '@/lib/toc'

interface TableOfContentsProps {
    items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeId, setActiveId] = useState<string>(() => items[0]?.id ?? '')
    const activeItemRef = useRef<HTMLAnchorElement | null>(null)
    const isClickingRef = useRef(false)

    useEffect(() => {
        if (items.length === 0) return

        const getHeadingElements = () => {
            return items
                .map(item => ({
                    id: item.id,
                    el: document.getElementById(item.id)
                }))
                .filter((item): item is { id: string; el: HTMLElement } => item.el !== null)
        }

        const handleScroll = () => {
            // Avoid jitter during programmatic click scroll
            if (isClickingRef.current) return

            const headingElements = getHeadingElements()
            if (headingElements.length === 0) return

            // 1. If at or near top of the page, highlight first heading
            if (window.scrollY < 120) {
                setActiveId(items[0].id)
                return
            }

            // 2. If at bottom of page, highlight last heading
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60
            if (isBottom) {
                setActiveId(items[items.length - 1].id)
                return
            }

            // 3. Focal offset: 150px from top of viewport
            const focalOffset = 150
            let currentActive = headingElements[0].id

            for (let i = 0; i < headingElements.length; i++) {
                const rect = headingElements[i].el.getBoundingClientRect()
                if (rect.top <= focalOffset) {
                    currentActive = headingElements[i].id
                } else {
                    break
                }
            }

            setActiveId(currentActive)
        }

        let ticking = false
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })

        // Check on mount and delayed intervals to account for dynamic image layout
        handleScroll()
        const t1 = setTimeout(handleScroll, 100)
        const t2 = setTimeout(handleScroll, 400)
        const t3 = setTimeout(handleScroll, 1000)

        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [items])

    // Auto scroll inside TOC container when activeId changes
    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            })
        }
    }, [activeId])

    const handleItemClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        setActiveId(id)
        isClickingRef.current = true

        const el = document.getElementById(id)
        if (el) {
            const targetY = el.getBoundingClientRect().top + window.scrollY - 85
            window.scrollTo({
                top: Math.max(0, targetY),
                behavior: 'smooth'
            })
            window.history.pushState(null, '', `#${id}`)
        }

        setTimeout(() => {
            isClickingRef.current = false
        }, 800)
    }

    if (items.length === 0) return null

    return (
        <aside className="rounded-3xl border border-white/[0.08] bg-[#0c101c]/85 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                    <span className="h-3.5 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" aria-hidden="true" />
                    <h3 className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
                        MỤC LỤC BÀI VIẾT
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:text-white lg:hidden"
                    aria-label={isOpen ? 'Thu gọn mục lục' : 'Mở rộng mục lục'}
                >
                    <ChevronDown
                        size={15}
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            <div className={`mt-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>
                <nav aria-label="Mục lục bài viết">
                    <ul className="max-h-[calc(100vh-16rem)] space-y-1 overflow-y-auto pr-1 text-xs sm:text-sm">
                        {items.map(item => {
                            const isActive = item.id === activeId
                            return (
                                <li key={item.id} className={item.level > 2 ? 'pl-3.5' : ''}>
                                    <a
                                        ref={isActive ? activeItemRef : null}
                                        href={`#${item.id}`}
                                        onClick={e => handleItemClick(e, item.id)}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`group relative flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all ${
                                            isActive
                                                ? 'border-l-2 border-cyan-400 bg-cyan-500/15 font-semibold text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                                                isActive
                                                    ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8] scale-125'
                                                    : 'bg-slate-600 group-hover:bg-slate-400'
                                            }`}
                                        />
                                        <span className="line-clamp-2 leading-snug">{item.text}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    )
}

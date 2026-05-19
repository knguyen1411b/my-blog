'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button, Card } from '@heroui/react'
import { ChevronDown } from 'lucide-react'

import type { TocItem } from '@/lib/toc'

interface TableOfContentsProps {
    items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeId, setActiveId] = useState<string>(() =>
        typeof window !== 'undefined' ? window.location.hash.replace('#', '') : (items[0]?.id ?? '')
    )
    const ids = useMemo(() => items.map(item => item.id), [items])
    const currentActiveId = ids.includes(activeId) ? activeId : (items[0]?.id ?? '')

    useEffect(() => {
        if (ids.length === 0) return

        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

                if (visible[0]?.target.id) {
                    setActiveId(visible[0].target.id)
                }
            },
            { rootMargin: '-20% 0px -65% 0px', threshold: [0, 1] }
        )

        ids.forEach(id => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [ids])

    useEffect(() => {
        const onHashChange = () => setActiveId(window.location.hash.replace('#', ''))
        window.addEventListener('hashchange', onHashChange)
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [])

    if (items.length === 0) return null

    return (
        <Card className="glass-panel rounded-[var(--radius-xl)]">
            <Card.Header className="pb-2">
                <div className="flex w-full items-center justify-between gap-3">
                    <p className="eyebrow">Noi Dung Chinh</p>
                    <Button
                        variant="ghost"
                        isIconOnly
                        className="rounded-full md:hidden"
                        aria-label={isOpen ? 'Collapse table of contents' : 'Expand table of contents'}
                        onPress={() => setIsOpen(value => !value)}
                    >
                        <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </Button>
                </div>
            </Card.Header>
            <Card.Content className={`pt-0 ${isOpen ? 'block' : 'hidden'} md:block`}>
                <nav aria-label="Table of contents">
                    <ul className="space-y-1">
                        {items.map(item => {
                            const isActive = item.id === currentActiveId
                            return (
                                <li key={item.id} className={item.level > 1 ? 'pl-3' : ''}>
                                    <a
                                        href={`#${item.id}`}
                                        onClick={() => setActiveId(item.id)}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`block rounded-xl px-3 py-2 text-sm transition ${
                                            isActive
                                                ? 'bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] text-[var(--text)]'
                                                : 'text-[var(--text-muted)] hover:bg-[color-mix(in_oklab,var(--accent)_11%,transparent)] hover:text-[var(--text)]'
                                        }`}
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </Card.Content>
        </Card>
    )
}

'use client'

import type Lenis from 'lenis'
import { useLenis as useReactLenis } from 'lenis/react'

export default function useLenis() {
    const lenis = useReactLenis()

    const scrollTo = (id: string | number, options?: Parameters<Lenis['scrollTo']>[1]) => {
        if (lenis) {
            if (typeof id === 'number') {
                lenis.scrollTo(id, options)
            } else {
                const target = id.startsWith('#') ? id : `#${id}`
                lenis.scrollTo(target, options)
            }
        } else if (typeof window !== 'undefined') {
            if (typeof id === 'number') {
                window.scrollTo({ top: id, behavior: 'smooth' })
            } else {
                const target = id.startsWith('#') ? id : `#${id}`
                const el = document.querySelector(target)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                }
            }
        }
    }

    return { lenis, scrollTo }
}

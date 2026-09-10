'use client'

import { useCallback, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { Welcome } from '@/components/welcome'
import type { IBlog } from '@/features/blog/types/blog'
import { dismissWelcome, shouldShowWelcome } from '@/lib/welcome-state'

import { HomeSite } from './HomeSite'

export function HomeContainer({ initialBlogs }: { initialBlogs?: IBlog[] } = {}) {
    const [welcome, setWelcome] = useState(() => {
        if (typeof window !== 'undefined') {
            const hasHash = Boolean(window.location.hash)
            if (hasHash) {
                dismissWelcome()
                return false
            }
        }
        return shouldShowWelcome()
    })

    const handleDismiss = useCallback(() => {
        dismissWelcome()
        setWelcome(false)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {welcome ? (
                <Welcome key="welcome-screen" onDismiss={handleDismiss} />
            ) : (
                <motion.div
                    key="main-home-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                    <HomeSite initialBlogs={initialBlogs} />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

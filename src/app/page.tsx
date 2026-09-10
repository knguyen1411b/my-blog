'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'

import { Welcome } from '@/components/welcome'
import { HomeSite } from '@/features/home'
import { dismissWelcome, shouldShowWelcome } from '@/lib/welcome-state'

function HomeContent() {
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

    useEffect(() => {
        if (welcome) {
            const timer = setTimeout(() => {
                handleDismiss()
            }, 4500)

            return () => {
                clearTimeout(timer)
                dismissWelcome()
            }
        }
    }, [welcome, handleDismiss])

    return welcome ? <Welcome onDismiss={handleDismiss} /> : <HomeSite />
}

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#07090e]" />}>
            <HomeContent />
        </Suspense>
    )
}

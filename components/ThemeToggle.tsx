'use client'

import { Button } from '@heroui/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'

    return (
        <Button
            isIconOnly
            variant="secondary"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onPress={() => setTheme(isDark ? 'light' : 'dark')}
            className="glass-panel fixed right-4 top-4 z-50 rounded-full border border-[var(--border)] text-[var(--text)]"
        >
            {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        </Button>
    )
}

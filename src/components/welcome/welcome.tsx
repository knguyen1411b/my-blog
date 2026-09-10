'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Code2, Github, Globe, User } from 'lucide-react'

interface WelcomeProps {
    onDismiss?: () => void
}

export function Welcome({ onDismiss }: WelcomeProps = {}) {
    const LINK = 'knguyen1411b.vercel.app'
    const [isExiting, setIsExiting] = useState(false)
    const dismissedRef = useRef(false)

    useEffect(() => {
        if (!isExiting) {
            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => {
                document.body.style.overflow = originalOverflow
            }
        }
    }, [isExiting])

    const handleTriggerDismiss = useCallback(() => {
        if (dismissedRef.current) return
        dismissedRef.current = true
        document.body.style.overflow = ''
        setIsExiting(true)
        setTimeout(() => {
            onDismiss?.()
        }, 450)
    }, [onDismiss])

    // Keyboard shortcut listener (Space, Enter, Escape to instantly bypass)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
                e.preventDefault()
                handleTriggerDismiss()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleTriggerDismiss])

    // Auto transition after ~3.6s
    useEffect(() => {
        const timer = setTimeout(() => {
            handleTriggerDismiss()
        }, 3600)

        return () => clearTimeout(timer)
    }, [handleTriggerDismiss])

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onClick={handleTriggerDismiss}
                    className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center overflow-hidden bg-[#06080d] text-slate-200 select-none"
                    role="region"
                    aria-label="Welcome screen"
                >
                    {/* Ambient Lighting & Mesh Grids */}
                    <div className="pointer-events-none absolute inset-0">
                        {/* Subtle Grid */}
                        <div
                            className="absolute inset-0 opacity-[0.035]"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                                backgroundSize: '48px 48px'
                            }}
                        />

                        {/* Glowing Ambient Orbs */}
                        <div className="absolute top-1/3 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
                        <div className="absolute bottom-1/3 left-1/2 h-[350px] w-[350px] -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-500/10 blur-[100px]" />
                    </div>

                    {/* Skip Button (Top-Right) */}
                    {onDismiss && (
                        <button
                            type="button"
                            onClick={e => {
                                e.stopPropagation()
                                handleTriggerDismiss()
                            }}
                            className="absolute top-6 right-6 z-50 flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 font-mono text-xs text-slate-300 shadow-xl backdrop-blur-xl transition-all hover:border-purple-400/40 hover:bg-slate-800 hover:text-white active:scale-95"
                            aria-label="Skip welcome screen"
                        >
                            <span>Enter</span>
                            <span className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-purple-300 sm:inline">
                                Space
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-purple-400" />
                        </button>
                    )}

                    {/* Central Content Deck */}
                    <div
                        onClick={e => e.stopPropagation()}
                        className="relative z-10 flex flex-col items-center px-4 text-center"
                    >
                        {/* 3 Floating Glassmorphism Badges (Code, User, GitHub) */}
                        <div className="mb-8 flex items-center justify-center gap-4 sm:gap-6">
                            {/* Badge 1: Code */}
                            <motion.div
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: [0, -6, 0], opacity: 1 }}
                                transition={{
                                    y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
                                    opacity: { duration: 0.6, delay: 0.1 }
                                }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500/30 to-indigo-500/30 opacity-40 blur-md transition-opacity group-hover:opacity-80" />
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/70 p-3 shadow-2xl backdrop-blur-xl transition-transform duration-300 group-hover:scale-105 group-hover:border-sky-400/50 sm:h-16 sm:w-16">
                                    <Code2 className="h-6 w-6 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] sm:h-7 sm:w-7" />
                                </div>
                            </motion.div>

                            {/* Badge 2: User Profile */}
                            <motion.div
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: [0, -8, 0], opacity: 1 }}
                                transition={{
                                    y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.3 },
                                    opacity: { duration: 0.6, delay: 0.25 }
                                }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 opacity-50 blur-md transition-opacity group-hover:opacity-90" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/80 p-3 shadow-2xl backdrop-blur-xl transition-transform duration-300 group-hover:scale-105 group-hover:border-purple-400/60 sm:h-20 sm:w-20">
                                    <User className="h-7 w-7 text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] sm:h-9 sm:w-9" />
                                </div>
                            </motion.div>

                            {/* Badge 3: GitHub */}
                            <motion.div
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: [0, -6, 0], opacity: 1 }}
                                transition={{
                                    y: { repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.6 },
                                    opacity: { duration: 0.6, delay: 0.4 }
                                }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/30 to-sky-500/30 opacity-40 blur-md transition-opacity group-hover:opacity-80" />
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/70 p-3 shadow-2xl backdrop-blur-xl transition-transform duration-300 group-hover:scale-105 group-hover:border-purple-400/50 sm:h-16 sm:w-16">
                                    <Github className="h-6 w-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] sm:h-7 sm:w-7" />
                                </div>
                            </motion.div>
                        </div>

                        {/* "Welcome To" Headline */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
                        >
                            Welcome To
                        </motion.h1>

                        {/* "My Blog" Bold Gradient Subheading */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
                        >
                            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                My
                            </span>
                            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                                Blog
                            </span>
                        </motion.div>

                        {/* Link Badge with Globe Icon */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-8"
                        >
                            <div className="group relative inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-950/60 px-5 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_24px_rgba(168,85,247,0.25)] sm:px-6 sm:py-3">
                                <Globe className="h-4 w-4 text-sky-400 transition-transform duration-500 group-hover:rotate-45 sm:h-5 sm:w-5" />
                                <span className="font-mono text-xs font-medium tracking-wide text-slate-300 transition-colors group-hover:text-white sm:text-sm">
                                    {LINK}
                                </span>
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                            </div>
                        </motion.div>

                        {/* Quick entry hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="mt-6 font-mono text-[11px] text-slate-500"
                        >
                            Press [Space] or click anywhere to enter
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

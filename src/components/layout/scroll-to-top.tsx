'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

import useLenis from '@/hooks/useLenis'

export const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false)
    const [scrollPercent, setScrollPercent] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const { scrollTo } = useLenis()

    const { scrollYProgress } = useScroll()
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 280,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', latest => {
            setShowButton(latest > 0.06)
            setScrollPercent(Math.round(latest * 100))
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    const scrollToTop = () => {
        scrollTo(0, { duration: 1.2 })
    }

    const radius = 21

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="fixed right-6 bottom-6 z-50 sm:right-8 sm:bottom-8"
                >
                    {/* Hover Tooltip Pill */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/90 px-3 py-1 font-mono text-[11px] whitespace-nowrap text-slate-200 shadow-xl backdrop-blur-md"
                            >
                                <span>Lên đầu trang</span>
                                <span className="ml-1.5 font-bold text-purple-300">{scrollPercent}%</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Interactive Button */}
                    <motion.button
                        onClick={scrollToTop}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="group relative flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full focus:outline-none"
                        aria-label="Cuộn lên đầu trang"
                    >
                        {/* Ambient Backlight Halo */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 opacity-20 blur-xl transition-all duration-300 group-hover:opacity-60 group-hover:blur-2xl" />

                        {/* Circular SVG Progress Ring */}
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 52 52">
                            <defs>
                                <linearGradient id="scrollProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#38bdf8" />
                                    <stop offset="50%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>

                            {/* Background Track Circle */}
                            <circle
                                cx="26"
                                cy="26"
                                r={radius}
                                className="fill-none stroke-white/10"
                                strokeWidth="2.5"
                            />

                            {/* Foreground Animated Progress Circle */}
                            <motion.circle
                                cx="26"
                                cy="26"
                                r={radius}
                                className="fill-none"
                                stroke="url(#scrollProgressGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                style={{
                                    pathLength: smoothProgress
                                }}
                            />
                        </svg>

                        {/* Inner Titanium Glass Disc */}
                        <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/15 bg-slate-950/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all duration-300 group-hover:border-purple-400/50 group-hover:bg-slate-900 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                            <motion.div
                                animate={isHovered ? { y: -2 } : { y: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="text-slate-300 transition-colors duration-200 group-hover:text-white"
                            >
                                <ArrowUp className="h-4 w-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] sm:h-5 sm:w-5" />
                            </motion.div>
                        </div>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

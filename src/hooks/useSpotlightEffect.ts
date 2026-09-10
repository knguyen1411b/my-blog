'use client'

import { useEffect, useRef } from 'react'

interface SpotlightConfig {
    spotlightSize?: number
    spotlightIntensity?: number
    fadeSpeed?: number
    glowColor?: string
    pulseSpeed?: number
    numberColor?: number
}

const useSpotlightEffect = (config: SpotlightConfig = {}) => {
    const {
        spotlightSize = 500,
        spotlightIntensity = 0.8,
        fadeSpeed = 0.08,
        glowColor = config.glowColor || '130,92,193',
        pulseSpeed = 2888
    } = config

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const spotlightPos = useRef({ x: 0, y: 0 })
    const targetPos = useRef({ x: 0, y: 0 })
    const animationFrame = useRef<number | null>(null)
    const isAnimating = useRef(false)
    const lastMoveTime = useRef(0)

    useEffect(() => {
        const isTouchOrMobile =
            typeof window !== 'undefined' &&
            (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768 || 'ontouchstart' in window)

        if (isTouchOrMobile) {
            return
        }

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        ctxRef.current = ctx

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            startRender()
        }

        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor
        }

        const render = () => {
            if (!canvas || !ctx) {
                isAnimating.current = false
                return
            }

            spotlightPos.current.x = lerp(spotlightPos.current.x, targetPos.current.x, fadeSpeed)
            spotlightPos.current.y = lerp(spotlightPos.current.y, targetPos.current.y, fadeSpeed)

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const pulseScale = 1 + 0.1 * Math.sin((Date.now() / pulseSpeed) * Math.PI * 2)
            const currentSpotlightSize = spotlightSize * pulseScale

            const gradient = ctx.createRadialGradient(
                spotlightPos.current.x,
                spotlightPos.current.y,
                0,
                spotlightPos.current.x,
                spotlightPos.current.y,
                currentSpotlightSize
            )

            gradient.addColorStop(0, `rgba(${glowColor}, ${spotlightIntensity})`)
            gradient.addColorStop(0.1, `rgba(${glowColor}, ${spotlightIntensity * 0.5})`)
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

            ctx.globalCompositeOperation = 'destination-out'
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(spotlightPos.current.x, spotlightPos.current.y, currentSpotlightSize, 0, Math.PI * 2)
            ctx.fill()

            ctx.globalCompositeOperation = 'source-over'
            const glowGradient = ctx.createRadialGradient(
                spotlightPos.current.x,
                spotlightPos.current.y,
                0,
                spotlightPos.current.x,
                spotlightPos.current.y,
                currentSpotlightSize * 1.2
            )
            glowGradient.addColorStop(0, `rgba(${glowColor}, 0.3)`)
            glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(spotlightPos.current.x, spotlightPos.current.y, currentSpotlightSize * 1.2, 0, Math.PI * 2)
            ctx.fill()

            const dx = Math.abs(spotlightPos.current.x - targetPos.current.x)
            const dy = Math.abs(spotlightPos.current.y - targetPos.current.y)
            const isSettled = dx < 0.2 && dy < 0.2
            const isIdle = Date.now() - lastMoveTime.current > 1500

            if (isIdle && isSettled) {
                isAnimating.current = false
                return
            }

            animationFrame.current = requestAnimationFrame(render)
        }

        const startRender = () => {
            if (!isAnimating.current) {
                isAnimating.current = true
                animationFrame.current = requestAnimationFrame(render)
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            targetPos.current = { x: e.clientX, y: e.clientY }
            lastMoveTime.current = Date.now()
            startRender()
        }

        const handleMouseLeave = () => {
            lastMoveTime.current = 0
        }

        resizeCanvas()
        lastMoveTime.current = Date.now()
        startRender()

        window.addEventListener('resize', resizeCanvas, { passive: true })
        document.addEventListener('mousemove', handleMouseMove, { passive: true })
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
            isAnimating.current = false
        }
    }, [spotlightSize, spotlightIntensity, fadeSpeed, glowColor, pulseSpeed])

    return canvasRef
}

export default useSpotlightEffect

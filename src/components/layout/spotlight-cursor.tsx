'use client'

import { type HTMLAttributes } from 'react'

import useSpotlightEffect from '@/hooks/useSpotlightEffect'

type SpotlightCursorProps = HTMLAttributes<HTMLCanvasElement> & {
    glowColor?: string
}

export default function SpotlightCursor({ className, glowColor = '130,92,193', ...rest }: SpotlightCursorProps) {
    const canvasRef = useSpotlightEffect({ glowColor })

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none fixed top-0 left-0 z-[-1] hidden h-full w-full md:block ${className || ''}`}
            {...rest}
        />
    )
}

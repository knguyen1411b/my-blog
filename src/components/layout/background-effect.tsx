import st from './background-effect.module.css'

export default function BackgroundEffect() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
            {/* Ambient Gradient Orbs */}
            <div className="absolute inset-0">
                <div
                    className={`absolute top-0 -left-10 h-[360px] w-[360px] rounded-full bg-purple-600/25 blur-[70px] filter sm:h-[480px] sm:w-[480px] md:blur-[140px] ${st.movePurple}`}
                />
                <div
                    className={`absolute top-1/4 -right-10 hidden h-[500px] w-[500px] rounded-full bg-sky-500/20 blur-[150px] filter sm:block ${st.moveCyan}`}
                />
                <div
                    className={`absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-violet-600/20 blur-[70px] filter sm:h-[420px] sm:w-[420px] md:blur-[140px] ${st.moveBlue}`}
                />
            </div>

            {/* Subtle Engineering Grid */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                    backgroundSize: '48px 48px'
                }}
            />
        </div>
    )
}

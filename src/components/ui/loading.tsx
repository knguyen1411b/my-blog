export default function LoadingPage() {
    return (
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-indigo-600/15 to-purple-600/15 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl" />
        </div>
    )
}

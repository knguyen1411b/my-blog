/**
 * In-memory state tracking whether the Welcome screen has already been shown or bypassed.
 *
 * Rules:
 * 1. When the page is reloaded (F5) on the home route ('/'), this module is re-evaluated
 *    from scratch in the browser environment, allowing the Welcome screen to show once.
 * 2. If the user loads any non-home route (e.g. /[id], /admin), Welcome is
 *    automatically marked as dismissed so navigating to '/' won't trigger it.
 * 3. Client-side navigation (SPA) between pages keeps this module in memory, preventing
 *    Welcome from appearing when switching back and forth between pages.
 */

let hasDismissedWelcome = false

// Check if the browser directly loaded or hard-refreshed (F5) on the home route
if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
    const isHardLoadedAtHome = currentPath === '/'

    // If the browser session started or refreshed on a non-home route, bypass welcome on subsequent navigations
    if (!isHardLoadedAtHome) {
        hasDismissedWelcome = true
    }
}

export function shouldShowWelcome(): boolean {
    if (typeof window === 'undefined') {
        return true
    }
    return !hasDismissedWelcome
}

export function dismissWelcome(): void {
    hasDismissedWelcome = true
}

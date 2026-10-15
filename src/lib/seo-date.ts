/** Normalize stored ISO dates and legacy Vietnamese display dates for search metadata. */
export function toSeoDate(value?: string | null): string | undefined {
    if (!value) return undefined
    const vietnamese = value.trim().match(/^(\d{1,2}) tháng (\d{1,2}),? (\d{4})$/)
    const normalized = vietnamese
        ? `${vietnamese[3]}-${vietnamese[2].padStart(2, '0')}-${vietnamese[1].padStart(2, '0')}`
        : value.trim()
    if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(normalized)) return undefined
    const date = new Date(normalized)
    const calendarDate = new Date(normalized.slice(0, 10))
    if (Number.isNaN(date.getTime()) || calendarDate.toISOString().slice(0, 10) !== normalized.slice(0, 10))
        return undefined
    return date.toISOString()
}

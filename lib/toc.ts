import GithubSlugger from 'github-slugger'

export interface TocItem {
    id: string
    text: string
    level: number
}

export function extractToc(markdown: string): TocItem[] {
    const slugger = new GithubSlugger()
    const lines = markdown.split('\n')
    const items: TocItem[] = []

    for (const line of lines) {
        const match = /^(#{1,3})\s+(.+)$/.exec(line.trim())
        if (!match) {
            continue
        }

        const level = match[1].length
        const text = match[2].trim()

        if (!text) {
            continue
        }

        items.push({
            id: slugger.slug(text),
            text,
            level
        })
    }

    return items
}

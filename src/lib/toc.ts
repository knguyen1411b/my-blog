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
    let inCodeBlock = false

    for (const line of lines) {
        const trimmed = line.trim()

        // Ignore lines inside fenced code blocks (``` or ~~~)
        if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
            inCodeBlock = !inCodeBlock
            continue
        }

        if (inCodeBlock) {
            continue
        }

        const match = /^(#{1,3})\s+(.+)$/.exec(trimmed)
        if (!match) {
            continue
        }

        const level = match[1].length
        const rawText = match[2].trim()

        // Clean inline markdown syntax (bold, italics, code, links) to match rehype-slug output
        const text = rawText
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .trim()

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

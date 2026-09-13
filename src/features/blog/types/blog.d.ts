export interface IAuthor {
    id?: string
    name: string
    avatar: string
    role?: string
    bio?: string
    login?: string
    avatarUrl?: string
    url?: string
}

export interface ICategory {
    id: string
    name: string
    slug: string
    description?: string
}

export interface ICommentReply {
    id: string
    authorName: string
    authorAvatar?: string
    content: string
    createdAt: string
}

export interface IComment {
    id: string
    authorName: string
    authorAvatar?: string
    content: string
    createdAt: string
    replies?: ICommentReply[]
}

export interface IBreadcrumbItem {
    label: string
    url?: string
}

export interface IBlogSEO {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
    keywords?: string[]
}

export interface IBlog {
    id: string
    slug: string
    title: string
    summary: string
    content: string
    coverImage?: string
    category: ICategory
    tags: string[]
    author: IAuthor
    publishedAt: string
    updatedAt?: string
    readingTime: string
    views: number
    likes?: number
    commentsCount?: number
    comments?: IComment[]
    seo?: IBlogSEO
    featured?: boolean
    status?: 'draft' | 'published'
    /** TL;DR dành cho GEO: AI bots (ChatGPT, Gemini, Perplexity) thường dùng đoạn này làm câu trả lời trích dẫn */
    tldr?: string

    // Fields for backward compatibility with GitHub Discussions or legacy code
    number?: number
    url?: string
    discussionUrl?: string
    bodyText?: string
    body?: string
    createdAt?: string
    lastEdited?: string | null
    labels?: {
        nodes: Array<{
            name: string
        }>
    }
}

export type IBlogDetail = IBlog

export interface IBlogDetail {
    title: string
    body: string
    createdAt: string

    author: {
        login: string
        avatarUrl: string
        url: string
    }

    labels: {
        nodes: {
            name: string
        }[]
    }

    comments: {
        totalCount: number

        nodes: {
            body: string
            createdAt: string

            author: {
                login: string
                avatarUrl: string
                url: string
            }

            replies: {
                totalCount: number

                nodes: {
                    body: string
                    createdAt: string

                    author: {
                        login: string
                        avatarUrl: string
                        url: string
                    }
                }[]
            }
        }[]
    }
}

export interface IBlog {
    title: string
    url: string
    number: number
    discussionUrl: string
    bodyText: string
    labels: {
        nodes: Array<{
            name: string
        }>
    }
    createdAt: string
    lastEdited?: string | null
    author: {
        login: string
        avatarUrl: string
        url: string
    }
}

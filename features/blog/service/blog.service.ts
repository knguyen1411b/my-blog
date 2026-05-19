import type { IBlog, IBlogDetail } from '@/features/blog/types/blog'
import { githubRequest } from '@/lib/github-api'
import { discussionDetailGql, discussionGql } from '@/lib/gql'

export async function getBlogs(): Promise<IBlog[]> {
    const data = await githubRequest<{
        repository: {
            discussions: {
                nodes: IBlog[]
            }
        }
    }>(discussionGql())

    return data.repository.discussions.nodes ?? []
}

export async function getBlog(postId: unknown): Promise<IBlogDetail> {
    const id = Number(postId)

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid post ID')
    }

    const data = await githubRequest<{
        repository?: {
            discussion?: IBlogDetail | null
        } | null
    }>(discussionDetailGql(id))

    const discussion = data.repository?.discussion

    if (!discussion) {
        throw new Error('Post not found')
    }

    return discussion
}

import type { IMe } from '@/features/home/types/me'
import { githubRequest } from '@/lib/github-api'
import { meProfileGql } from '@/lib/gql'

export async function getMe(): Promise<IMe> {
    const data = await githubRequest<{ viewer: IMe }>(meProfileGql())
    return data.viewer
}

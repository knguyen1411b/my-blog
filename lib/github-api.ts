import { API_URL } from '@/lib/contansts'

function getRequiredEnv(name: 'GITHUB_TOKEN') {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

interface GraphQLError {
    message: string
}

interface GraphQLResponse<T> {
    data: T
    errors?: GraphQLError[]
}

export async function githubRequest<T>(query: string): Promise<T> {
    const token = getRequiredEnv('GITHUB_TOKEN')
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 300 }
    })

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors?.length) {
        throw new Error(result.errors[0].message)
    }

    return result.data
}

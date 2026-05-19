import { NextResponse } from 'next/server'

import { getBlog } from '@/features/blog/service/blog.service'

interface Context {
    params: Promise<{ id: string }>
}

export async function GET(_: Request, context: Context) {
    const { id } = await context.params

    try {
        const blog = await getBlog(id)
        return NextResponse.json(blog)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load blog'
        return NextResponse.json({ message }, { status: 404 })
    }
}

import { NextResponse } from 'next/server'

import { getBlogs } from '@/features/blog/service/blog.service'

export async function GET() {
    try {
        const blogs = await getBlogs()
        return NextResponse.json(blogs)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load blogs'
        return NextResponse.json({ message }, { status: 500 })
    }
}

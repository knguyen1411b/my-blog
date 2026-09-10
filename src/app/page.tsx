import { Suspense } from 'react'

import { getBlogs } from '@/features/blog/service/blog.service'
import { HomeContainer } from '@/features/home'

export const revalidate = 60

export default async function HomePage() {
    const initialBlogs = await getBlogs()

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#07090e]" />}>
            <HomeContainer initialBlogs={initialBlogs} />
        </Suspense>
    )
}

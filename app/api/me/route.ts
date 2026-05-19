import { NextResponse } from 'next/server'

import { getMe } from '@/features/home/service/me.service'

export async function GET() {
    try {
        const me = await getMe()
        return NextResponse.json(me)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load profile'
        return NextResponse.json({ message }, { status: 500 })
    }
}

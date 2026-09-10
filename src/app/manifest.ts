import type { MetadataRoute } from 'next'

import { SITE_CONFIG } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_CONFIG.name,
        short_name: SITE_CONFIG.shortName,
        description: SITE_CONFIG.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#06080d',
        theme_color: '#06080d',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon'
            }
        ]
    }
}

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '행복한교회',
        short_name: '행복한교회',
        description: '하나님의 사랑을 실천하는 행복한교회',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#d4a853',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/icon-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
            },
            {
                src: '/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any',
            },
        ],
    }
}

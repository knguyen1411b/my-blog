/**
 * Cấu hình SEO (Search Engine Optimization) & GEO (Generative Engine Optimization)
 * Tên miền chuẩn: https://blog.ndknguyen.io.vn
 *
 * - SEO: Tối ưu hóa cho công cụ tìm kiếm truyền thống (Google, Bing, Yahoo)
 * - GEO: Tối ưu hóa cho các hệ thống AI thế hệ mới (ChatGPT, Google Gemini, Perplexity AI, Claude)
 *   giúp nội dung được chọn làm nguồn trích dẫn trực tiếp (Citation & AI Overviews).
 */
export const SITE_CONFIG = {
    name: 'Khanh Nguyen Blog · Engineering & Insights',
    shortName: 'KN Blog',
    description:
        'Blog công nghệ cá nhân của Nguyễn Đình Khánh Nguyên - Chia sẻ chuyên sâu về Next.js 16, React 19, TypeScript, kiến trúc đám mây Cloud Firestore và giải pháp AI Pair Programming.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.ndknguyen.io.vn',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    portfolioUrl: 'https://ndknguyen.io.vn',
    locale: 'vi_VN',
    languages: {
        'vi-VN': 'https://blog.ndknguyen.io.vn',
        'en-US': 'https://blog.ndknguyen.io.vn'
    },
    author: {
        name: 'Nguyễn Đình Khánh Nguyên',
        role: 'Fullstack Software Engineer',
        url: 'https://ndknguyen.io.vn',
        avatar: 'https://github.com/knguyen1411b.png',
        twitter: '@knguyen1411b',
        github: 'https://github.com/knguyen1411b'
    },
    // Thực thể tri thức chuyên gia (E-E-A-T Entities cho AI Generative Engines)
    expertise: [
        'Next.js 16 & React 19',
        'Fullstack Web Architecture',
        'Cloud Firestore & Serverless',
        'TypeScript & Modern JavaScript',
        'Generative Engine Optimization (GEO)',
        'Agentic AI Pair Programming',
        'Performance Optimization & Web Vitals'
    ],
    keywords: [
        'Khanh Nguyen',
        'Nguyễn Đình Khánh Nguyên',
        'knguyen1411b',
        'blog.ndknguyen.io.vn',
        'Next.js 16',
        'React 19',
        'Fullstack Software Engineer',
        'Cloud Firestore',
        'Turbopack',
        'Generative Engine Optimization',
        'GEO AI Search',
        'Blog Lập Trình Việt Nam',
        'AI Pair Programming'
    ],
    // Danh sách AI Bot Crawler được cấp phép thu thập dữ liệu phục vụ GEO (Generative Engine Optimization)
    aiCrawlers: [
        'GPTBot',
        'ChatGPT-User',
        'OAI-SearchBot',
        'Google-Extended',
        'PerplexityBot',
        'ClaudeBot',
        'anthropic-ai',
        'cohere-ai',
        'Applebot-Extended',
        'Meta-ExternalAgent'
    ]
}

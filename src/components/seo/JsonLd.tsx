import { SITE_CONFIG } from '@/config/site'

/**
 * Root Structured Data (JSON-LD)
 * Tối ưu hóa SEO & GEO:
 * - Khai báo cấu trúc WebSite và Entity Tác giả (Person) chuẩn Schema.org
 * - Khai báo E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 *   giúp các mô hình AI (ChatGPT, Google Gemini, Perplexity) nhận diện tác giả là nguồn chuyên gia đáng tin cậy.
 */
export function RootJsonLd() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_CONFIG.url}/#website`,
                url: SITE_CONFIG.url,
                name: SITE_CONFIG.name,
                alternateName: SITE_CONFIG.shortName,
                description: SITE_CONFIG.description,
                inLanguage: ['vi-VN', 'en-US'],
                publisher: {
                    '@id': `${SITE_CONFIG.portfolioUrl}/#person`
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: `${SITE_CONFIG.url}/?search={search_term_string}`
                    },
                    'query-input': 'required name=search_term_string'
                }
            },
            {
                '@type': 'Person',
                '@id': `${SITE_CONFIG.portfolioUrl}/#person`,
                name: SITE_CONFIG.author.name,
                alternateName: 'Khanh Nguyen',
                jobTitle: SITE_CONFIG.author.role,
                url: SITE_CONFIG.portfolioUrl,
                image: SITE_CONFIG.author.avatar,
                // sameAs kết nối các profile để Google xây dựng Knowledge Panel
                sameAs: [
                    SITE_CONFIG.portfolioUrl,
                    SITE_CONFIG.url,
                    SITE_CONFIG.author.github,
                    `https://twitter.com/${SITE_CONFIG.author.twitter.replace('@', '')}`,
                    'https://www.linkedin.com/in/knguyen1411b'
                ],
                knowsAbout: SITE_CONFIG.expertise,
                description:
                    'Kỹ sư phần mềm Fullstack chuyên sâu về Next.js 16, React 19, TypeScript, kiến trúc đám mây Cloud Firestore và AI Pair Programming.'
            }
        ]
    }

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
}

/**
 * Article Structured Data (JSON-LD)
 * Tối ưu hóa GEO (Generative Engine Optimization):
 * - Định dạng TechArticle với abstract cô đọng giúp AI Overviews trích dẫn trực tiếp.
 * - Thuộc tính speakable hỗ trợ AI Voice & Audio Search Overview.
 * - Liên kết thực thể tác giả và nhà xuất bản để tăng điểm tin cậy E-E-A-T.
 */
export function ArticleJsonLd({
    title,
    description,
    url,
    imageUrl,
    datePublished,
    dateModified,
    tags
}: {
    title: string
    description: string
    url: string
    imageUrl: string
    datePublished: string
    dateModified?: string
    tags?: string[]
}) {
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        '@id': `${url}/#article`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
        },
        headline: title,
        description,
        abstract: description,
        image: [imageUrl],
        datePublished,
        dateModified: dateModified || datePublished,
        inLanguage: 'vi-VN',
        keywords: tags?.join(', ') || '',
        proficiencyLevel: 'Expert',
        isAccessibleForFree: true,
        // Tham chiếu @id tới thực thể Person trên Portfolio — giúp Google hiểu
        // mọi bài viết trên Blog đều thuộc cùng tác giả với Portfolio,
        // tăng Trust Score & E-E-A-T cho cả 2 domain.
        author: {
            '@type': 'Person',
            '@id': `${SITE_CONFIG.portfolioUrl}/#person`,
            name: SITE_CONFIG.author.name,
            url: SITE_CONFIG.portfolioUrl
        },
        publisher: {
            '@type': 'Organization',
            name: 'Khanh Nguyen Blog',
            url: SITE_CONFIG.url,
            logo: {
                '@type': 'ImageObject',
                url: SITE_CONFIG.author.avatar
            }
        },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'article p', 'article h2', 'article h3']
        }
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Blog',
                item: SITE_CONFIG.url
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: url
            }
        ]
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        </>
    )
}

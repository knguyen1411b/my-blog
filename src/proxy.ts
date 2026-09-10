import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy (thay thế middleware.ts truyền thống)
 * Chức năng:
 * 1. Bổ sung các HTTP Security Headers tiêu chuẩn cao cấp (chống Clickjacking, MIME sniffing, XSS).
 * 2. Cấu hình Content-Security-Policy (CSP) linh hoạt, hỗ trợ Next.js, Firebase Auth & Firestore, và ảnh từ remote CDNs.
 * 3. Kiểm soát và gắn request-id phục vụ logging và tracing an ninh mạng.
 */
export function proxy(request: NextRequest) {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname
    response.headers.set('x-current-path', pathname)

    // 1. Chống Clickjacking: Ngăn chặn trang web bị nhúng vào iframe của domain độc hại
    response.headers.set('X-Frame-Options', 'DENY')

    // 2. Chống MIME-Type Sniffing: Bắt buộc trình duyệt tuân thủ Content-Type do server khai báo
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // 3. Referrer Policy: Bảo vệ thông tin URL nội bộ khi người dùng click link ra ngoài
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // 4. Giới hạn các quyền API nhạy cảm của trình duyệt (Permissions Policy)
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()'
    )

    // 5. XSS Protection cho các trình duyệt cũ
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // 6. Content Security Policy (CSP) toàn diện:
    // - Hỗ trợ Next.js Turbopack HMR và Script Execution
    // - Hỗ trợ Firebase Authentication và Cloud Firestore APIs
    // - Cho phép tải ảnh từ tất cả nguồn remote bên ngoài (HTTPS / HTTP)
    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https: http:",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https://*.googleapis.com https://firestore.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebasestorage.app wss://*.firebaseio.com wss://*.googleapis.com",
        "frame-src 'self' https://*.firebaseapp.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ].join('; ')

    response.headers.set('Content-Security-Policy', cspDirectives)

    // 7. Gắn Request ID giúp giám sát lưu lượng truy cập
    const requestId = crypto.randomUUID()
    response.headers.set('X-Request-Id', requestId)

    return response
}

export const config = {
    matcher: [
        /*
         * Áp dụng proxy trên toàn bộ routes ngoại trừ:
         * - _next/static (static chunks, css, js)
         * - _next/image (tối ưu hóa ảnh)
         * - favicon.ico, manifest, robots, sitemap
         */
        '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml).*)'
    ]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Cho phép hiển thị ảnh định dạng SVG từ các nguồn bên ngoài
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        // Cho phép tải ảnh từ tất cả các domain bên ngoài (cả HTTPS và HTTP)
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                pathname: '**'
            },
            {
                protocol: 'http',
                hostname: '**',
                pathname: '**'
            }
        ]
    }
}

export default nextConfig

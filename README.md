<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06b6d4,50:6366f1,100:a855f7&height=200&section=header&text=Khanh%20Nguyen%20Blog&fontSize=48&fontColor=ffffff&fontAlignY=38&desc=Engineering%20%26%20Insights&descSize=18&descAlignY=58&animation=fadeIn" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Blog-blog.ndknguyen.io.vn-06b6d4?style=for-the-badge&logo=vercel&logoColor=white)](https://blog.ndknguyen.io.vn)
[![Portfolio](https://img.shields.io/badge/👤_Portfolio-ndknguyen.io.vn-a855f7?style=for-the-badge&logo=safari&logoColor=white)](https://ndknguyen.io.vn)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](./LICENSE)

<br/>

```
  ██████╗ ██╗      ██████╗  ██████╗
  ██╔══██╗██║     ██╔═══██╗██╔════╝
  ██████╔╝██║     ██║   ██║██║  ███╗
  ██╔══██╗██║     ██║   ██║██║   ██║
  ██████╔╝███████╗╚██████╔╝╚██████╔╝
  ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝
  ── Engineering & Insights ──
```

> **Blog kỹ thuật cá nhân** của [Nguyễn Đình Khánh Nguyên](https://ndknguyen.io.vn) —  
> Chia sẻ chuyên sâu về Next.js 16, React 19, TypeScript, Cloud Firestore và AI Engineering.

</div>

---

## ⚡ Tech Stack

<div align="center">

|      Layer       | Technology                                     |
| :--------------: | :--------------------------------------------- |
| 🏗️ **Framework** | Next.js 16 · App Router · Turbopack            |
|    ⚛️ **UI**     | React 19 · Tailwind CSS v4 · HeroUI            |
|  🔥 **Backend**  | Firebase Firestore · Firebase Auth             |
|   🔄 **Data**    | TanStack React Query v5                        |
| ✍️ **Markdown**  | React Markdown · Rehype Highlight · Remark GFM |
|   🎨 **Icons**   | Lucide React · Custom SVG                      |
|  🚀 **Deploy**   | Vercel · GitHub Actions CI/CD                  |

</div>

---

## ✨ Tính Năng Nổi Bật

```
┌─────────────────────────────────────────────────────────────┐
│  🎨  Cyberpunk Dark UI                                       │
│      Bảng màu #06080d · Ambient Glow · Matrix Dot Grid      │
│      Laser scroll progress bar · Glassmorphism cards        │
├─────────────────────────────────────────────────────────────┤
│  📖  Trải Nghiệm Đọc Đẳng Cấp                               │
│      Sticky TOC tự động · Reading progress · Live likes     │
│      TL;DR box (GEO-optimized) · Author Hub & Spoke CTA     │
├─────────────────────────────────────────────────────────────┤
│  🛡️  Admin Dashboard Toàn Diện                              │
│      Firebase Auth · Markdown editor · Live split preview   │
│      Auto SEO slug · Tag management · Draft/Publish flow    │
├─────────────────────────────────────────────────────────────┤
│  🔍  SEO & GEO Double Optimization                          │
│      Schema.org TechArticle · BreadcrumbList · Person @id   │
│      llms.txt · robots.txt · Sitemap động từ Firestore      │
├─────────────────────────────────────────────────────────────┤
│  🔒  Bảo Mật & Hiệu Năng                                    │
│      CSP Headers · Proxy middleware · SSR data fetching     │
│      experimentalForceLongPolling · Firestore rules          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu

- Node.js ≥ 24
- pnpm ≥ 9

### 1. Clone & Cài Đặt

```bash
git clone https://github.com/knguyen1411b/my-blog.git
cd my-blog
pnpm install
```

### 2. Cấu Hình Biến Môi Trường

```bash
cp .env.example .env
```

Điền thông tin Firebase vào file `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SITE_URL=https://blog.ndknguyen.io.vn
```

> 💡 Lấy thông tin Firebase tại [console.firebase.google.com](https://console.firebase.google.com)

### 3. Chạy Development Server

```bash
pnpm dev
```

Mở trình duyệt tại **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Cấu Trúc Dự Án

```
my-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [id]/               # Dynamic blog post pages
│   │   ├── admin/              # Admin dashboard (protected)
│   │   │   ├── login/          # Firebase Auth login
│   │   │   ├── editor/         # Markdown editor
│   │   │   └── page.tsx        # Post management
│   │   ├── layout.tsx          # Root layout + SEO metadata
│   │   ├── page.tsx            # Home page (SSR)
│   │   ├── sitemap.ts          # Dynamic sitemap from Firestore
│   │   └── robots.ts           # SEO + AI crawlers config
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Background effects
│   │   └── seo/                # JSON-LD structured data
│   ├── features/
│   │   ├── blog/               # Blog detail feature
│   │   └── home/               # Home listing feature
│   ├── config/
│   │   └── site.ts             # SEO/GEO config — domain, metadata
│   ├── lib/
│   │   └── firebase.ts         # Firebase initialization
│   └── proxy.ts                # Security middleware (CSP, headers)
├── public/
│   └── llms.txt                # AI crawlers context file
├── firestore.rules             # Firestore security rules
└── .github/workflows/ci.yml   # GitHub Actions CI/CD
```

---

## 🧭 Routes

| Route           | Mô Tả                                   | Bảo Vệ  |
| :-------------- | :-------------------------------------- | :-----: |
| `/`             | Trang chủ · Hero, search, danh sách bài |    —    |
| `/[slug]`       | Chi tiết bài viết (hỗ trợ slug & ID)    |    —    |
| `/admin/login`  | Đăng nhập quản trị viên                 |    —    |
| `/admin`        | Dashboard · Quản lý bài viết            | 🔒 Auth |
| `/admin/editor` | Trình soạn thảo Markdown                | 🔒 Auth |
| `/sitemap.xml`  | Sitemap động từ Firestore               |    —    |
| `/robots.txt`   | Cấu hình SEO & AI crawlers              |    —    |
| `/llms.txt`     | Context file cho LLMs                   |    —    |

---

## 🔒 Firestore Security Rules

```javascript
// Chỉ published posts mới có thể đọc công khai
// Drafts yêu cầu Firebase Authentication
allow read: if resource.data.status == 'published' || isAuthenticated();
allow write: if isAuthenticated();
```

---

## 🌍 Deploy

### Vercel (Khuyến nghị)

1. Fork repo → import vào [vercel.com](https://vercel.com)
2. Thêm Environment Variables (tất cả `NEXT_PUBLIC_FIREBASE_*`)
3. Deploy tự động khi push lên `main`

### GitHub Actions CI/CD

Pipeline tự động chạy **lint + build** trên mỗi Pull Request.  
Secrets cần thiết trong repo Settings → Secrets:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_SITE_URL
```

---

## 📊 SEO & GEO Architecture

```
                    ┌─────────────────────┐
                    │  ndknguyen.io.vn    │  ← Portfolio (Hub)
                    │  Person @id schema  │
                    └──────────┬──────────┘
                               │ sameAs + internal links
                    ┌──────────▼──────────┐
                    │ blog.ndknguyen.io.vn│  ← Blog (Spoke)
                    │  TechArticle schema │
                    │  author @id ref     │
                    │  BreadcrumbList     │
                    └─────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         Google Bot        GPTBot          ClaudeBot
         Bingbot         Gemini-Bot       PerplexityBot
         (SEO)              (GEO)            (GEO)
```

---

## 📄 License

MIT © [Nguyễn Đình Khánh Nguyên](https://ndknguyen.io.vn)

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:a855f7,50:6366f1,100:06b6d4&height=120&section=footer" width="100%"/>

**Built with ❤️ by [Nguyễn Đình Khánh Nguyên](https://ndknguyen.io.vn)**

[![Blog](https://img.shields.io/badge/Blog-blog.ndknguyen.io.vn-06b6d4?style=flat-square)](https://blog.ndknguyen.io.vn)
[![GitHub](https://img.shields.io/badge/GitHub-knguyen1411b-333?style=flat-square&logo=github)](https://github.com/knguyen1411b)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-knguyen1411b-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/knguyen1411b)

_⭐ Nếu project này hữu ích, hãy để lại một Star nhé!_

</div>

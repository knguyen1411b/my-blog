# Khanh Nguyen Blog · Engineering & Insights

Blog platform cá nhân chuyên sâu về lập trình, giải pháp hệ thống và công cụ tối ưu hóa, được xây dựng với **Next.js 16 App Router**, **Firebase Cloud Firestore**, và **Firebase Authentication**. Thiết kế đồng bộ hoàn toàn với trang chủ Portfolio [ndknguyen.io.vn](https://ndknguyen.io.vn).

---

## 🌟 Điểm Nổi Bật

- **Phong Cách Cyberpunk Dark Aesthetics**: Bảng màu tối `#06080d`, ánh sáng tỏa Ambient Glow, lưới vi điểm Matrix Dot, thanh laser chân trời.
- **Liên Kết Liên Thông Portfolio**: Navbar & Footer điều hướng trực tiếp sang Portfolio cá nhân, danh sách dự án, kỹ năng, liên hệ và đồng hồ thời gian thực giờ Việt Nam (GMT+7).
- **Giao Diện Đọc Bài Chuẩn Tatteam**: Khối thông tin 4 mục (Tác giả, Ngày đăng, Thời gian đọc, Lượt xem), khối trích dẫn nổi bật (Excerpt callout), nút chia sẻ mạng xã hội, thẻ tác giả liên kết portfolio và **Mục lục tự động ghim (Sticky TOC)** theo dõi vị trí cuộn trang.
- **Hệ Thống Quản Trị Bài Viết Toàn Diện**:
    - Đăng nhập xác thực bằng Email / Mật khẩu qua Firebase Authentication (`/admin/login`).
    - Bảng điều khiển quản lý bài viết (`/admin`): Thống kê, tìm kiếm, lọc theo chuyên mục/trạng thái, ghim nổi bật, sửa/xóa bài.
    - Trình soạn thảo Markdown trực quan (`/admin/editor`): Xem trước trực tiếp (Live Split Preview), thanh công cụ định dạng nhanh, tự động tạo slug chuẩn SEO.
- **Lưu Trữ Đồng Bộ Firebase**: Quản lý bài viết trên Cloud Firestore, đồng bộ trạng thái thời gian thực với TanStack Query.

---

## 🛠️ Công Nghệ Sử Dụng

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Styling**: React 19, Tailwind CSS v4, HeroUI
- **Backend & Auth**: Firebase Firestore, Firebase Authentication
- **State & Data Fetching**: TanStack React Query v5
- **Markdown & Code Highlighting**: React Markdown, Rehype Highlight, Rehype Slug, Remark GFM, GitHub Slugger
- **Icons**: Lucide React + Custom SVG Icons

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt các gói phụ thuộc

```bash
pnpm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` hoặc `.env.local` ở thư mục gốc:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Khởi chạy máy chủ phát triển

```bash
pnpm dev
```

Mở trình duyệt tại: `http://localhost:3000`

---

## 🧭 Cấu Trúc Các Tuyến Đường (Routes)

- `/`: Trang chủ blog (Hero banner, thống kê, tìm kiếm, danh mục, danh sách bài viết)
- `/[id]`: Chi tiết bài viết (Hỗ trợ truy cập cả bằng `slug` hoặc `id`)
- `/admin/login`: Màn hình đăng nhập quản trị viên
- `/admin`: Bảng điều khiển quản trị bài viết (Được bảo vệ bằng Firebase Auth)
- `/admin/editor`: Trình soạn thảo bài viết Markdown (Được bảo vệ bằng Firebase Auth)

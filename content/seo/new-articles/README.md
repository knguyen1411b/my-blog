# Bốn bài viết kỹ thuật mới — 15/10/2026

Các chủ đề được chọn từ vấn đề quan sát được khi kiểm tra portfolio và blog: HTML/metadata, Firestore rules, upload lưu tạm, và cấu hình khi deploy. Đây là lựa chọn biên tập; chưa có dữ liệu search volume hay cam kết traffic.

| Bài                         | Nhu cầu thực hành                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| SEO Next.js 16              | Kiểm tra vì sao một URL chưa xuất hiện như mong đợi; phân biệt HTML, DOM và metadata streaming. |
| Firestore permission-denied | Đối chiếu điều kiện query/rules và phân biệt lỗi index.                                         |
| Upload file                 | Phân biệt bộ nhớ tạm với object storage, thiết kế quyền và trạng thái upload.                   |
| NEXT_PUBLIC / .env          | Chẩn đoán cấu hình build/runtime và tránh đưa credential ra client.                             |

Dữ liệu website: `src/content/posts.json`. Các file Markdown cạnh tài liệu này là bản đọc độc lập. Nguồn chính thức được dẫn tại từng phần của mỗi bài; các đề xuất kiểm tra được phân biệt với tính năng của nhà cung cấp.

Bài mới được quản lý trong repo. Chỉ danh sách công khai ghép các bài này với dữ liệu Firestore; trang quản trị Firestore không liệt kê bài chỉ nằm trong repo. Nếu trùng ID hoặc slug, bản nội dung trong repo có ưu tiên để danh sách và trang chi tiết nhất quán. Không ghi thêm document production trong lượt này.

Ngày xuất bản/cập nhật là ngày viết thật. Views, likes và comments khởi tạo bằng 0, không tạo số liệu hoặc lời chứng thực. Giữ ngày hiển thị và ngày structured data nhất quán. Các bài sẽ xuất hiện trong trang chủ, search, bộ lọc, sitemap và RSS của bản deploy mới.

Nguồn kỹ thuật được tổng hợp tại `docs/seo/new-articles-research.md`. Đối chiếu ngày 15/10/2026, không giả định tài liệu trực tuyến luôn cùng minor version với repo đang cài.

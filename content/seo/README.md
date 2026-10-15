# Blog content rewrite — 2026-10-15

Mục tiêu: giải thích rõ chủ đề, giúp độc giả thực hiện hoặc đánh giá một công việc cụ thể, và kết nối tự nhiên tới các case study Fullstack.

- `source/blogs.json`: hai bài công khai được tải từ Firestore trước khi viết lại. Bản sao không bao gồm bài nháp vì chúng không cho phép đọc công khai.
- `rewritten/*.md`: hai bài hoàn chỉnh để đọc, review hoặc xuất riêng.
- `../../src/content/blogs.json`: title, summary, TL;DR, tags, nội dung Markdown, thời lượng đọc và metadata được website sử dụng.
- [Nghiên cứu SEO](../../docs/seo/editorial-research.md): hướng dẫn Google và các nguyên tắc biên tập.

Giữ nguyên ID, slug, ngày xuất bản, tác giả, ảnh bìa và chỉ số từ nguồn. Ngày cập nhật nội dung mới được hiển thị riêng. Khi bài được chủ website chỉnh trong Firestore với timestamp mới hơn, dữ liệu mới sẽ có ưu tiên hơn bản biên tập đóng gói.

## Phạm vi viết lại

Bài PDF được làm rõ là giới thiệu PDFMathTranslate do cộng đồng duy trì; không gắn công cụ này với tác giả portfolio. Bỏ các ảnh stock bị chú thích như ảnh chụp giao diện hoặc sơ đồ kiến trúc. Thay nội dung quảng bá bằng quy trình dịch mẫu, đối chiếu công thức, bảng, chú thích và giới hạn của đầu vào.

Bài Antigravity giải thích công cụ ở mức tổng quan theo tài liệu chính thức, sau đó trình bày quy trình kiểm chứng của tác giả. Bỏ các cam kết như triệt tiêu 100% lỗi, giảm nhiều tuần còn vài giờ hoặc đảm bảo chất lượng tuyệt đối.

Các bài dẫn tới nhau và các case study liên quan bằng anchor mô tả rõ đích đến, có đường dẫn CV và hồ sơ tác giả. Không tạo bài mới hoặc đổi URL đang được index.

## Nguồn kỹ thuật

- [PDFMathTranslate](https://github.com/PDFMathTranslate/PDFMathTranslate)
- [Nghiên cứu PDFMathTranslate](https://arxiv.org/abs/2507.03009)
- [Antigravity IDE](https://www.antigravity.google/docs/ide/overview/)
- [Antigravity agent](https://www.antigravity.google/docs/agent/)
- [Antigravity settings](https://antigravity.google/docs/agent-settings)
- [Next.js hydration errors](https://nextjs.org/docs/messages/react-hydration-error)
- [Firestore security rules](https://firebase.google.com/docs/firestore/security/rules-conditions)

## Kiểm tra

Chạy `node --test tests/*.test.mjs`, `pnpm lint` và `pnpm build`. Đối chiếu bài viết trong HTML với title, description, canonical, ngày và schema. Bản thay đổi hiện nằm ở workspace; chưa ghi lên Firestore hoặc deploy.

## Bài mới bổ sung

Bốn bài mới nằm trong `src/content/posts.json` và `content/seo/new-articles/`. Blog công khai ghép các bài được quản lý trong repo với hai bài hiện có từ Firestore; xem README của thư mục new-articles để biết phạm vi quản lý nội dung.

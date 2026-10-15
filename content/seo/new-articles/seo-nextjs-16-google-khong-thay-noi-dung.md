# SEO Next.js 16: kiểm tra khi Google chưa thấy nội dung trang

Một quy trình kiểm tra HTML, canonical, robots và nội dung render cho blog hoặc portfolio Next.js trước khi kết luận website gặp lỗi SEO.

Bạn mở trang dự án và thấy giao diện đầy đủ, nhưng khi kiểm tra kết quả tìm kiếm lại chưa thấy trang đó. Tình huống này có nhiều khả năng: URL chưa được phát hiện, nội dung cần chờ JavaScript, canonical trỏ về trang khác hoặc trang có chỉ dẫn không lập chỉ mục. Thêm vài từ khóa vào description không giúp xác định nguyên nhân.

Bài này đề xuất thứ tự kiểm tra cho blog và portfolio dùng Next.js App Router. Mục tiêu là thu thập bằng chứng của từng URL trước khi sửa cấu hình. Các API được đối chiếu với Next.js 16; hãy kiểm tra phiên bản cài trong repo trước khi áp dụng ví dụ.

## 1. Bắt đầu từ URL thật trên môi trường deploy

Ghi lại chính xác URL, kể cả domain và đường dẫn. Mở trực tiếp URL đó thay vì chỉ điều hướng từ trang chủ. Kiểm tra trạng thái phản hồi và việc chuyển hướng: một đường dẫn sai nhưng vẫn hiện giao diện không có nghĩa nội dung tương ứng tồn tại.

Sau đó, kiểm tra title, H1, đoạn mô tả và liên kết đi vào trang. Một project chỉ được mở bằng một nút chạy JavaScript sẽ khó kiểm tra hơn project có liên kết HTML rõ ràng. Hãy giữ một đường dẫn nhất quán giữa thẻ canonical, sitemap và các liên kết nội bộ.

## 2. Phân biệt HTML ban đầu với DOM sau render

[Google mô tả quá trình crawl, render và index nội dung JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Vì vậy, không nên kết luận mọi trang dùng Client Components đều vô hình với Google.

Cách kiểm tra thực tế là xem cả phản hồi HTML lẫn trang sau khi render. Nếu phản hồi ban đầu chỉ có màn hình tải, hãy tìm xem dữ liệu chính được lấy ở đâu, khi nào UI xuất hiện và điều gì xảy ra khi truy vấn thất bại. Với portfolio, tên dự án, bài toán và mô tả là phần nội dung cần ưu tiên.

Một màn hình chào có thể hiển thị như lớp phủ trong khi nội dung chính vẫn được render bên dưới. Bạn không cần buộc người đọc và crawler chờ hết hoạt ảnh rồi mới tạo toàn bộ nội dung của trang.

## 3. Khai báo metadata cho đúng cấp route

Theo [Metadata API của Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), metadata tĩnh và generateMetadata được khai báo trong Server Components. Với nội dung cố định, một trang có thể khai báo như sau:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chat App — Next.js & Firebase Messaging',
    description: 'Ứng dụng nhắn tin theo phòng, có đăng nhập và quản lý thành viên.',
    alternates: {
        canonical: 'https://ndknguyen.io.vn/projects/chat-app'
    }
}
```

Đây là ví dụ metadata tĩnh, không thay thế phần lấy dữ liệu và hiển thị project. Với route động, generateMetadata cần dùng đúng dữ liệu của route; trong Next.js 16, params trong ví dụ API là Promise và được đọc bằng await.

Chú ý metadata kế thừa từ layout. Nếu trang CV hoặc mọi dự án đều nhận canonical của trang chủ, bạn đang gửi tín hiệu khác với nội dung đang hiển thị. [Google xem canonical là tín hiệu chọn URL đại diện](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls); nó không phải một lệnh bắt buộc Google phải chọn URL đó.

## 4. Đừng coi metadata streaming tự động là một lỗi

Next.js có thể stream metadata động sau phần UI. Tài liệu framework phân biệt crawler có thể xử lý DOM và các bot cần metadata chặn trước khi trả nội dung. Do đó, chỉ tìm title trong vài dòng đầu phản hồi chưa đủ để kết luận.

Hãy kiểm tra đầu ra thực tế, DOM sau render và kết quả kiểm tra URL của công cụ tìm kiếm. Với canonical, đối chiếu thêm hướng dẫn Google về vị trí trong head hợp lệ và sự nhất quán của URL. Tránh tắt streaming toàn bộ ứng dụng trước khi biết nó có liên quan đến vấn đề đang gặp hay không.

## 5. Kiểm tra robots, noindex và sitemap cùng nhau

Một trang đã xuất bản cần tránh vô tình kế thừa noindex từ môi trường thử nghiệm. Ngược lại, trang quản trị không nên dùng cùng chính sách index với nội dung công khai. Robots.txt điều khiển crawl; noindex có vai trò khác, nên cần xem bot có đọc được chỉ dẫn đó hay không.

Sitemap giúp liệt kê URL mong muốn được khám phá, nhưng cần kiểm tra từng URL thực sự có nội dung. Với trang không tồn tại, xem cách framework trả trang lỗi và tín hiệu lập chỉ mục; khi phản hồi đã streaming, mã HTTP có thể cần được đánh giá cùng nội dung và noindex.

## Danh sách kiểm tra trước khi yêu cầu index lại

- URL chính xác, không chuyển hướng nhầm và có nội dung tương ứng.
- Title, H1 và description mô tả đúng trang.
- Canonical riêng, nhất quán với liên kết nội bộ và sitemap.
- Không có noindex ngoài ý muốn trên trang công khai.
- Nội dung chính đọc được sau render, không phụ thuộc một tương tác của người dùng.
- Kiểm tra URL đang deploy trong Google Search Console, thay vì suy từ bản local.

Trong [case study blog Next.js và Firestore](https://ndknguyen.io.vn/projects/my-blog), bạn có thể xem ví dụ về liên kết giữa nội dung, route động và metadata. Nếu trang local đúng nhưng deploy sai domain hoặc cấu hình, đọc tiếp [cách kiểm tra biến môi trường Next.js](/next-public-env-nextjs-deploy-sai-cau-hinh).

Những bước này giúp loại trừ lỗi kỹ thuật quan sát được. Trạng thái crawl và canonical mà Google đã chọn cần được kiểm tra trong dữ liệu Search Console của chính website.

## Nguồn đối chiếu

- [Next.js: Metadata API và metadata streaming](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
- [Google: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- [Google: chỉ định canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Nội dung được đối chiếu ngày 15/10/2026. Quy trình kiểm tra là đề xuất thực hành của tác giả.

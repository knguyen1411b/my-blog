# NEXT_PUBLIC và .env trong Next.js: vì sao deploy vẫn sai cấu hình?

Phân biệt biến môi trường build và runtime, dữ liệu công khai với secret, rồi kiểm tra cấu hình khi đưa ứng dụng Next.js từ local lên deploy.

Ứng dụng chạy đúng ở local nhưng khi deploy lại gọi API của môi trường cũ. Bạn sửa biến môi trường, restart server và vẫn thấy request sai địa chỉ. Trước khi đổi tên biến hoặc sửa CORS, hãy xác định giá trị đó được đọc ở build time hay runtime, và được dùng ở server hay browser.

Đây là một cách kiểm tra theo đường đi của cấu hình. Ví dụ dùng Next.js App Router và tên biến minh họa, không chứa credential thật.

## Biến công khai có thể được đóng vào bundle khi build

[Tài liệu môi trường của Next.js](https://nextjs.org/docs/app/guides/environment-variables) giải thích rằng truy cập trực tiếp một biến có tiền tố NEXT_PUBLIC có thể được thay bằng giá trị tại thời điểm build trong bundle được gửi đến browser.

Ví dụ:

```ts
const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN
```

Nếu build dùng origin của staging, việc chuyển cùng artifact sang production không tự đổi giá trị đã được đưa vào JavaScript. Khi chẩn đoán, hãy kiểm tra môi trường tạo build, không chỉ môi trường đang chạy server.

Tài liệu cũng phân biệt truy cập trực tiếp theo tên với lookup động hoặc alias của process.env. Không nên đổi sang lookup động như một mẹo để biến browser tự đọc môi trường server: browser không có quyền truy cập process.env của máy đang chạy ứng dụng.

## Vẽ ranh giới server và browser trước khi đặt tên biến

Một cấu hình có thể phân thành các nhóm như sau:

```text
NEXT_PUBLIC_SITE_URL        -> domain công khai của website
NEXT_PUBLIC_API_ORIGIN      -> origin API mà browser cần biết
EMAIL_SERVICE_API_KEY       -> credential dùng ở server
DATABASE_URL                -> kết nối cơ sở dữ liệu phía server
```

Đây là ví dụ phân loại, không phải danh sách bắt buộc cho mọi dự án. Nếu browser không cần một giá trị, đừng đưa nó vào bundle chỉ để giảm một bước gọi server. Ngược lại, một URL công khai không tự trở thành secret chỉ vì được đặt trong file .env.

[Tài liệu Server và Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) mô tả cách dùng server-only để tránh nhập nhầm một module dành cho server vào phần client. Một module kiểm tra cấu hình có thể có dạng:

```ts
import 'server-only'

export function getEmailServiceKey() {
    const key = process.env.EMAIL_SERVICE_API_KEY
    if (!key) throw new Error('Missing EMAIL_SERVICE_API_KEY')
    return key
}
```

Việc đọc key trong server không cho phép bạn trả nó ra response. Cần kiểm tra cả dữ liệu rời server qua HTML, props hoặc API, chứ không chỉ kiểm tra tiền tố tên biến.

## Runtime chỉ có ý nghĩa khi giá trị thực sự được đọc lúc runtime

[Tài liệu self-hosting của Next.js](https://nextjs.org/docs/app/guides/self-hosting#environment-variables) phân biệt cấu hình runtime phía server với các giá trị công khai đã được đóng vào bundle. Một giá trị đọc trong quá trình prerender cũng cần được xem xét theo lúc trang được tạo.

Vì vậy, khi bạn muốn tái sử dụng một image hoặc artifact ở nhiều môi trường, hãy viết rõ giá trị nào được cố định khi build, giá trị nào được đọc động ở server và giá trị nào browser cần biết. Không nên coi mọi tham chiếu process.env đều có cùng vòng đời.

Nếu cần cấp cấu hình cho browser lúc chạy, dữ liệu đó vẫn phải là dữ liệu có chủ đích công khai. Cách cung cấp cấu hình cần phù hợp với rendering và cache của ứng dụng; đây là một quyết định thiết kế riêng, không phải cách đưa secret ra client.

## Firebase API key và credential đặc quyền không cùng vai trò

[Tài liệu Firebase về API key](https://firebase.google.com/docs/projects/api-keys) giải thích API key của cấu hình Firebase client được dùng để xác định project và không phải cơ chế ủy quyền truy cập dữ liệu. Điều đó không khiến mọi loại key đều được phép đưa vào browser.

Với Firestore, chính sách truy cập dữ liệu cần được kiểm tra theo SDK, thông tin xác thực và rules/IAM tương ứng. Service-account credential hay key của một dịch vụ backend có thể có vai trò hoàn toàn khác. Hãy phân loại theo tài liệu của dịch vụ thay vì dựa vào việc tên của cả hai đều có chữ key.

Bài [Firestore permission-denied và điều kiện truy vấn](/firestore-permission-denied-security-rules-query) trình bày một ví dụ cụ thể về việc query và quyền đọc cần khớp nhau.

## Quy trình kiểm tra một cấu hình deploy bị sai

1. Ghi lại request sai trong tab Network: origin nào đang được gọi, trên route nào?
2. Tìm tham chiếu cấu hình tương ứng trong code và xác định phần đó chạy ở browser hay server.
3. Với NEXT_PUBLIC, kiểm tra giá trị ở đúng môi trường và branch đã tạo build.
4. Build lại khi giá trị công khai cần thay đổi, rồi xác nhận phiên bản mới thực sự được deploy.
5. Kiểm tra request trên trang đã deploy; đừng chỉ đọc lại trang cấu hình của nền tảng hosting.

Khi log để chẩn đoán, chỉ ghi tên biến thiếu hoặc thông tin không bí mật cần thiết. Không cần in toàn bộ process.env để biết một URL công khai đang sai. Giữ .env chứa giá trị thật ngoài Git, và dùng .env.example để mô tả tên biến cùng giá trị mẫu.

Trong [File Uploader](https://ndknguyen.io.vn/projects/file-uploader), việc cấp quyền lưu trữ cần được phân biệt với thao tác phía browser. Trong [SPIT Management](https://ndknguyen.io.vn/projects/spit-management), frontend và backend có cấu hình riêng. Đó là hai bối cảnh để kiểm tra ranh giới cấu hình khi review một dự án Fullstack.

Nếu deploy đã đúng nhưng trang chưa được tìm thấy như mong đợi, chuyển sang [quy trình kiểm tra SEO cho Next.js](/seo-nextjs-16-google-khong-thay-noi-dung) để kiểm tra nội dung, canonical và chỉ dẫn index.

## Nguồn đối chiếu

- [Next.js: environment variables và build-time inlining](https://nextjs.org/docs/app/guides/environment-variables).
- [Next.js: ranh giới Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- [Next.js: environment variables khi self-host](https://nextjs.org/docs/app/guides/self-hosting#environment-variables).
- [Firebase: vai trò của API key](https://firebase.google.com/docs/projects/api-keys).

Nội dung được đối chiếu ngày 15/10/2026. Các tên biến trong ví dụ là giá trị minh họa.

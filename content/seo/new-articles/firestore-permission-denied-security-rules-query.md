# Firestore permission-denied: sửa truy vấn trước khi nới security rules

Phân biệt lỗi quyền truy cập với lỗi thiếu index trong Firestore, đồng thời thiết kế truy vấn phù hợp với dữ liệu được phép đọc.

Bạn đọc trực tiếp một tài liệu Firestore thành công nhưng khi tải danh sách lại nhận permission-denied. Một cách sửa vội là mở quyền đọc cả collection. Trước khi làm vậy, hãy kiểm tra hình dạng truy vấn và quy tắc mà nó cần đáp ứng.

Bài viết dùng ví dụ blog có bài nháp và bài đã xuất bản. Đây là một tình huống nhỏ nhưng thể hiện rõ khác biệt giữa truy vấn dữ liệu và chính sách cho phép truy cập. Các đoạn mã dưới đây minh họa phần đọc công khai, không phải bộ rules đầy đủ cho trang quản trị.

## Rules không phải bộ lọc sau truy vấn

[Firebase giải thích rằng Security Rules đánh giá tập kết quả có thể được trả về](https://firebase.google.com/docs/firestore/security/rules-query). Rules không tự bỏ các tài liệu không được phép rồi trả phần còn lại. Vì vậy, truy vấn cần phù hợp với điều kiện truy cập ngay từ đầu.

Giả sử độc giả chỉ được xem bài có status bằng published. Quy tắc đọc đơn giản có thể là:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if false;
    }
  }
}
```

Ví dụ cố ý chặn mọi ghi. Nếu ứng dụng có quản trị viên, quyền tạo và chỉnh bài cần được thiết kế riêng theo mô hình xác thực thật; không thay điều kiện này bằng việc cho phép mọi người ghi.

## Danh sách bài cần có điều kiện tương ứng

Đọc cả collection không chứng minh được rằng mọi tài liệu đều đã xuất bản, ngay cả khi dữ liệu hiện tại tình cờ chỉ chứa bài published. Truy vấn công khai nên mô tả đúng phạm vi đó:

```ts
import { collection, getDocs, query, where } from 'firebase/firestore'

const publishedQuery = query(collection(db, 'blogs'), where('status', '==', 'published'))
const snapshot = await getDocs(publishedQuery)
```

Trong đoạn trích, db là Firestore instance của ứng dụng. Khi tra cứu bằng slug, cần giữ cả điều kiện slug và điều kiện xuất bản nếu rules yêu cầu như ví dụ. Đọc một document bằng ID lại được đánh giá dựa trên tài liệu cụ thể; đó là lý do hai cách đọc có thể cho kết quả khác nhau.

Với dữ liệu chỉ chủ sở hữu được đọc, hãy bắt đầu từ quan hệ giữa request.auth.uid và trường sở hữu. Sau đó kiểm tra query có giới hạn đúng người dùng hay không. Một bộ lọc chạy sau khi dữ liệu đã tải về trình duyệt không thay thế cho chính sách truy cập.

## Permission-denied và missing index là hai vấn đề riêng

Một truy vấn kết hợp điều kiện và sắp xếp có thể cần index. [Tài liệu quản lý index của Firestore](https://firebase.google.com/docs/firestore/query-data/indexing) mô tả lỗi thiếu index và hướng dẫn tạo index tương ứng.

Tạo index không sửa được một truy vấn bị từ chối vì rules. Tương tự, nới rules không giải quyết đúng nguyên nhân thiếu index. Khi chẩn đoán, hãy giữ lại mã lỗi và query cụ thể thay vì thay nhiều cấu hình cùng lúc.

Một trình tự hữu ích là tái hiện truy vấn tối thiểu, xác nhận trạng thái đăng nhập, đối chiếu điều kiện rules, rồi xử lý yêu cầu index nếu lỗi thực tế chỉ ra điều đó. Mỗi lần chỉ sửa một giả thuyết để biết thay đổi nào tạo ra kết quả.

## Đọc trên server không có nghĩa mọi SDK dùng cùng một cơ chế quyền

Cần phân biệt Firebase Web SDK được chạy trong môi trường server với các server client library hoặc Admin SDK dùng thông tin xác thực máy chủ. Firebase nêu rõ server client libraries bỏ qua Security Rules và dùng cơ chế thông tin xác thực/IAM.

Vì vậy, khi backend đọc bằng đặc quyền máy chủ, ứng dụng cần tự kiểm tra danh tính và quyền của người gọi. Chuyển một truy vấn từ browser sang backend không tự tạo ra chính sách bảo vệ người dùng. Hãy xem SDK và thông tin xác thực thực sự được sử dụng trước khi kết luận rules đang có hiệu lực ở đâu.

## Kiểm tra quyền bằng nhiều tình huống

Với ví dụ blog, tối thiểu hãy thử:

1. Chưa đăng nhập, đọc một bài published theo ID và bằng danh sách.
2. Chưa đăng nhập, thử đọc bài draft theo ID và truy vấn.
3. Đăng nhập bằng một tài khoản không có quyền quản trị.
4. Kiểm tra chức năng quản trị bằng đúng quyền dự kiến.

Đừng chỉ thử tài khoản của chủ dự án rồi kết luận mọi quyền đã đúng. Tài khoản đó có thể có phạm vi quyền lớn hơn người đọc bình thường. Bạn có thể bắt đầu kiểm tra trong môi trường phát triển hoặc emulator, giữ các trường hợp được phép và bị từ chối thành kiểm thử rõ ràng.

## Xem xét chi phí sau khi query đã đúng

[Tài liệu giá Firestore](https://firebase.google.com/docs/firestore/pricing) là nguồn đối chiếu cho các loại thao tác và phần đọc index có thể phát sinh. Các phép đọc phụ thuộc trong rules cũng cần được xem xét. Không nên giả định mọi request bị từ chối đều miễn phí hoặc mọi query đều có cùng cách tính.

Thay vì chèn một bảng giá cố định vào thiết kế, hãy ghi lại query, số lần gọi, nơi sử dụng listener và vòng đời dữ liệu. Đây là thông tin cần có để đánh giá mức sử dụng của chính ứng dụng.

[Blog dùng Next.js và Firestore](https://ndknguyen.io.vn/projects/my-blog) là ví dụ luồng công khai và luồng quản trị. [Chat App theo phòng](https://ndknguyen.io.vn/projects/chat-app) đặt ra một câu hỏi khác: người đọc có thuộc phòng hay không. Khi hai ứng dụng cùng dùng Firebase, hãy thiết kế quyền theo mô hình dữ liệu của từng ứng dụng.

Nếu bạn đang chuẩn bị đưa cấu hình lên môi trường mới, đọc thêm [NEXT_PUBLIC và biến môi trường khi deploy](/next-public-env-nextjs-deploy-sai-cau-hinh).

## Nguồn đối chiếu

- [Firebase: truy vấn an toàn và giới hạn của Security Rules](https://firebase.google.com/docs/firestore/security/rules-query).
- [Firebase: quản lý index](https://firebase.google.com/docs/firestore/query-data/indexing).
- [Firebase: thành phần chi phí Firestore](https://firebase.google.com/docs/firestore/pricing).

Nội dung được đối chiếu ngày 15/10/2026. Ví dụ rules chỉ phục vụ tình huống được mô tả.

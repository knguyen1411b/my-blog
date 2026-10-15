# Upload file trong Next.js: từ bộ nhớ tạm đến lưu trữ bền vững

Thiết kế luồng upload có object storage, quyền truy cập và trạng thái hoàn tất; hiểu vì sao lịch sử localStorage không bảo đảm file còn tồn tại.

Một bản demo upload thường bắt đầu rất nhanh: nhận file trong route handler, giữ bytes trong bộ nhớ rồi trả một URL. Người dùng tải lại trang vẫn thấy lịch sử, nên có cảm giác file đã được lưu. Nhưng sau khi server khởi động lại, URL có thể không còn dữ liệu để trả.

Vấn đề nằm ở việc ba loại trạng thái đang bị gộp vào nhau: nội dung file, metadata mô tả file và danh sách hiển thị phía trình duyệt. Bài này đề xuất cách phân tách chúng khi chuyển một ứng dụng Next.js từ prototype sang một luồng có lưu trữ bền vững.

## 1. Xác định file thực sự đang nằm ở đâu

Map trong bộ nhớ giữ dữ liệu của một tiến trình. Browser localStorage chỉ giúp trình duyệt nhớ thông tin đã lưu ở phía client. Khi ứng dụng có nhiều instance, việc một instance đã nhận file không chứng minh instance khác có thể trả cùng nội dung.

Thư mục tạm cũng có vòng đời riêng. [AWS mô tả /tmp của Lambda là bộ nhớ lưu trữ tạm theo execution environment](https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html). Điều này không có nghĩa file nhất thiết biến mất ngay sau mỗi invocation; điều cần tránh là coi nó như nguồn lưu trữ bền vững duy nhất.

Trong [File Uploader của tôi](https://ndknguyen.io.vn/projects/file-uploader), mã nguồn hiện dùng Map cho upload store. Đây là một ví dụ cụ thể để nhận diện giới hạn của prototype trước khi chọn giải pháp tiếp theo.

## 2. Tách object storage và metadata

Một mô hình triển khai có thể lưu file trong object storage và lưu metadata trong cơ sở dữ liệu ứng dụng. Metadata thường cần một định danh, người sở hữu, object key, tên hiển thị, kích thước và trạng thái xử lý. Trường nào thực sự cần phụ thuộc vào sản phẩm, không nên thêm mọi trường chỉ vì một mẫu kiến trúc có sẵn.

Ví dụ về các trách nhiệm:

- Object storage giữ bytes và cung cấp cơ chế truy cập đối tượng.
- Cơ sở dữ liệu lưu quan hệ giữa người dùng và file.
- Giao diện hiển thị tiến độ, trạng thái và các thao tác phù hợp.

URL xuất hiện trong lịch sử không nên là bằng chứng duy nhất rằng file đã hoàn tất upload. Ứng dụng cần biết phần nào đã thành công và cách xử lý khi người dùng đóng tab giữa chừng.

## 3. Cấp quyền trước khi gửi dữ liệu

Với một luồng dùng presigned URL, server trước hết kiểm tra người gọi có được phép tải file lên phạm vi tương ứng không. Sau đó server mới cấp URL cho một thao tác và object key cụ thể. Client dùng URL đó để gửi bytes tới storage.

[Tài liệu S3 về presigned upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html) mô tả cơ chế này. Nó giúp người upload thực hiện thao tác được cấp mà không cần nhận thông tin xác thực của tài khoản lưu trữ.

Một luồng để thảo luận khi thiết kế có thể là:

```text
Chọn file
  -> Gửi yêu cầu cấp quyền upload
  -> Server kiểm tra quyền và tạo object key
  -> Client upload đến object storage
  -> Ứng dụng xác nhận kết quả và ghi trạng thái
  -> Hiển thị thao tác xem hoặc chia sẻ
```

Đây là sơ đồ trách nhiệm, không phải mã tích hợp sẵn cho một nhà cung cấp. Chữ ký, header, CORS và cơ chế xác nhận cần theo SDK và cấu hình thực tế.

## 4. Presigned URL là quyền truy cập cần được quản lý

[S3 mô tả presigned URL như một bearer token có thời hạn](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html). Người giữ URL có thể dùng khả năng đã được cấp trong thời gian có hiệu lực. URL có thể được dùng lại cho đến khi hết hạn; thời hạn của thông tin xác thực tạm thời có thể làm URL hết hiệu lực sớm hơn dự kiến.

Upload đến key đã tồn tại có thể thay thế object đó. Từ các đặc tính này, hai khuyến nghị thiết kế hợp lý là cấp thời hạn phù hợp với thao tác và tránh cho người dùng tự chọn key có thể ghi đè tài nguyên của người khác. Quyền cấp URL vẫn phải được kiểm tra ở server.

Không đưa storage secret vào browser để giải quyết lỗi CORS hoặc lỗi ký request. Đọc thêm [ranh giới biến môi trường server và NEXT_PUBLIC](/next-public-env-nextjs-deploy-sai-cau-hinh) nếu luồng upload cần credential.

## 5. Thiết kế trạng thái thất bại ngay trong luồng upload

Hãy thử các tình huống: client nhận URL nhưng không gửi file, upload thành công nhưng bước ghi metadata thất bại, upload bị ngắt, hoặc người dùng bấm lại cùng một thao tác. Các tình huống này cho thấy cần phân biệt đang chờ, đã nhận file và đã sẵn sàng sử dụng.

Nếu sản phẩm cho phép retry, hãy quyết định thao tác nào có thể lặp lại mà không tạo bản ghi hoặc object ngoài ý muốn. Nếu dùng URL chia sẻ, cần xác định người nhận được đọc gì và quyền đó kéo dài bao lâu. Một URL storage không tự mô tả toàn bộ chính sách truy cập của ứng dụng.

Đối với file lớn hoặc mạng không ổn định, có thể đánh giá multipart upload theo tài liệu nhà cung cấp. Không chọn một ngưỡng dung lượng chung cho mọi hệ thống: giới hạn request và khả năng upload cần được kiểm tra theo môi trường deploy.

## Kiểm tra trước khi gọi là lưu trữ bền vững

1. Restart ứng dụng rồi thử mở file đã upload.
2. Kiểm tra request qua các instance khác nhau nếu hệ thống có nhiều instance.
3. Xác nhận người dùng khác không đọc hoặc ghi đè file ngoài phạm vi được cấp.
4. Kiểm tra URL hết hạn, upload bị ngắt và bước ghi metadata thất bại.
5. Kiểm tra xóa file có xử lý cả object lẫn bản ghi tương ứng theo chính sách sản phẩm.

[Mini PhotoBooth](https://ndknguyen.io.vn/projects/miniphotobooth) tạo file từ browser, còn [Next Document Hub](https://ndknguyen.io.vn/projects/next-document) tập trung vào khám phá tài liệu. Ba ví dụ cho thấy mỗi giai đoạn của vòng đời file cần một trách nhiệm rõ ràng.

## Nguồn đối chiếu

- [AWS Lambda: ephemeral storage](https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html).
- [Amazon S3: upload bằng presigned URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html).
- [Amazon S3: quyền và thời hạn của presigned URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html).

Nội dung được đối chiếu ngày 15/10/2026. Mô hình trạng thái và danh sách kiểm tra là đề xuất kiến trúc của tác giả.

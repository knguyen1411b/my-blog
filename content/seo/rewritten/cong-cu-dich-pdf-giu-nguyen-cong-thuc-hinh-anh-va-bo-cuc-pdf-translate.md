# Dịch PDF giữ bố cục: cách dùng và đánh giá PDFMathTranslate

Tìm hiểu PDFMathTranslate và quy trình dịch thử, đối chiếu công thức, bảng biểu, hình ảnh trước khi dịch toàn bộ tài liệu kỹ thuật.

Dịch một bài báo khoa học không chỉ là thay ngôn ngữ của từng đoạn văn. Người đọc còn cần đối chiếu công thức, hình minh họa, chú thích và vị trí của chúng trên trang. Khi các phần này bị xô lệch, một bản dịch có câu chữ trôi chảy vẫn có thể khó sử dụng.

Bài viết giới thiệu **PDFMathTranslate**, dự án mã nguồn mở do cộng đồng PDFMathTranslate duy trì, đồng thời đề xuất một quy trình kiểm tra tài liệu sau dịch. Trọng tâm là chọn đúng công cụ và biết cách đánh giá kết quả, đặc biệt khi bạn đọc tài liệu lập trình hoặc nghiên cứu có nhiều ký hiệu.

## Vì sao dịch PDF dễ làm thay đổi bố cục?

PDF mô tả cách một trang được trình bày. Thứ tự nhìn thấy bằng mắt không phải lúc nào cũng tương ứng với thứ tự văn bản được trích xuất. Một trang hai cột có thể xen chú thích hình; chỉ số dưới trong công thức có thể nằm ở một vị trí riêng; văn bản dịch thường dài hoặc ngắn hơn bản gốc.

Vì vậy, bạn nên tách hai câu hỏi khi đánh giá công cụ: bản dịch có truyền đạt đúng nội dung không, và trang sau dịch có còn đọc, đối chiếu được không? Một công cụ tốt ở câu hỏi thứ nhất chưa chắc giải quyết được câu hỏi thứ hai.

## PDFMathTranslate hỗ trợ những gì?

[Repository chính thức của PDFMathTranslate](https://github.com/PDFMathTranslate/PDFMathTranslate) mô tả công cụ dịch PDF khoa học hướng đến việc giữ công thức, biểu đồ, mục lục và chú thích. Dự án có các cách sử dụng như dòng lệnh, giao diện và Docker, cùng tùy chọn dịch vụ dịch.

Các tính năng và cách cài đặt có thể thay đổi theo phiên bản. Hãy đọc README và hướng dẫn của phiên bản bạn sử dụng thay vì ghép lệnh từ nhiều bài hướng dẫn khác thời điểm. Nếu cần tìm lại nguồn dự án, dùng repository chính thức thay cho một trang GitHub cá nhân không chứa mã nguồn công cụ.

## Quy trình đánh giá một tài liệu trước khi dịch toàn bộ

### 1. Chọn một vài trang đại diện

Đừng bắt đầu bằng tài liệu dài hàng trăm trang. Hãy chọn một trang có văn bản thông thường, một trang nhiều công thức và một trang có bảng hoặc hình. Nếu tài liệu dùng hai cột, nên có ít nhất một trang thể hiện cấu trúc đó.

Với PDF scan, trước tiên kiểm tra khả năng chọn hoặc tìm kiếm văn bản. Nếu nội dung chỉ là ảnh, bạn cần xem công cụ có hỗ trợ nhận dạng ký tự phù hợp hay phải thêm bước OCR. Đây là điều kiện đầu vào cần xác định, không nên coi mọi file có phần mở rộng PDF là cùng một loại tài liệu.

### 2. Giữ bản gốc để đối chiếu

Lưu bản gốc và bản kết quả thành các file riêng. Khi công cụ cung cấp đầu ra song ngữ, hãy dùng cách trình bày đó để đối chiếu câu, tiêu đề và ký hiệu. Không ghi đè tài liệu gốc chỉ vì một vài trang đầu trông ổn.

Nếu tài liệu có nội dung không công khai, cần hiểu dịch vụ nào sẽ nhận phần văn bản được gửi đi. Việc lựa chọn một dịch vụ dịch là một quyết định về luồng dữ liệu, bên cạnh chất lượng câu chữ.

### 3. Kiểm tra các điểm dễ sai

Sau khi dịch mẫu, dùng cùng một danh sách kiểm tra để đánh giá:

- Tiêu đề và các đoạn văn còn theo đúng thứ tự đọc hay không?
- Công thức có giữ dấu, chỉ số và ký hiệu đặc biệt không?
- Chú thích còn gắn với đúng hình hoặc bảng không?
- Các cột trong bảng còn thể hiện đúng quan hệ giữa dữ liệu không?
- Tên hàm, tên thư viện và thuật ngữ kỹ thuật có bị dịch gây hiểu nhầm không?

Ví dụ, với biểu thức dưới đây, điều cần kiểm tra là ký hiệu và giới hạn tích phân, không chỉ việc công thức còn xuất hiện trên trang:

```latex
\int_{-\infty}^{\infty} e^{-x^2} , dx = \sqrt{\pi}
```

Đây là một mẫu dùng để đối chiếu cách hiển thị, không phải bằng chứng một công cụ sẽ giữ chính xác mọi công thức trong mọi tài liệu.

### 4. Quyết định dựa trên kết quả mẫu

Nếu câu chữ đủ rõ nhưng bảng hoặc công thức bị sai, bạn có thể dùng bản dịch như tài liệu đọc hỗ trợ và vẫn tra cứu bản gốc. Nếu ngay cả thứ tự đoạn văn cũng bị đảo, nên xem lại đầu vào hoặc thử quy trình khác trước khi xử lý toàn bộ.

Không có một mức chất lượng duy nhất cho mọi nhu cầu. Đọc để nắm ý chính khác với dùng tài liệu làm căn cứ triển khai một thuật toán. Với tài liệu chuyên môn, tên biến, đơn vị và điều kiện áp dụng vẫn cần được kiểm tra trực tiếp.

## Liên hệ với thiết kế ứng dụng xử lý tài liệu

Từ góc nhìn Fullstack, một công cụ tài liệu thường đi qua nhiều bước: chọn file, tải lên hoặc mở file, xử lý, theo dõi trạng thái và nhận kết quả. Mỗi bước cần phản hồi rõ để người dùng biết công việc đang ở đâu và có thể làm gì tiếp theo.

Trong portfolio của tôi, [File Uploader với Next.js và chia sẻ QR](https://ndknguyen.io.vn/projects/file-uploader) minh họa bước nhận file và tạo thao tác chia sẻ. [Next Document Hub](https://ndknguyen.io.vn/projects/next-document) tập trung vào tìm kiếm và xem tài liệu. Đây là các dự án liên quan đến luồng làm việc với file, không phải phần triển khai của PDFMathTranslate.

Nếu bạn dùng AI để hỗ trợ xây dựng các luồng này, bài [AI pair programming với quy trình kiểm chứng](/ky-nguyen-ai-pair-programming-tro-ly-antigravity-co-the-lam-duoc-gi-cho-du-an-cua-ban) trình bày cách chia nhỏ công việc và kiểm tra thay đổi trước khi tích hợp.

## Câu hỏi thường gặp

### Công cụ có giữ nguyên mọi công thức và bố cục không?

Nên xem việc giữ bố cục là mục tiêu cần kiểm tra trên tài liệu cụ thể. Trang nhiều cột, bảng phức tạp, font lạ và bản scan có thể cần cách xử lý khác. Dịch mẫu và đối chiếu giúp bạn đánh giá đúng giới hạn trước khi áp dụng rộng hơn.

### Có nên dùng bản dịch thay hoàn toàn bản gốc?

Với tài liệu lập trình hoặc nghiên cứu, nên giữ khả năng đối chiếu bản gốc. Bản dịch giúp tiếp cận nội dung, nhưng công thức, đoạn mã và thuật ngữ quan trọng cần được đọc trong ngữ cảnh chính xác.

### Có thể xem thêm công việc của tác giả ở đâu?

Bạn có thể xem [các dự án Fullstack của Nguyễn Đình Khánh Nguyên](https://ndknguyen.io.vn/#PortfolioSection) và [CV của Khanh Nguyen](https://ndknguyen.io.vn/cv) để tìm hiểu thêm về kinh nghiệm và các công nghệ tôi sử dụng.

## Nguồn tham khảo

- [PDFMathTranslate: mã nguồn, tính năng và hướng dẫn sử dụng](https://github.com/PDFMathTranslate/PDFMathTranslate).
- [Nghiên cứu về dịch tài liệu khoa học và bảo toàn bố cục](https://arxiv.org/abs/2507.03009).

Phần quy trình kiểm tra trong bài là hướng dẫn đánh giá của tác giả. Khi dùng một phiên bản cụ thể, tài liệu của chính dự án là nguồn đối chiếu cho lệnh cài đặt và tính năng.

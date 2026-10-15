# AI pair programming với Antigravity: quy trình cho dự án Fullstack

Cách chia nhỏ công việc với Antigravity, review thay đổi Next.js và Firestore, kiểm tra hydration và xác nhận kết quả trước khi tích hợp.

AI pair programming có ích khi giúp bạn hiểu vấn đề, thực hiện một thay đổi có giới hạn và kiểm tra được kết quả. Với một ứng dụng Fullstack, câu hỏi quan trọng không phải chỉ là AI viết được bao nhiêu dòng mã, mà là thay đổi đó có đúng yêu cầu, đúng luồng dữ liệu và có thể được người khác review hay không.

Bài viết giới thiệu Google Antigravity ở mức tổng quan, sau đó đề xuất một quy trình làm việc có thể áp dụng khi phát triển giao diện, API và nội dung với Next.js, React, TypeScript và Firebase. Các ví dụ là tình huống kỹ thuật để bạn tự kiểm chứng, không phải cam kết về độ chính xác hay thời gian tiết kiệm của công cụ.

## Google Antigravity là gì?

Theo [tài liệu chính thức về Antigravity IDE](https://www.antigravity.google/docs/ide/overview/), đây là môi trường phát triển tích hợp agent vào workspace, với khả năng làm việc qua editor, terminal và trình duyệt. Công cụ dùng các tác vụ và artifact để trình bày kế hoạch hoặc kết quả.

[Tài liệu về agent của Antigravity](https://www.antigravity.google/docs/agent/) mô tả một hệ thống suy luận nhiều bước, sử dụng công cụ và trao đổi qua các sản phẩm công việc. Điều đó mở rộng phạm vi hỗ trợ so với việc chỉ hoàn thành một dòng mã. Tuy nhiên, quyền truy cập và hành động thực tế vẫn phụ thuộc vào thiết lập và môi trường sử dụng.

## Bắt đầu bằng yêu cầu có thể kiểm chứng

Một yêu cầu như “tối ưu toàn bộ ứng dụng” rất khó đánh giá. Thay vào đó, hãy nêu đầu vào, hành vi mong muốn và cách xác nhận. Ví dụ: “Trang chi tiết dự án phải có tiêu đề theo tên dự án, canonical đúng URL và nội dung xuất hiện trong HTML trả về”.

Với yêu cầu đó, người review có thể kiểm tra ba đầu ra cụ thể thay vì chỉ nhìn bản diff. Nguyên tắc tương tự áp dụng cho chức năng nghiệp vụ: thao tác nào kích hoạt luồng, dữ liệu nào được đọc hoặc ghi, và người dùng nhìn thấy kết quả gì?

Trước khi cho agent sửa mã, cung cấp các ràng buộc thật của repo: phiên bản framework, cấu trúc thư mục, lệnh lint/build và những phần cần giữ nguyên. Không nên để công cụ đoán quy ước của một phiên bản Next.js khác với dự án đang chạy.

## Chia công việc theo luồng, không chỉ theo file

Một tính năng có thể đi từ trang giao diện đến lớp truy vấn và cơ sở dữ liệu. Chia việc theo luồng giúp bạn hiểu một thay đổi ảnh hưởng đến đâu:

1. Xác định trang hoặc hành động bắt đầu.
2. Tìm component và lớp dữ liệu liên quan.
3. Đọc kiểu dữ liệu và điều kiện truy cập.
4. Thực hiện thay đổi nhỏ nhất đáp ứng yêu cầu.
5. Kiểm tra phản hồi và cách giao diện hiển thị kết quả.

Trong [dự án blog Next.js và Firestore](https://ndknguyen.io.vn/projects/my-blog), luồng công khai là đọc bài đã xuất bản rồi render nội dung Markdown. Trong [SPIT Management với Spring Boot và Next.js](https://ndknguyen.io.vn/projects/spit-management), một thay đổi về thành viên có thể liên quan đến form, API, quyền truy cập và dữ liệu theo học kỳ. Cùng là Fullstack, nhưng ranh giới cần kiểm tra khác nhau.

## Ví dụ: sửa lỗi hydration trong React và Next.js

Hydration mismatch xuất hiện khi HTML ban đầu và lần render đầu tiên phía trình duyệt không khớp. [Hướng dẫn chính thức của Next.js về lỗi hydration](https://nextjs.org/docs/messages/react-hydration-error) liệt kê các nguyên nhân như cấu trúc HTML không hợp lệ, dùng API chỉ có ở trình duyệt hoặc giá trị thời gian khác nhau khi render.

Với một Markdown renderer, hãy bắt đầu từ HTML thực tế: một phần tử khối có đang nằm trong đoạn văn không, nội dung thay đổi giữa server và client ở đâu? Đừng dùng việc tắt cảnh báo làm bằng chứng rằng lỗi đã được sửa.

Bạn có thể yêu cầu AI mô tả nguyên nhân trước khi chỉnh, chỉ ra component liên quan và nêu cách tái hiện. Sau khi sửa, mở lại đúng route, kiểm tra console và thử điều hướng. Bản build thành công xác nhận một phần chất lượng; nó không thay thế việc quan sát hành vi trên trình duyệt.

## Ví dụ: thay đổi luồng dữ liệu với Firestore

Khi thêm hoặc chỉnh một tính năng Firestore, cần kiểm tra ít nhất ba yếu tố: kiểu tài liệu, truy vấn mà ứng dụng gửi và security rules quyết định quyền truy cập. Đừng giả định rằng một bộ lọc trên giao diện sẽ bảo vệ được dữ liệu.

[Tài liệu Firebase về điều kiện trong security rules](https://firebase.google.com/docs/firestore/security/rules-conditions) là nguồn đối chiếu cho kiểm soát truy cập. Với blog có trạng thái nháp và đã xuất bản, truy vấn công khai và rules cần phù hợp với chính sách đọc bài. Với chat, quyền đọc còn có thể phụ thuộc vào phòng và thành viên.

Bạn có thể đối chiếu hai bối cảnh trong [Chat App dùng Next.js và Firebase](https://ndknguyen.io.vn/projects/chat-app) và [case study nền tảng blog](https://ndknguyen.io.vn/projects/my-blog). Liên kết giữa các dự án có ích khi làm rõ khác biệt về thiết kế, thay vì chỉ lặp lại cùng một danh sách công nghệ.

## Review kết quả trước khi tích hợp

Trước khi chấp nhận một thay đổi do AI hỗ trợ, hãy đọc bản diff theo yêu cầu ban đầu. Mỗi file được sửa nên có lý do rõ ràng. Một bản sửa metadata không cần kéo theo việc đổi toàn bộ thư viện giao diện; một bản sửa form không cần tiện thể viết lại mọi module.

Với hai dự án Next.js trong portfolio này, các lệnh sau là một phần của quy trình kiểm tra:

```bash
pnpm lint
pnpm build
```

Sau đó, kiểm tra đúng luồng vừa thay đổi: tải trực tiếp route, điều hướng, kiểm tra dữ liệu và đọc lỗi console nếu có. Với nội dung SEO, còn cần đối chiếu title, canonical, heading, liên kết và schema trong HTML. Việc chạy lệnh và kết quả phải được báo rõ, không suy từ việc công cụ đã tạo mã.

## Quyền thực thi cũng là một phần của quy trình

[Tài liệu thiết lập agent của Antigravity](https://antigravity.google/docs/agent-settings) mô tả các chế độ cấp quyền, khả năng truy cập file và thực thi terminal. Khi làm việc với dự án thật, chọn phạm vi quyền phù hợp và đọc lại hành động trước khi chạm đến dữ liệu hoặc môi trường đang hoạt động.

Các thiết lập có thể khác nhau giữa hệ điều hành và phiên bản. Vì vậy, hãy kiểm tra tài liệu hiện hành thay vì coi một ảnh chụp giao diện cũ là hướng dẫn cố định. Agent có công cụ mạnh hơn cũng khiến việc đặt ranh giới và review kết quả trở nên cần thiết hơn.

## Dùng portfolio để trình bày cách bạn suy nghĩ

Trong một cuộc trao đổi tuyển dụng, phần có giá trị là giải thích được bài toán, quyết định kỹ thuật và bằng chứng kiểm tra. Bạn có thể bắt đầu từ [SPIT Management](https://ndknguyen.io.vn/projects/spit-management) để thảo luận ranh giới UI–API–database, hoặc [File Uploader](https://ndknguyen.io.vn/projects/file-uploader) để phân biệt lịch sử phía trình duyệt với lưu trữ file phía server.

Nếu cần tìm hiểu thêm về công việc của tôi, xem [portfolio Fullstack của Nguyễn Đình Khánh Nguyên](https://ndknguyen.io.vn/) và [CV của Khanh Nguyen](https://ndknguyen.io.vn/cv). Bài [dịch PDF giữ bố cục](/cong-cu-dich-pdf-giu-nguyen-cong-thuc-hinh-anh-va-bo-cuc-pdf-translate) là một ví dụ khác về cách đánh giá công cụ qua đầu vào, đầu ra và giới hạn sử dụng.

## Câu hỏi thường gặp

### AI có thay thế việc review code không?

Không nên bỏ bước review. Người phát triển vẫn cần hiểu thay đổi, xác nhận yêu cầu và kiểm tra tác động lên dữ liệu cũng như người dùng. Một phần trả lời tự tin không phải là bằng chứng mã chạy đúng.

### Có nên cho AI sửa nhiều phần cùng lúc?

Một thay đổi lớn chỉ dễ đánh giá khi có ranh giới và tiêu chí rõ. Với công việc thường ngày, chia nhỏ theo hành vi cần xác nhận giúp bạn phát hiện lỗi và quyết định giữ hay bỏ thay đổi dễ hơn.

### Nên bắt đầu từ công việc nào?

Chọn một việc có đầu ra quan sát được: giải thích một luồng dữ liệu, bổ sung metadata cho một route hoặc tái hiện một lỗi. Khi đã đánh giá được chất lượng kết quả, bạn có thể mở rộng phạm vi phù hợp.

## Nguồn tham khảo

- [Antigravity IDE: tổng quan workspace và công cụ](https://www.antigravity.google/docs/ide/overview/).
- [Antigravity agent: thành phần và cách làm việc](https://www.antigravity.google/docs/agent/).
- [Antigravity agent settings](https://antigravity.google/docs/agent-settings).
- [Next.js: nguyên nhân và cách xử lý hydration mismatch](https://nextjs.org/docs/messages/react-hydration-error).
- [Firebase: điều kiện trong Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions).

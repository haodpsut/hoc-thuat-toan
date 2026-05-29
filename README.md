# Học thuật toán bằng hình ảnh

Một dự án **tiếng Việt, mở và miễn phí** giúp học tư duy lập trình và thuật toán bằng tương tác trực
quan: nhìn thuật toán chạy từng bước, chạy code Python ngay trong trình duyệt, và tự luyện tập với
bài tập có chấm tự động.

Phát triển bởi **Trung tâm CAIRA** (Trung tâm Đổi mới sáng tạo và Nghiên cứu Phát triển Công nghệ
tiên tiến), Đại học Kiến trúc Đà Nẵng. Tìm hiểu thêm: [coregenaihub.com](https://www.coregenaihub.com/).

## Mỗi bài học gồm năm phần

1. **Ý tưởng** trình bày ngắn gọn.
2. **Trực quan hoá** sinh theo dữ liệu bạn nhập, tua được từng bước.
3. **Code Playback**: chạy Python thật (qua Pyodide) và xem từng dòng, từng biến thay đổi.
4. **Phân tích độ phức tạp** kèm số liệu đo thực tế.
5. **Luyện tập** với bộ chấm tự động chạy ngay trên trang.

## Nội dung hiện có

- Sắp xếp: sắp xếp chèn, sắp xếp nổi bọt.
- Đồ thị: BFS, DFS.
- Cây: cây tìm kiếm nhị phân, duyệt cây nhị phân.
- Mảng: kiểm tra số nguyên tố.

## Công nghệ

[Docusaurus](https://docusaurus.io/) (React + TypeScript) cho nội dung, [Pyodide](https://pyodide.org/)
(CPython trên WebAssembly) để chạy và chấm code Python trong trình duyệt, [CodeMirror](https://codemirror.net/)
cho trình soạn thảo. Toàn bộ là trang tĩnh, không cần máy chủ.

## Chạy thử trên máy

```bash
npm install
npm run start      # mở http://localhost:3000
npm run build      # tạo bản tĩnh trong thư mục build/ (cần cho tìm kiếm)
npm run serve      # phục vụ bản build, có ô tìm kiếm
```

## Thêm một thuật toán mới

Kiến trúc theo kiểu dữ liệu là nội dung (content-as-data): thêm một file trong `src/algorithms/`
theo mẫu, đăng ký trong `src/algorithms/index.ts`, rồi viết một bài MDX trong `docs/`. Engine và
các widget không phải sửa.

## Giấy phép

Mã nguồn và nội dung mở, miễn phí cho cộng đồng. Mọi góp ý và đóng góp đều được hoan nghênh.

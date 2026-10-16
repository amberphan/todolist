# Ứng Dụng To-Do List Hiện Đại (Modern UI)

Ứng dụng quản lý công việc cá nhân được thiết kế với giao diện chuẩn UI/UX, áp dụng phong cách thiết kế hiện đại (Glassmorphism, gradients, micro-interactions, responsive) sử dụng HTML5, CSS3 và Vanilla JavaScript.

---

## 🌟 Bố cục & Các tính năng chính (Layout & Features)

1. **Sidebar (Thanh bên quản trị & Tìm kiếm)**:
   - **Ô Input "Tìm kiếm bài viết"**: Cho phép gõ tìm kiếm bài viết / công việc trong thời gian thực (**Real-time Search**). Gõ đến đâu, danh sách lập tức lọc đến đó và tự động làm nổi bật (highlight) từ khóa trùng khớp.
   - **Bộ lọc mức độ ưu tiên ở Sidebar**: Lọc nhanh các bài viết theo mức độ *Quan trọng*, *Bình thường*, *Thấp*.
   - **Nút xóa nhanh từ khóa (X)**: Dọn sạch ô tìm kiếm chỉ với một click.

2. **Header (Đầu trang)**:
   - **Lời chào cá nhân hóa**: Hiển thị câu chào thân thiện: *"Chào Phúc, hôm nay bạn thế nào? 👋"*, kèm lời chúc thay đổi linh hoạt theo buổi trong ngày (Sáng / Chiều / Tối). Người dùng có thể nhấp vào tên để tùy chỉnh tên của mình.
   - **Nút chuyển đổi Chế độ Tối (Dark Mode Switch)**: Chuyển đổi toàn bộ giao diện giữa Light Mode và Dark Mode mượt mà. Trạng thái được lưu trong `localStorage`, không bị mất khi F5.
   - **Đồng hồ thời gian thực (Real-time Clock)**: Hiển thị liên tục **Giờ : Phút : Giây** (`HH:MM:SS`) kèm định dạng AM/PM và ngày tháng năm tiếng Việt.

3. **Input Section (Khu vực nhập liệu)**:
   - Ô nhập công việc (`task-input`) với hiệu ứng focus mềm mại và biểu tượng trực quan.
   - Thẻ `<select>` **Phân loại mức độ ưu tiên** (Priority Tag): *Quan trọng*, *Bình thường*, *Thấp*.
   - Ô nhập **Thời gian hết hạn (`datetime-local`)**: Cho phép đặt ngày và giờ hết hạn chính xác cho từng công việc.
   - Nút **"Thêm"** (`btn-add`) với gradient bắt mắt, đổ bóng phát sáng và phản hồi khi click.
   - Hỗ trợ thêm công việc bằng cả chuột và phím `Enter`.

4. **Cảnh báo hết hạn (Overdue & Deadline Alerts)**:
   - **Banner cảnh báo đỏ nhấp nháy**: Xuất hiện tự động khi có công việc quá hạn thực hiện, kèm số lượng việc quá hạn và nút *"Xem chi tiết"*.
   - **Mục lọc quá hạn ở Sidebar**: Hiển thị số lượng việc quá hạn theo thời gian thực và cho phép lọc riêng danh sách việc quá hạn.
   - **Huy hiệu hạn chót động (Deadline Badges)**:
     - 🔴 **Quá hạn**: Đỏ cảnh báo nhấp nháy, tính rõ quá hạn bao nhiêu phút/giờ/ngày.
     - 🟡 **Sắp hết hạn**: Vàng cam cảnh báo khi hạn chót còn dưới 24 giờ.
     - ⚪ **Còn hạn**: Xám/xanh hiển thị rõ ngày giờ hết hạn.
     - 🟢 **Đã hoàn thành**: Xanh lá xác nhận đã làm xong.

5. **Task List (Danh sách công việc)**:
   - **Màu sắc theo mức độ ưu tiên**:
     - **Quan trọng**: Viền đỏ nổi bật (`#ef4444`) kèm badge đỏ cảnh báo.
     - **Thấp**: Viền xanh lá tươi sáng (`#10b981`) kèm badge xanh lá.
     - **Bình thường**: Viền trung tính xám/slate.
   - Danh sách công việc trực quan với hiệu ứng trượt xuất hiện (`slideDown`).
   - Hộp kiểm (`checkbox`) tùy biến đẹp mắt: khi đánh dấu hoàn thành sẽ có hiệu ứng gạch ngang (`strikethrough`) và làm mờ nhẹ.
   - Hiển thị thời gian tạo và hạn chót của từng công việc.
   - Nút **Xóa** (`trash icon`) với phản hồi màu đỏ nổi bật khi di chuột và hiệu ứng fade out khi xóa.
   - Bộ lọc tiện lợi: *Tất cả*, *Đang làm*, *Đã xong*.
   - Màn hình trạng thái trống (`Empty State`) khi chưa có công việc.

4. **Footer (Chân trang)**:
   - Thống kê **Tổng số công việc** đang có theo thời gian thực.
   - Chi tiết số lượng công việc *Đang làm* và *Đã hoàn thành*.
   - Nút hỗ trợ *"Xóa việc đã xong"* giúp dọn dẹp danh sách nhanh chóng.

5. **Lưu trữ dữ liệu**:
   - Tự động lưu công việc và tên người dùng vào `localStorage`, không lo mất dữ liệu khi tải lại trang.

---

## 📁 Cấu trúc thư mục

```
todo-list-app/
├── index.html         # Cấu trúc Semantic HTML5 chuẩn
├── css/
│   └── styles.css     # Thiết kế giao diện hiện đại, biến màu CSS, animation, responsive
├── js/
│   └── app.js         # Đồng hồ thời gian thực, quản lý tác vụ, lưu trữ LocalStorage
└── README.md          # Tài liệu dự án
```

---

## 🚀 Hướng dẫn mở và sử dụng

Chỉ cần mở trực tiếp file `index.html` bằng bất kỳ trình duyệt web nào (Chrome, Edge, Firefox, Safari):

- Nhấp đúp chuột vào file `index.html` trong thư mục `d:\todolist\todo-list-app`.
- Hoặc sử dụng extension **Live Server** trong VS Code / Antigravity IDE.
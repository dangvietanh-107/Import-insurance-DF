# Tool chuyển đổi dữ liệu thuốc BHYT

Ứng dụng chạy trên trình duyệt, không gửi file lên máy chủ. Mở `index.html` (hoặc phục vụ thư mục bằng web server tĩnh), chọn file, bấm **XỬ LÝ**, sau đó bấm **TẢI FILE OUTPUT**. Cần Internet để tải SheetJS từ CDN.

- Hỗ trợ `.xlsx`, `.xls`, `.csv`; header được trim, bỏ dấu và chuẩn hóa nội bộ về `UPPER_SNAKE_CASE`.
- Thiếu cột bắt buộc sẽ không xuất file. Lỗi `TT_THAU` là cảnh báo theo dòng; dòng vẫn được xuất với `MABAOCAO` trống.
- `*_TRUOC_MAP` để trống. `lookup.js` có bảng mapping tạm thời cho DMDC và điểm mở rộng Master; khóa bắt buộc là `MA_THUOC + SO_DANG_KY`.
- `DANG_BAO_CHE_CV130` để trống vì chưa có điều kiện xác định áp dụng CV130.

Kiểm thử với sáu mẫu trong `requirement.md`, đặc biệt hai dòng Gliclada có cùng `MA_THUOC` nhưng khác `SO_DANG_KY`: không được lookup chỉ bằng mã thuốc.

Khi đã cài Node.js, chạy `npm test` để chạy sáu ca kiểm thử mapping trong `tests/mapper.test.js`.

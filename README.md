# Tool chuyển đổi dữ liệu thuốc BHYT

Ứng dụng chạy trên trình duyệt, không gửi file lên máy chủ. Mở `index.html` (hoặc phục vụ thư mục bằng web server tĩnh), chọn file, bấm **XỬ LÝ**, sau đó bấm **TẢI FILE OUTPUT**. Cần Internet để tải SheetJS từ CDN.

- Hỗ trợ `.xlsx`, `.xls`, `.csv`; header được trim, bỏ dấu và chuẩn hóa nội bộ về `UPPER_SNAKE_CASE`.
- Thiếu cột bắt buộc sẽ không xuất file. Lỗi `TT_THAU` là cảnh báo theo dòng; dòng vẫn được xuất với `MABAOCAO` trống.
- `*_TRUOC_MAP` để trống. `lookup.js` có bảng mapping tạm thời cho DMDC và điểm mở rộng Master; khóa bắt buộc là `MA_THUOC + SO_DANG_KY`.
- `DANG_BAO_CHE_CV130` để trống vì chưa có điều kiện xác định áp dụng CV130.

Kiểm thử với sáu mẫu trong `requirement.md`, đặc biệt hai dòng Gliclada có cùng `MA_THUOC` nhưng khác `SO_DANG_KY`: không được lookup chỉ bằng mã thuốc.

Khi đã cài Node.js, chạy `npm test` để chạy sáu ca kiểm thử mapping trong `tests/mapper.test.js`.

## Chi tiết lỗi và cảnh báo trước khi tải file

Các thông báo dưới đây là những trường hợp ứng dụng hiện bắt được trong lúc bấm **XỬ LÝ**. Nếu có lỗi chặn, ứng dụng không tạo dữ liệu Output và nút **TẢI FILE OUTPUT** vẫn bị khóa. Nếu chỉ có cảnh báo, dữ liệu vẫn được tạo và có thể tải xuống nhưng cần kiểm tra các dòng được nêu.

### Lỗi chặn xử lý

| Mã | Điều kiện phát sinh | Thông báo hiển thị | Kết quả |
|---|---|---|---|
| E001 | Chưa chọn file Input | `Vui lòng chọn file Input.` | Không đọc hoặc tạo Output. |
| E002 | Ô `MAVATTU bắt đầu` trống, không hợp lệ theo ràng buộc số nguyên, hoặc không phải số nguyên | `Vui lòng nhập MAVATTU bắt đầu là số nguyên.` | Không xử lý file. |
| E003 | Ô `MANHOMVATTU` trống, không hợp lệ theo ràng buộc số nguyên, hoặc không phải số nguyên | `Vui lòng nhập MANHOMVATTU là số nguyên.` | Không xử lý file. |
| E004 | Không tải được thư viện SheetJS/XLSX | `Không tải được thư viện xử lý Excel. Vui lòng kiểm tra kết nối mạng và tải lại trang.` | Không đọc file. |
| E005 | File không có trang dữ liệu | `File không có trang dữ liệu.` | Không tạo Output. |
| E006 | File thiếu một hoặc nhiều cột bắt buộc | `File Input thiếu các cột:` kèm danh sách từng cột thiếu | Không tạo Output. |
| E007 | Sheet không có dòng header hoặc file rỗng | Hiển thị như E006, với danh sách các cột bắt buộc bị thiếu | Không tạo Output. |
| E008 | SheetJS không đọc được file, file hỏng, hoặc định dạng không được thư viện hỗ trợ | Hiển thị thông báo lỗi do thư viện trả về; nếu không có nội dung lỗi thì hiển thị `Không thể xử lý file.` | Không tạo Output. |

Danh sách cột bắt buộc hiện tại là: `MA_THUOC`, `TEN_THUOC`, `TEN_HOAT_CHAT`, `DON_VI_TINH`, `HAM_LUONG`, `DUONG_DUNG`, `MA_DUONG_DUNG`, `SO_DANG_KY`, `DON_GIA`, `DON_GIA_BH`, `QUY_CACH`, `NHA_SX`, `NUOC_SX`, `NHA_THAU`, `TT_THAU`, `MA_CSKCB`.

Tên header được trim, bỏ dấu, thay ký tự phân cách bằng `_`, rồi chuẩn hóa thành chữ hoa trước khi kiểm tra. Vì vậy các biến thể như `MA THUOC`, ` MA_THUOC ` và `Mã thuốc` có thể được nhận diện là `MA_THUOC`. Dữ liệu trong ô không bị thay đổi theo bước chuẩn hóa header.

### Cảnh báo không chặn tải file

| Mã | Phạm vi | Điều kiện | Thông báo hiển thị | Xử lý Output |
|---|---|---|---|---|
| W001 | Theo từng dòng | `TT_THAU` không có đủ 4 phần ngăn bởi dấu `;`, có phần rỗng, phần đầu không bắt đầu bằng số, hoặc phần cuối không phải năm gồm đúng 4 chữ số | `Dòng N: TT_THAU không đúng định dạng A;B;C;D (D là năm 4 chữ số).` | Vẫn xuất dòng; các trường thông tin quyết định/gói thầu/báo cáo liên quan để trống, trong đó `MABAOCAO` để trống. |

`N` là số dòng trên file Excel, tính cả dòng header nên dòng dữ liệu đầu tiên là dòng 2. Bộ đếm **Số dòng lỗi** hiện đang đếm số cảnh báo, không phải số dòng bị loại; hiện tại không có dòng nào bị loại chỉ vì cảnh báo `TT_THAU`.

### Các trường hợp hiện chưa cảnh báo hoặc chặn

- Không kiểm tra file có đúng phần mở rộng `.xlsx`, `.xls` hoặc `.csv`; việc đọc thực tế do SheetJS quyết định.
- Không kiểm tra ô bắt buộc trong từng dòng có bị trống hay không sau khi header hợp lệ.
- Không kiểm tra kiểu dữ liệu, miền giá trị, số âm, ngày tháng hoặc trùng mã giữa các dòng.
- Không cảnh báo khi không tìm thấy dữ liệu mapping DMDC, nhà sản xuất hoặc nước sản xuất; hệ thống giữ giá trị mặc định hoặc để trống theo quy tắc mapping.
- Không cảnh báo dòng hoàn toàn trống; các dòng này được bỏ qua khi đọc file và không tính vào **Số dòng Input**.

### Trạng thái trước khi tải

- Chỉ lỗi chặn mới làm dừng xử lý và khóa tải.
- Sau khi xử lý thành công, kể cả có W001, ứng dụng hiển thị cảnh báo, số dòng Input/Output và mở nút **TẢI FILE OUTPUT**.
- File chỉ được ghi xuống máy khi người dùng bấm **TẢI FILE OUTPUT**; trước thời điểm đó không có file Output được tạo.

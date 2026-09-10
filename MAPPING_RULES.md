# Nguyên tắc ánh xạ Input → Output

## Luồng xử lý

1. Đọc file Excel/CSV, chuẩn hóa **tên cột** (trim, bỏ dấu, đổi về `UPPER_SNAKE_CASE`). Giá trị dữ liệu chỉ trim đầu/cuối.
2. Tạo một dòng Output gồm đúng toàn bộ cột quy định; cột chưa có quy tắc có giá trị `""`.
3. Gán `DEFAULT_VALUES`.
4. Gán các trường mapping trực tiếp.
5. Tách và xử lý `TT_THAU`.
6. Lookup DMDC theo khóa kép `MA_THUOC|SO_DANG_KY`.
7. Xuất Excel. Mỗi dòng Input hợp lệ tạo một dòng Output.

## Default quan trọng

| Output | Giá trị |
|---|---:|
| `MAVATTU` | Người dùng nhập giá trị bắt đầu; tăng `+1` theo mỗi dòng |
| `MANHOMVATTU` | Người dùng nhập; giống nhau cho mọi dòng |
| `MALOAIHINH`, `MANHASX`, `MANUOCSX` | `1` |
| `MATINH_DMDC` | `15` |
| `STT_DMDC`, `SOLUONG_DMDC` | `0` |
| `MA_HANG_SANXUAT_DMDC`, `MA_NUOC_SANXUAT_DMDC` | `1` |
| `MA_NHOM_CV9324` | `4` |
| `LOAIBAOCAO` | `"01"` |
| `LATHUOC` | `1` |
| `PHANTRAM_BHXH_TT`, `PHANTRAM_TT30` | `100` |

Các default `0` khác gồm `NGOAIDANHMUCBHYT`, `TAMNGUNG`, `KY_THUAT_CAO`, `DAMAP_DMDC`, `DICHVU_KY_THUAT_CAO`, `TIEN_BHXH_CHI`, `TIEN_BN_CHI`, `KHONGNHAPSONGAY`, `NGOAI_DANH_MUC_BHPVI`, `TINH_NGOAIDS`, `TINH_NGOAI_DRG`, `TAI_SU_DUNG_CV130`, `VET_THUONG_TP_CV130`, `MACDINH_SUDUNGTRONGGOI`, `MACDINHTHUOC_GOIVATTUKTC`, `DINHMUC_MA_NHOM_VATTU`, `STENT_VATTU`, `MANHACC`, `DUOCCONLAI`, `DONGIA_DM_TRUOC_MAP`, `SOLUONG_DM_TRUOC_MAP`. `STT_STENT` mặc định là `1`.

## Mapping trực tiếp

| Input | Output |
|---|---|
| `MA_CSKCB` | `DVTT` |
| `TEN_THUOC` | `TENVATTU`, `TENVATTUHIENTHI`, `TEN_HIEN_THI` |
| `TEN_HOAT_CHAT` | `HOATCHAT` |
| `HAM_LUONG` | `HAMLUONG`, `HAM_LUONG_DMDC`, `DANGTHUOC` |
| `DON_VI_TINH` | `DVT` |
| `DUONG_DUNG` | `CACHSUDUNG`, `DUONGDUNG_DMDC` |
| `MA_DUONG_DUNG` | `MADUONGDUNG_DMDC` |
| `SO_DANG_KY` | `SOGPDK`, `SO_DANGKY_DMDC`, `SODANGKY` |
| `MA_THUOC` | `MABAOCAO_BYT`, `MAHOATCHAT_DMDC`, `MAHOATCHAT` |
| `DON_GIA` | `GHICHUVATTU`, `DONGIA_BV`, `DONGIA_DMDC` |
| `DON_GIA_BH` | `DONGIA_BH`, `DONGIA_TT_DMDC` |
| `QUY_CACH` | `QUYCACH`, `DONGGOI_DMDC` |
| `NHA_SX` | `HANG_SANXUAT_DMDC` |
| `NUOC_SX` | `NUOC_SANXUAT_DMDC` |
| `NHA_THAU` | `NHATHAU_DMDC` |
| `DON_GIA_BH` | `DONGIA_BV_TRUOCMAP`, `DONGIA_BH_TRUOCMAP` |
| `TT_THAU` | `SO_CV_BHXH_130` |

`SO_LUONG` **không** map sang `SOLUONG_DMDC`; trường Output này luôn là `0` trong phiên bản hiện tại. `TT_THUOC`, `DANGTHUOC`, `SOLUONG_QUYDINH` và `SL_DUTRU_TOIDA_TUYENDUOI` luôn để trống.

## Quy tắc `TT_THAU`

Với `TT_THAU = A;B;C;D`:

| Thành phần | Output |
|---|---|
| `A` (quyết định) | `QUYETDINH`, `SO_CV_GUI_BHXH` |
| `B` | `MA_GOI_THAU_VT` |
| `C` | `MA_NHOM_THAU_VT` |
| `D` (năm) + số đầu của `A` | `MABAOCAO` theo dạng `D.số` |

Ví dụ: `453/QĐ-SYT;G1;N4;2026` tạo `MABAOCAO = 2026.453`. Sai định dạng sẽ tạo cảnh báo, các trường từ `TT_THAU` để trống và dòng vẫn được xuất.

## Quy tắc DMDC hiện tại

`MALIENTHONG_DMDC` luôn bằng `MAVATTU` của cùng dòng. `CONGBO_DMDC` lấy trực tiếp từ cột Input `TU_NGAY`.

Các bảng mapping tạm theo `MA_THUOC|SO_DANG_KY` đã được bỏ qua để không ghi đè hai quy tắc này. `lookup.js` vẫn là điểm mở rộng để tích hợp Master sau này.

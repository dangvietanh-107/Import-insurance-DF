# MAPPING_RULES_HIS4.0.md

# QUY TẮC ÁNH XẠ DỮ LIỆU INPUT → OUTPUT HIS4.0

## 1. Mục đích

Quy định cách chuyển đổi dữ liệu từ file Input danh mục thuốc sang file Output theo cấu trúc danh mục thuốc HIS4.0.

Mỗi dòng Input hợp lệ tạo ra một dòng Output tương ứng.

---

## 2. Luồng xử lý

1. Đọc dữ liệu từ file Excel hoặc CSV.
2. Chuẩn hóa tên cột Input: loại bỏ khoảng trắng đầu/cuối, chuẩn hóa chữ hoa và dấu gạch dưới.
3. Chuẩn hóa giá trị dữ liệu bằng cách loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi. Không tự ý thay đổi nội dung dữ liệu.
4. Tạo một dòng Output theo đúng thứ tự và cấu trúc cột được quy định tại mục 4.
5. Khởi tạo các trường Output chưa có dữ liệu bằng chuỗi rỗng.
6. Gán các giá trị mặc định theo mục 5.
7. Thực hiện ánh xạ dữ liệu trực tiếp theo mục 6.
8. Tách và xử lý trường `TT_THAU` theo mục 7.
9. Tạo mã thuốc và xử lý mã trùng theo mục 8.
10. Xuất file Excel theo đúng cấu trúc Output HIS4.0.

---

## 3. Nguyên tắc chung

* Giữ nguyên dữ liệu gốc nếu không có quy tắc chuyển đổi cụ thể.
* Không tự ý suy diễn dữ liệu cho các trường không có nguồn.
* Không tự động tra cứu hoặc bổ sung dữ liệu từ nguồn bên ngoài.
* Không xóa dòng Input hợp lệ chỉ vì một số trường dữ liệu bị thiếu.
* Các trường không có quy tắc ánh xạ hoặc giá trị mặc định sẽ để trống.
* Không thay đổi thứ tự các cột Output.
* Không thay đổi định dạng dữ liệu của các trường nếu không có yêu cầu cụ thể.
* Các trường ngày tháng giữ nguyên định dạng dữ liệu từ Input, trừ khi có quy tắc riêng.

---

## 4. Cấu trúc Output HIS4.0

Output phải có đầy đủ các cột theo đúng thứ tự sau:

```text
STT
MA_NHOM
MA_LOAI
MA_HOAT_CHAT
HOAT_CHAT
MA_THUOC
TEN_THUOC
HAM_LUONG
DON_VI_TINH
DUONG_DUNG
MA_DUONG_DUNG
HANG_SX
NUOC_SX
GIA_THAU
NHOM_BHXH
GIA_BAN
GIA_DICH_VU
GIA_BHYT
GIA_BHYT_QUYET_TOAN
BHYT_CHI_TRA
MA_ACT
MA_BYT
SO_DANG_KY
DONG_GOI
LIEU_LUONG
NHA_CUNG_CAP
SO_GOI_THAU
DANGBAOCHE
TYLEHUHAO
CONG_BO
STT_THAU
TEN_GIAM_DINH_BH
MA_THUOC_BV
NGUONCT
SOGIAYPHEP
THAUGHEP
MA_PP_CHEBIEN
MAHIEUSP
TU_NGAY
DEN_NGAY
TUNGAY_HD
DENNGAY_HD
SO_LUONG
MA_CSKCB
LOAI_THUOC
LOAI_THAU
HT_THAU
MA_DVKT
TIEUCHUANCHATLUONG
BOPHANSUDUNG
TENKHVITHUOC
NGUONGOC
TINHTRANGDUOCLIEU
DMGUIBH
NGAYCHECKGUIBH
TINHNANG_KT
SO_LUU_HANH
MA_CSKCB_TBYT
DM_NSX_CDD
DM_THUCTE_CDD
TLHH_CB
TLHH_BQ
THANH_TIEN_THUOC
LIEU_BQ_PX
DUOCPHEPKELE
KETRUNGHOATCHAT
THUOCKHANGSINH
KHONGTINHXNT
DANHSTTDUNGTHUOC
THUOCNHIEUHOATCHAT
THUOCKEDON
TIENCHATGNHT
QLTHEOTUIMAU
DUOCDUYETLE
THUOCDIEUTRILAO
THUOCCORTICOID
VAT nhập (%)
VAT xuất (%)
```

---

## 5. Giá trị mặc định

Các trường sau được gán giá trị mặc định:

| Output                            | Giá trị mặc định |
| --------------------------------- | ---------------- |
| `NHOM_BHXH`                       | `10`             |
| `BHYT_CHI_TRA`                    | `100`            |
| `LOAI_THUOC`                      | `1`              |
| Các trường chưa có quy tắc ánh xạ | Chuỗi rỗng `""`  |

Lưu ý:

* Giá trị mặc định `10` của `NHOM_BHXH` được lấy theo ví dụ Output do người dùng cung cấp.
* Giá trị mặc định `100` của `BHYT_CHI_TRA` được lấy theo ví dụ Output do người dùng cung cấp.
* `LOAI_THUOC` luôn nhận giá trị mặc định `1`, không lấy dữ liệu từ Input.
* Không tự động gán các giá trị mặc định khác nếu chưa có yêu cầu.

---

## 6. Mapping trực tiếp

### 6.1. Thông tin hoạt chất và thuốc

| Input              | Output               | Quy tắc            |
| ------------------ | -------------------- | ------------------ |
| `MA_HOAT_CHAT_AX`  | `MA_HOAT_CHAT`       | Sao chép trực tiếp |
| `HOAT_CHAT_AX`     | `HOAT_CHAT`          | Sao chép trực tiếp |
| `TEN_THUOC_AX`     | `TEN_THUOC`          | Sao chép trực tiếp |
| `TEN_THUOC_AX`     | `TEN_GIAM_DINH_BH`   | Sao chép trực tiếp |
| `HAM_LUONG`        | `HAM_LUONG`          | Sao chép trực tiếp |
| `DON_VI_TINH`      | `DON_VI_TINH`        | Sao chép trực tiếp |
| `DUONG_DUNG_AX`    | `DUONG_DUNG`         | Sao chép trực tiếp |
| `MA_DUONG_DUNG_AX` | `MA_DUONG_DUNG`      | Sao chép trực tiếp |
| `DANG_BAO_CHE`     | `DANGBAOCHE`         | Sao chép trực tiếp |
| `SO_DANG_KY_AX`    | `SO_DANG_KY`         | Sao chép trực tiếp |
| `QUY_CACH`         | `DONG_GOI`           | Sao chép trực tiếp |
| `NHA_SX`           | `HANG_SX`            | Sao chép trực tiếp |
| `NUOC_SX`          | `NUOC_SX`            | Sao chép trực tiếp |
| `NHA_THAU`         | `NHA_CUNG_CAP`       | Sao chép trực tiếp |
| `MA_CSKCB`         | `MA_CSKCB`           | Sao chép trực tiếp |
| `MA_DVKT`          | `MA_DVKT`            | Sao chép trực tiếp |
| `TCCL`             | `TIEUCHUANCHATLUONG` | Sao chép trực tiếp |
| `BO_PHAN_VT`       | `BOPHANSUDUNG`       | Sao chép trực tiếp |
| `TEN_KHOA_HOC`     | `TENKHVITHUOC`       | Sao chép trực tiếp |
| `NGUON_GOC`        | `NGUONGOC`           | Sao chép trực tiếp |
| `MA_DL_CB`         | `MA_PP_CHEBIEN`      | Sao chép trực tiếp |
| `TLHH_CB`          | `TLHH_CB`            | Sao chép trực tiếp |
| `TLHH_BQ`          | `TLHH_BQ`            | Sao chép trực tiếp |
| `TU_NGAY`          | `CONG_BO`            | Sao chép trực tiếp |

### 6.2. Mapping giá

| Input        | Output                | Quy tắc            |
| ------------ | --------------------- | ------------------ |
| `DON_GIA`    | `GIA_THAU`            | Sao chép trực tiếp |
| `DON_GIA`    | `GIA_BAN`             | Sao chép trực tiếp |
| `DON_GIA`    | `GIA_DICH_VU`         | Sao chép trực tiếp |
| `DON_GIA_BH` | `GIA_BHYT`            | Sao chép trực tiếp |
| `DON_GIA_BH` | `GIA_BHYT_QUYET_TOAN` | Sao chép trực tiếp |

### 6.3. Các trường để trống

Các trường sau để trống nếu không có quy tắc bổ sung:

* `MA_NHOM`
* `MA_LOAI`
* `MA_ACT`
* `MA_BYT`
* `LIEU_LUONG`
* `SO_GOI_THAU`
* `STT_THAU`
* `NGUONCT`
* `SOGIAYPHEP`
* `MA_PP_CHEBIEN` nếu không có `MA_DL_CB`
* `MAHIEUSP`
* `TINHTRANGDUOCLIEU`
* `DMGUIBH`
* `NGAYCHECKGUIBH`
* `TINHNANG_KT`
* `SO_LUU_HANH`
* `MA_CSKCB_TBYT`
* `DM_NSX_CDD`
* `DM_THUCTE_CDD`
* `THANH_TIEN_THUOC`
* `LIEU_BQ_PX`
* `DUOCPHEPKELE`
* `KETRUNGHOATCHAT`
* `THUOCKHANGSINH`
* `KHONGTINHXNT`
* `DANHSTTDUNGTHUOC`
* `THUOCNHIEUHOATCHAT`
* `THUOCKEDON`
* `TIENCHATGNHT`
* `QLTHEOTUIMAU`
* `DUOCDUYETLE`
* `THUOCDIEUTRILAO`
* `THUOCCORTICOID`
* `VAT nhập (%)`
* `VAT xuất (%)`
* `TU_NGAY`
* `DEN_NGAY`
* `TUNGAY_HD`
* `DENNGAY_HD`
* `SO_LUONG`
* `LOAI_THAU`
* `HT_THAU`

---

## 7. Quy tắc tách TT_THAU

Trường Input `TT_THAU` có cấu trúc:

`SỐ_QUYẾT_ĐỊNH;MÃ_GÓI_THAU;MÃ_NHÓM_THAU;NĂM`

Ví dụ:

`239/QĐ-SYT;G1;N4;2024`

Tách thành:

| Thành phần   | Ý nghĩa       |
| ------------ | ------------- |
| `239/QĐ-SYT` | Số quyết định |
| `G1`         | Mã gói thầu   |
| `N4`         | Mã nhóm thầu  |
| `2024`       | Năm           |

Ánh xạ:

| Input                  | Output               | Quy tắc           |
| ---------------------- | -------------------- | ----------------- |
| Toàn bộ `TT_THAU`      | `THAUGHEP`           | Sao chép trực tiếp, không tách |
| `TT_THAU` thành phần D | Dùng để tạo mã thuốc | Lấy năm           |

`SO_GOI_THAU` và `STT_THAU` luôn để trống. Thành phần A, B và C chỉ được dùng để kiểm tra định dạng; riêng thành phần A và D vẫn được dùng để tạo mã thuốc.

---

## 8. Quy tắc tạo MA_THUOC và MA_THUOC_BV

### 8.1. Tạo mã cơ sở

Từ trường `TT_THAU`, lấy:

* Năm ở thành phần D.
* Số quyết định ở thành phần A, loại bỏ phần chữ và ký tự không phải số ở cuối.

Công thức:

`MA_THUOC = NĂM.SỐ_QUYẾT_ĐỊNH`

Ví dụ:

| TT_THAU                 | Mã cơ sở   |
| ----------------------- | ---------- |
| `239/QĐ-SYT;G1;N4;2024` | `2024.239` |
| `162/QĐ-SYT;G3;N3;2026` | `2026.162` |

### 8.2. Xử lý mã trùng

Nếu nhiều dòng có cùng mã cơ sở, tất cả các dòng thuộc nhóm trùng đều phải được đánh số thứ tự từ 1.

Công thức:

`MA_THUOC = NĂM.SỐ_QUYẾT_ĐỊNH.SỐ_THỨ_TỰ`

Ví dụ:

| STT | TT_THAU                 | MA_THUOC     |
| --- | ----------------------- | ------------ |
| 1   | `239/QĐ-SYT;G1;N4;2024` | `2024.239.1` |
| 2   | `239/QĐ-SYT;G1;N4;2024` | `2024.239.2` |
| 3   | `239/QĐ-SYT;G1;N4;2024` | `2024.239.3` |

Quy tắc:

1. Nhóm các dòng theo mã cơ sở `NĂM.SỐ_QUYẾT_ĐỊNH`.
2. Nếu mã cơ sở chỉ xuất hiện một lần, giữ nguyên mã cơ sở, không thêm hậu tố.
3. Nếu mã cơ sở xuất hiện từ hai lần trở lên, đánh số tất cả các dòng trong nhóm từ `.1`, `.2`, `.3`...
4. Thứ tự đánh số dựa trên thứ tự xuất hiện của dòng trong file Input.
5. `MA_THUOC_BV` nhận cùng giá trị với `MA_THUOC`.

---

## 9. Quy tắc STT

* `STT` bắt đầu từ 1.
* Tăng dần 1 đơn vị theo thứ tự dòng Output.
* Mỗi dòng Output hợp lệ có một giá trị STT duy nhất.

---

## 10. Xử lý dữ liệu thiếu hoặc sai định dạng

* Nếu `TT_THAU` thiếu hoặc sai định dạng, `THAUGHEP` vẫn giữ nguyên giá trị Input; `MA_THUOC` và `MA_THUOC_BV` để trống do không tạo được mã thuốc.
* Nếu không xác định được năm hoặc số quyết định, không tạo mã thuốc từ dữ liệu không hợp lệ.
* Nếu thiếu trường Input tương ứng, trường Output được ánh xạ sẽ để trống.
* Không tự động xóa dòng chỉ vì thiếu dữ liệu.
* Ghi nhận cảnh báo đối với các dòng có `TT_THAU` sai định dạng.
* Không tự ý tạo mã thuốc thay thế khi thiếu dữ liệu.

---

## 11. Kiểm tra trước khi xuất file

Trước khi xuất Output, cần kiểm tra:

1. Số dòng Output bằng số dòng Input hợp lệ.
2. Các cột Output đúng thứ tự và tên cột.
3. `MA_THUOC` và `MA_THUOC_BV` được tạo đúng quy tắc.
4. Các mã trùng được đánh số từ `.1` trở đi.
5. `MA_HOAT_CHAT` lấy đúng từ `MA_HOAT_CHAT_AX`.
6. `HOAT_CHAT` lấy đúng từ `HOAT_CHAT_AX`.
7. `TEN_THUOC` và `TEN_GIAM_DINH_BH` lấy đúng từ `TEN_THUOC_AX`.
8. Các trường giá được ánh xạ đúng.
9. Các trường không có quy tắc được để trống.
10. Không có lỗi làm thay đổi dữ liệu gốc ngoài các quy tắc đã quy định.

---

## 12. Nguyên tắc ưu tiên

Khi có nhiều quy tắc cùng tác động đến một trường Output, thứ tự ưu tiên là:

1. Quy tắc tạo mã thuốc.
2. Quy tắc ánh xạ trực tiếp.
3. Giá trị mặc định.
4. Giá trị rỗng nếu không có quy tắc.

Không cho phép mapping trực tiếp ghi đè giá trị đã được tạo bởi quy tắc tạo mã thuốc.

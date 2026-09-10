// Master tương lai phải tạo chỉ mục bằng khóa MA_THUOC + SO_DANG_KY, không chỉ MA_THUOC.
const makeKey=row=>`${row.MA_THUOC??''}|${row.SO_DANG_KY??''}`;
export function lookupManufacturer(name){return name?1:''}
export function lookupCountry(countryName){return countryName?1:''}
export function lookupDrug(row,masterIndex=null){return masterIndex?.get?.(makeKey(row))??{}}

export const REQUIRED_COLUMNS='MA_THUOC TEN_THUOC TEN_HOAT_CHAT DON_VI_TINH HAM_LUONG DUONG_DUNG MA_DUONG_DUNG SO_DANG_KY DON_GIA DON_GIA_BH QUY_CACH NHA_SX NUOC_SX NHA_THAU TT_THAU MA_CSKCB'.split(' ');
export const validateHeaders=headers=>REQUIRED_COLUMNS.filter(c=>!headers.includes(c));
export function cleanValue(v){if(v==null||(typeof v==='number'&&Number.isNaN(v)))return '';return typeof v==='string'?v.trim():v}
export function parseTender(v){const p=String(cleanValue(v)).split(';').map(x=>x.trim());if(p.length!==4||p.some(x=>!x))return{valid:false};const[decision,packageCode,groupCode,year]=p,number=(decision.match(/^\s*(\d+)/)||[])[1];return number&&/^\d{4}$/.test(year)?{valid:true,decision,packageCode,groupCode,year,reportCode:`${year}.${number}`}:{valid:false}}

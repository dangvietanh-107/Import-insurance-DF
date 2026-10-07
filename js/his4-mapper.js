import { HIS4_DEFAULT_VALUES, HIS4_DIRECT_MAPPING, HIS4_OUTPUT_COLUMNS } from './his4-defaults.js';
import { cleanValue, parseTender } from './validator.js';

function normalizedInput(raw) {
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, cleanValue(value)]));
}

export function mapHis4Row(raw, index) {
  const input = normalizedInput(raw);
  const output = Object.fromEntries(HIS4_OUTPUT_COLUMNS.map(column => [column, '']));
  Object.assign(output, HIS4_DEFAULT_VALUES);
  Object.entries(HIS4_DIRECT_MAPPING).forEach(([target, source]) => { output[target] = input[source] ?? ''; });
  output.STT = index + 1;

  const tender = parseTender(input.TT_THAU);
  const warnings = [];
  let baseCode = '';
  output.THAUGHEP = input.TT_THAU ?? '';
  if (tender.valid) {
    baseCode = tender.reportCode;
  } else {
    warnings.push('TT_THAU không đúng định dạng SỐ_QUYẾT_ĐỊNH;MÃ_GÓI_THAU;MÃ_NHÓM_THAU;NĂM (NĂM gồm 4 chữ số).');
  }
  return { output, baseCode, warnings };
}

export function mapHis4Rows(rows) {
  const mapped = rows.map(mapHis4Row);
  const counts = new Map();
  mapped.forEach(({ baseCode }) => { if (baseCode) counts.set(baseCode, (counts.get(baseCode) ?? 0) + 1); });
  const occurrence = new Map();
  mapped.forEach(item => {
    if (!item.baseCode) return;
    const current = (occurrence.get(item.baseCode) ?? 0) + 1;
    occurrence.set(item.baseCode, current);
    const code = counts.get(item.baseCode) > 1 ? `${item.baseCode}.${current}` : item.baseCode;
    item.output.MA_THUOC = code;
    item.output.MA_THUOC_BV = code;
  });
  return mapped;
}

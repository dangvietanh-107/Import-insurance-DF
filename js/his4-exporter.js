import { HIS4_OUTPUT_COLUMNS } from './his4-defaults.js';

export function buildHis4OutputFileName(name) {
  const base = name.replace(/\.[^.]+$/, '');
  return `${base}_HIS4.0_output.xlsx`;
}

export function downloadHis4Workbook(rows, name) {
  const ws = XLSX.utils.json_to_sheet(rows, { header: HIS4_OUTPUT_COLUMNS, skipHeader: false });
  HIS4_OUTPUT_COLUMNS.forEach((_, index) => {
    const cell = XLSX.utils.encode_cell({ r: 0, c: index });
    ws[cell].s = { font: { bold: true } };
  });
  ws['!cols'] = HIS4_OUTPUT_COLUMNS.map(column => ({ wch: Math.max(12, Math.min(28, column.length + 2)) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Thuoc HIS4.0');
  XLSX.writeFile(wb, buildHis4OutputFileName(name), { compression: true });
}

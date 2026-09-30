import { parseFile } from './parser.js';
import { validateHeaders } from './validator.js';
import { mapRow } from './mapper.js';
import { downloadWorkbook } from './exporter.js';
import { mapHis4Rows } from './his4-mapper.js';
import { downloadHis4Workbook } from './his4-exporter.js';

const $ = selector => document.querySelector(selector);
const card = $('.card');
function setStatus(element, message, kind = '') { element.textContent = message; element.className = kind; }
function setFileState(element, text, kind) { element.textContent = text; element.className = `file-state ${kind}`; }
function showWarnings(list, box, warnings) {
  list.replaceChildren(...warnings.map(warning => { const item = document.createElement('li'); item.textContent = warning; return item; }));
  box.hidden = !warnings.length;
}
function parseRequiredInteger(input, label) {
  const value = input.value.trim();
  if (!value || !input.validity.valid || !Number.isInteger(Number(value))) throw Error(`Vui lòng nhập ${label} là số nguyên.`);
  return Number(value);
}
function setupFileInput(flow, waitingMessage) {
  flow.fileInput.addEventListener('change', () => {
    const file = flow.fileInput.files[0];
    flow.fileName.textContent = file ? `Tên file: ${file.name}` : 'Chưa chọn file.';
    setFileState(flow.fileState, file ? 'Đã chọn file' : 'Chưa chọn file', file ? 'ready' : 'idle');
    flow.result.hidden = true; flow.download.disabled = true;
    setStatus(flow.status, file ? 'Sẵn sàng xử lý.' : waitingMessage);
  });
}
function setProcessing(flow, controls, isProcessing) {
  controls.forEach(control => { control.disabled = isProcessing; });
  card.classList.toggle('is-processing', isProcessing);
  card.setAttribute('aria-busy', String(isProcessing));
  if (isProcessing) {
    setFileState(flow.fileState, 'Đang xử lý', 'processing');
    setStatus(flow.status, 'Đang đọc và xử lý dữ liệu...', 'processing');
  }
}

// Luồng BHYT dùng nguyên mapper và exporter hiện có.
const bhyt = { fileInput: $('#inputFile'), startingMavattu: $('#startingMavattu'), manhomvattu: $('#manhomvattu'), process: $('#processButton'), reset: $('#resetButton'), download: $('#downloadButton'), fileName: $('#fileName'), fileState: $('#fileState'), status: $('#status'), result: $('#result'), warningsBox: $('#warningsBox'), warnings: $('#warnings') };
let bhytRows = [];
setupFileInput(bhyt, 'Đang chờ file...');
function resetBhyt() {
  bhyt.fileInput.value = ''; bhyt.startingMavattu.value = ''; bhyt.manhomvattu.value = ''; bhytRows = [];
  bhyt.download.disabled = true; bhyt.result.hidden = true; bhyt.warnings.replaceChildren(); bhyt.warningsBox.hidden = true;
  ['#inputCount', '#outputCount', '#errorCount'].forEach(selector => $(selector).textContent = '0');
  bhyt.fileName.textContent = 'Chưa chọn file.'; setFileState(bhyt.fileState, 'Chưa chọn file', 'idle'); setStatus(bhyt.status, 'Đang chờ file...');
}
bhyt.reset.addEventListener('click', resetBhyt);
bhyt.process.addEventListener('click', async () => {
  const file = bhyt.fileInput.files[0];
  if (!file) { setFileState(bhyt.fileState, 'Thiếu file', 'error'); setStatus(bhyt.status, 'Vui lòng chọn file Input.', 'error'); return; }
  try {
    bhyt.download.disabled = true;
    setProcessing(bhyt, [bhyt.fileInput, bhyt.startingMavattu, bhyt.manhomvattu, bhyt.process, bhyt.reset], true);
    const start = parseRequiredInteger(bhyt.startingMavattu, 'MAVATTU bắt đầu'), group = parseRequiredInteger(bhyt.manhomvattu, 'MANHOMVATTU');
    const { headers, rows } = await parseFile(file), missing = validateHeaders(headers);
    if (missing.length) throw Error(`File Input thiếu các cột:\n- ${missing.join('\n- ')}`);
    const warnings = [];
    bhytRows = rows.map((row, index) => { const mapped = mapRow(row, { mavattu: start + index, manhomvattu: group }); mapped.warnings.forEach(message => warnings.push(`Dòng ${index + 2}: ${message}`)); return mapped.output; });
    $('#inputCount').textContent = rows.length; $('#outputCount').textContent = bhytRows.length; $('#errorCount').textContent = warnings.length;
    showWarnings(bhyt.warnings, bhyt.warningsBox, warnings); bhyt.result.hidden = false; bhyt.download.disabled = false;
    setFileState(bhyt.fileState, 'Đã xử lý xong', 'ready'); setStatus(bhyt.status, `Hoàn tất: đã xử lý ${bhytRows.length} dòng.`, 'success');
  } catch (error) { bhytRows = []; bhyt.result.hidden = true; setFileState(bhyt.fileState, 'Không thể xử lý', 'error'); setStatus(bhyt.status, error.message || 'Không thể xử lý file.', 'error'); }
  finally { setProcessing(bhyt, [bhyt.fileInput, bhyt.startingMavattu, bhyt.manhomvattu, bhyt.process, bhyt.reset], false); }
});
bhyt.download.addEventListener('click', () => { if (bhytRows.length && bhyt.fileInput.files[0]) downloadWorkbook(bhytRows, bhyt.fileInput.files[0].name); });

// Luồng HIS4.0 giữ dữ liệu, quy tắc mapping và file xuất độc lập với BHYT.
const his4 = { fileInput: $('#his4InputFile'), process: $('#his4ProcessButton'), reset: $('#his4ResetButton'), download: $('#his4DownloadButton'), fileName: $('#his4FileName'), fileState: $('#his4FileState'), status: $('#his4Status'), result: $('#his4Result'), warningsBox: $('#his4WarningsBox'), warnings: $('#his4Warnings') };
let his4Rows = [];
setupFileInput(his4, 'Đang chờ file...');
function resetHis4() {
  his4.fileInput.value = ''; his4Rows = []; his4.download.disabled = true; his4.result.hidden = true; his4.warnings.replaceChildren(); his4.warningsBox.hidden = true;
  ['#his4InputCount', '#his4OutputCount', '#his4ErrorCount'].forEach(selector => $(selector).textContent = '0');
  his4.fileName.textContent = 'Chưa chọn file.'; setFileState(his4.fileState, 'Chưa chọn file', 'idle'); setStatus(his4.status, 'Đang chờ file...');
}
his4.reset.addEventListener('click', resetHis4);
his4.process.addEventListener('click', async () => {
  const file = his4.fileInput.files[0];
  if (!file) { setFileState(his4.fileState, 'Thiếu file', 'error'); setStatus(his4.status, 'Vui lòng chọn file Input HIS4.0.', 'error'); return; }
  try {
    his4.download.disabled = true;
    setProcessing(his4, [his4.fileInput, his4.process, his4.reset], true);
    const { rows } = await parseFile(file), mapped = mapHis4Rows(rows), warnings = [];
    his4Rows = mapped.map((item, index) => { item.warnings.forEach(message => warnings.push(`Dòng ${index + 2}: ${message}`)); return item.output; });
    $('#his4InputCount').textContent = rows.length; $('#his4OutputCount').textContent = his4Rows.length; $('#his4ErrorCount').textContent = warnings.length;
    showWarnings(his4.warnings, his4.warningsBox, warnings); his4.result.hidden = false; his4.download.disabled = false;
    setFileState(his4.fileState, 'Đã xử lý xong', 'ready'); setStatus(his4.status, `Hoàn tất: đã xử lý ${his4Rows.length} dòng theo HIS4.0.`, 'success');
  } catch (error) { his4Rows = []; his4.result.hidden = true; setFileState(his4.fileState, 'Không thể xử lý', 'error'); setStatus(his4.status, error.message || 'Không thể xử lý file.', 'error'); }
  finally { setProcessing(his4, [his4.fileInput, his4.process, his4.reset], false); }
});
his4.download.addEventListener('click', () => { if (his4Rows.length && his4.fileInput.files[0]) downloadHis4Workbook(his4Rows, his4.fileInput.files[0].name); });

function activateTab(tab, panel, otherTab, otherPanel) {
  tab.addEventListener('click', () => {
    panel.hidden = false; otherPanel.hidden = true; tab.classList.add('active'); otherTab.classList.remove('active');
    tab.setAttribute('aria-selected', 'true'); otherTab.setAttribute('aria-selected', 'false');
  });
}
activateTab($('#bhytTab'), $('#bhytPanel'), $('#his4Tab'), $('#his4Panel'));
activateTab($('#his4Tab'), $('#his4Panel'), $('#bhytTab'), $('#bhytPanel'));

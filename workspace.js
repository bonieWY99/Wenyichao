(function () {
  const prefix = 'ebn-1142-workspace:';
  const group = document.getElementById('groupSelect');
  const fields = Array.from(document.querySelectorAll('[data-field]'));
  const status = document.getElementById('saveStatus');
  const now = () => new Date().toLocaleString('zh-TW', { hour12: false });
  const storageKey = () => prefix + group.value;
  const record = () => fields.reduce((data, field) => {
    const key = field.dataset.field;
    if (field.type === 'checkbox') data[key] = String(field.checked);
    else if (field.type === 'radio') { if (field.checked) data[key] = field.value; else if (!(key in data)) data[key] = ''; }
    else data[key] = field.value || '';
    return data;
  }, {});
  function load() {
    const data = JSON.parse(localStorage.getItem(storageKey()) || '{}');
    fields.forEach(field => { if (field.type === 'checkbox') field.checked = data[field.dataset.field] === 'true'; else if (field.type === 'radio') field.checked = data[field.dataset.field] === field.value; else field.value = data[field.dataset.field] || ''; });
    status.textContent = data.savedAt ? `已儲存：${data.savedAt}` : '此組尚未填寫';
    document.dispatchEvent(new Event('workspace:loaded'));
  }
  function save() {
    const data = { ...record(), savedAt: now() };
    localStorage.setItem(storageKey(), JSON.stringify(data));
    status.textContent = `已儲存：${data.savedAt}`;
  }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }
  function lineBreaks(value) { return escapeHtml(value || '尚未填寫').replace(/\n/g, '<br>'); }
  function download(name, type, body) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([body], { type })); link.download = name;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href);
  }
  function picoRows(data, letter) {
    return [1, 2, 3].map((n, i) => `<tr>${i === 0 ? `<th rowspan="4">${letter}</th>` : ''}<td>同義字${['①','②','③'][i]}</td><td>${lineBreaks(data[`${letter.toLowerCase()}${n}term`])}</td><td>${lineBreaks(data[`${letter.toLowerCase()}${n}count`])}</td></tr>`).join('') + `<tr><td>OR 組合式</td><td>${lineBreaks(data[`${letter.toLowerCase()}Or`])}</td><td>${lineBreaks(data[`${letter.toLowerCase()}OrCount`])}</td></tr>`;
  }
  function block(title, body) { return `<section><h2>${title}</h2>${body}</section>`; }
  function field(title, value) { return `<h3>${title}</h3><div>${lineBreaks(value)}</div>`; }
  async function exportHtml(scope = 'all') {
    save(); const data = JSON.parse(localStorage.getItem(storageKey()));
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('請允許瀏覽器開啟新視窗後再匯出 PDF。'); return; }
    printWindow.document.write('<p>正在準備 PDF 成果…</p>');
    let attachments = '';
    if (scope === 'all' || scope === '2') {
      try { attachments = await window.buildPrismaAttachmentsReport?.(group.value) || ''; }
      catch { attachments = '<p>PRISMA 附件讀取失敗，請回到工作區下載附件後另行繳交。</p>'; }
    }
    const phase1 = field('臨床情境', data.scenario) + field('背景問題（5W1H）', data.background) + field('前景問題與 PICO', data.pico) + field('問題類型', data.questionType);
    const table = `<div class="table-wrap"><table><thead><tr><th>搜尋策略</th><th>同義字</th><th>MeSH / Entry terms 或搜尋詞</th><th>搜尋筆數</th></tr></thead><tbody>${picoRows(data,'P')}${picoRows(data,'I')}${picoRows(data,'C')}${picoRows(data,'O')}</tbody></table></div>`;
    const picoSummary = `<div class="table-wrap"><table><thead><tr><th>PICO</th><th>中文描述</th><th>英文關鍵字</th></tr></thead><tbody>${['P','I','C','O'].map(letter => `<tr><th>${letter}</th><td>${lineBreaks(data[`${letter.toLowerCase()}Chinese`])}</td><td>${lineBreaks(data[`${letter.toLowerCase()}English`])}</td></tr>`).join('')}</tbody></table></div>`;
    const databaseProcess = ['PubMed','Cochrane Library','Embase','CEPS'].map((name, index) => { const key = ['pubmed','cochrane','embase','ceps'][index]; const history = [1,2,3,4,5].map(n => `#${n}：${data[`${key}Step${n}Query`] || '—'}（${data[`${key}Step${n}Hits`] || '—'} 筆）\n${data[`${key}Step${n}Note`] || ''}`).join('\n'); return `<h3>${name}</h3><div>策略模式：${lineBreaks(data[`${key}Mode`])}<br>搜尋日期：${lineBreaks(data[`${key}Date`])}　最終匯出：${lineBreaks(data[`${key}Exported`])} 筆<br>檢索歷程：<br>${lineBreaks(history)}<br>證據／紀錄：${lineBreaks(data[`${key}Proof`])}</div>`; }).join('');
    const dbTotal = ['pubmed','cochrane','embase','ceps'].reduce((sum, key) => sum + Number(data[`${key}Exported`] || 0), 0);
    const identified = dbTotal + Number(data.prismaOtherSources || 0);
    const prismaSummary = field('跨資料庫 PRISMA 流程摘要', `資料庫匯出合計：${dbTotal}\n其他來源：${data.prismaOtherSources || 0}\n識別總數：${identified}\n移除重複：${data.prismaDuplicatesRemoved || 0}\n去重後待篩選：${Math.max(0, identified - Number(data.prismaDuplicatesRemoved || 0))}\n標題／摘要排除：${data.prismaTitleExcluded || 0}\n全文評估：${data.prismaFullTextAssessed || 0}\n全文排除：${data.prismaFullTextExcluded || 0}\n最終納入：${data.prismaIncluded || 0}`) + field('排除理由與 PRISMA 檔案', data.prisma);
    const phase2 = field('一句話前景問題', data.foregroundQuestion) + picoSummary + table + databaseProcess + prismaSummary + attachments;
    const caspAnswers = Array.from({ length: 11 }, (_, index) => `Q${index + 1}：${data[`caspQ${index + 1}`] || '未作答'}${data[`caspQ${index + 1}Note`] ? `（${data[`caspQ${index + 1}Note`]}）` : ''}`).join('\n');
    const caspCounts = ['Yes', 'No', "Can't tell"].map(answer => `${answer}：${Array.from({ length: 11 }, (_, index) => data[`caspQ${index + 1}`]).filter(value => value === answer).length}`).join('　');
    const phase3 = field('目標文章與研究設計', data.article) + field('CASP 評讀重點', data.casp) + field('CASP 2024 RCT 評讀結果', `${data.caspPaperTitle || '未填文章題名'}\n${caspCounts}\n${caspAnswers}\n${window.buildRctVipReport?.(data) || ''}\n${data.caspSummary ? '先前評讀總結：'+data.caspSummary : ''}`) + field('CASP 2024 SR／MA 評讀與 V／I／P', window.buildSrmaReport?.(data)) + field('OCEBM 官方參考', 'OCEBM Levels of Evidence (2011)\nhttps://www.cebm.ox.ac.uk/resources/levels-of-evidence/ocebm-levels-of-evidence') + field('證據與建議等級', data.evidence) + field('實證摘要與建議', data.recommendation);
    const html = `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><title>${group.value}｜實證護理概論成果</title><style>body{font-family:'Noto Sans TC','Microsoft JhengHei',sans-serif;max-width:1000px;margin:42px auto;color:#1f2328;line-height:1.75;padding:0 24px}h1{color:#0b6e69}h2{margin-top:38px;border-bottom:3px solid #0b6e69;padding-bottom:8px}h3{font-size:1rem;margin:20px 0 5px;color:#075a56}section>div:not(.table-wrap){background:#fbfaf7;border:1px solid #e2ded6;border-radius:8px;padding:12px 14px;min-height:24px}.meta{color:#5b6168}.table-wrap{overflow-x:auto;border:1px solid #e2ded6;border-radius:8px}table{border-collapse:collapse;width:100%;font-size:.9rem}th,td{padding:8px;border-bottom:1px solid #e2ded6;border-right:1px solid #e2ded6;text-align:left;vertical-align:top}thead th{background:#f3f1ec}tbody th{background:#e3f2f0;color:#0b6e69;text-align:center}</style><h1>實證護理概論｜小組成果</h1><p class="meta">${group.value}　匯出時間：${now()}</p><h2>組員</h2><div>${lineBreaks(data.members)}</div>${block('1A 提出臨床問題', phase1)}${block('2A 搜尋與篩選文獻', phase2)}${block('3A 評讀與證據建議', phase3)}</html>`;
    let report = html;
    const phases = [block('1A 提出臨床問題', phase1), block('2A 搜尋與篩選文獻', phase2), block('3A 評讀與證據建議', phase3)];
    if (scope !== 'all') phases.forEach((phase, index) => { if (String(index + 1) !== scope) report = report.replace(phase, ''); });
    report = report.replace("'Noto Sans TC','Microsoft JhengHei'", "'Microsoft JhengHei'")
      .replace('</style>', 'body{font-weight:700}h1,h2,h3,th{font-weight:900}section{break-before:page}section:first-of-type{break-before:auto}div,td{overflow-wrap:anywhere}@page{size:A4;margin:16mm}@media print{body{margin:0;padding:0}.table-wrap{overflow:visible}} </style>')
      .replace('小組成果</h1>', `${scope === 'all' ? '1A–3A 總成果' : scope + 'A 階段成果'}</h1>`);
    printWindow.onload = async () => { await Promise.all([...printWindow.document.images].map(img => img.decode().catch(() => {}))); printWindow.focus(); printWindow.print(); };
    printWindow.document.open(); printWindow.document.write(report); printWindow.document.close();
  }
  fields.forEach(field => { field.addEventListener('input', save); field.addEventListener('change', save); });
  group.addEventListener('change', load);
  document.getElementById('exportBtn').addEventListener('click', () => exportHtml('all'));
  document.getElementById('exportBtn').textContent = '匯出 1A–3A 總成果 PDF';
  document.querySelectorAll('.task-grid > .phase-card').forEach((card, index) => {
    const actions = document.createElement('div');
    actions.className = 'phase-export-actions';
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'pdf-btn';
    button.textContent = `匯出 ${index + 1}A 階段成果 PDF`;
    button.addEventListener('click', () => exportHtml(String(index + 1)));
    actions.append(button);
    if (index === 2) {
      const total = document.createElement('button'); total.type = 'button'; total.className = 'pdf-btn';
      total.textContent = '匯出 1A–3A 總成果 PDF'; total.addEventListener('click', () => exportHtml('all')); actions.append(total);
    }
    const hint = document.createElement('p'); hint.textContent = '按下後於列印視窗選擇「另存為 PDF」。成果包含組別與成員。';
    actions.append(hint); card.append(actions);
  });
  const reading = document.createElement('div'); reading.className = 'reading-controls';
  reading.innerHTML = '<label for="readingSize">字體</label><select id="readingSize"><option value="100">一般字體</option><option value="130">放大字體</option></select><label for="readingTheme">背景</label><select id="readingTheme"><option value="light">淺色</option><option value="dark">深色</option></select>';
  document.querySelector('header').after(reading);
  const size = reading.querySelector('select');
  size.value = Number(localStorage.getItem('ebn-reading-size')) > 100 ? '130' : '100';
  const resize = () => { document.documentElement.style.fontSize = `${18 * Number(size.value) / 100}px`; localStorage.setItem('ebn-reading-size', size.value); };
  size.addEventListener('change', resize); resize();
  const theme = document.getElementById('readingTheme');
  theme.value = localStorage.getItem('ebn-reading-theme') === 'dark' ? 'dark' : 'light';
  const setTheme = () => { document.documentElement.dataset.theme = theme.value; localStorage.setItem('ebn-reading-theme', theme.value); };
  theme.addEventListener('change', setTheme); setTheme();
  document.getElementById('backupBtn').addEventListener('click', () => { save(); download(`實證護理概論_${group.value}_備份.json`, 'application/json', JSON.stringify({ group: group.value, ...JSON.parse(localStorage.getItem(storageKey())) }, null, 2)); });
  load();
})();


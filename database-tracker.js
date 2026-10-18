(() => {
  const databases = [
    ['pubmed', 'PubMed', 'MeSH／Publication type'],
    ['cochrane', 'Cochrane Library', 'MeSH／Cochrane 搜尋管理員'],
    ['embase', 'Embase', 'Emtree／Study type'],
    ['ceps', '華藝 CEPS', '中文關鍵詞／欄位檢索']
  ];
  const steps = [
    ['1', 'P：族群／問題 同義字群', '例：(older adult* OR elderly OR aged)'],
    ['2', 'I：介入 同義字群', '例：(exercise OR "physical activity")'],
    ['3', 'C／O／研究設計群（需要時）', '例：(usual care OR control OR randomized controlled trial)'],
    ['4', '核心布林組合', '以檢索歷程號組合：#1 AND #2 [AND #3]'],
    ['5', '最終可重現搜尋式', '貼上資料庫實際執行的完整字串（含括號、AND/OR、欄位標籤與限制）']
  ];
  const filterOptions = (key, vocab) => `
    <div class="filter-box">
      <h5>篩選條件與過程 <span>請勾選實際套用項目；各資料庫用其相對應的介面選項</span></h5>
      <div class="filter-row"><label>出版年</label><select data-field="${key}YearStart"><option value="">起始年</option>${Array.from({length: 16}, (_,i) => `<option>${2026-i}</option>`).join('')}</select><span>至</span><select data-field="${key}YearEnd"><option value="">結束年</option>${Array.from({length: 16}, (_,i) => `<option>${2026-i}</option>`).join('')}</select></div>
      <div class="check-row"><label>語言</label><label><input type="checkbox" data-field="${key}LangZh">中文</label><label><input type="checkbox" data-field="${key}LangEn">英文</label><label><input type="checkbox" data-field="${key}LangOther">其他／不限</label></div>
      <div class="check-row"><label>實證／研究類型</label><label><input type="checkbox" data-field="${key}RCT">RCT</label><label><input type="checkbox" data-field="${key}SRMA">系統性回顧／統合分析</label><label><input type="checkbox" data-field="${key}Guideline">臨床指引</label><label><input type="checkbox" data-field="${key}EvidenceSummary">實證摘要</label></div>
      <div class="check-row"><label>其他</label><label><input type="checkbox" data-field="${key}Human">Human</label><label><input type="checkbox" data-field="${key}FullText">全文可得</label><input data-field="${key}OtherFilter" placeholder="其他限制／排除條件"></div>
      <p class="filter-note">${vocab}：請在「修訂／決策」欄說明何時加入限制、為何保留或移除。</p>
    </div>`;
  const cardMarkup = (key, name, vocab) => `
    <section class="db-audit" aria-label="${name} 搜尋策略">
      <div class="db-audit-head"><div><p class="eyebrow">STEP 2 · ${name.toUpperCase()}</p><h4>${name}：可追溯的實際搜尋過程</h4></div><label class="strategy-mode">搜尋策略模式<select data-field="${key}Mode"><option value="title-abstract">標題／摘要＋主題詞</option><option value="controlled">主題詞／索引詞優先</option><option value="free-text">自由詞優先</option><option value="sensitive">敏感度優先（較寬）</option><option value="specific">精確度優先（較窄）</option></select></label></div>
      <p class="actual-help"><strong>「實際搜尋式」要輸入什麼？</strong> 請貼上你在 <em>${name}</em> 執行的完整搜尋字串或歷程組合，不是只列 PICO 關鍵字。要保留括號、AND／OR／NOT、欄位標籤或主題詞，以及最後使用的限制條件，讓老師可重現。</p>
      <div class="audit-scroll"><table class="audit-table"><thead><tr><th>歷程</th><th>實際搜尋式／歷程號</th><th>結果筆數</th><th>修訂理由／決策</th></tr></thead><tbody>${steps.map(([num, label, hint]) => `<tr><th><span>#${num}</span>${label}</th><td><textarea data-field="${key}Step${num}Query" placeholder="${hint}"></textarea></td><td><input type="number" min="0" data-field="${key}Step${num}Hits" placeholder="0"></td><td><textarea data-field="${key}Step${num}Note" placeholder="例：增加同義字、改欄位、加入或移除限制"></textarea></td></tr>`).join('')}</tbody></table></div>
      ${filterOptions(key, vocab)}
      <div class="export-record"><label>最終匯出筆數 <input type="number" min="0" data-field="${key}Exported" placeholder="供跨資料庫 PRISMA 彙整"></label><label>搜尋日期 <input type="date" data-field="${key}Date"></label><label>證據／截圖或匯出檔說明 <input data-field="${key}Proof" placeholder="例：檢索歷程截圖、RIS/CSV 檔名"></label></div>
    </section>`;
  document.querySelectorAll('.database-card').forEach((card, i) => {
    const [key, name, vocab] = databases[i] || [];
    if (key) { card.innerHTML = cardMarkup(key, name, vocab); card.dataset.database = key; }
  });
  const prisma = document.querySelector('.prisma-build');
  if (!prisma) return;
  const oldGrid = prisma.querySelector('.prisma-grid');
  if (oldGrid) oldGrid.remove();
  prisma.querySelector(':scope > label')?.remove();
  const summary = document.createElement('section');
  summary.className = 'prisma-consolidated';
  summary.innerHTML = `<p class="eyebrow">STEP 3 · CROSS-DATABASE PRISMA</p><h4>所有資料庫匯集後的 PRISMA 追蹤</h4><p>Step 2 是各資料庫的可重現檢索歷程；此處會將每一個「最終匯出筆數」相加，再進入去重、篩選與納入流程。</p><div class="prisma-source-grid">${databases.map(([key,name]) => `<label>${name}<output id="${key}Total">0</output><small>來自 Step 2 最終匯出筆數</small></label>`).join('')}<label>資料庫合計<output id="prismaDatabaseTotal">0</output><small>四個資料庫自動加總</small></label><label>其他來源<input type="number" min="0" data-field="prismaOtherSources" placeholder="手動新增"></label><label>識別總數<output id="prismaIdentifiedTotal">0</output><small>資料庫合計＋其他來源</small></label></div><div class="prisma-flow-fields"><label>移除重複文獻<input type="number" min="0" data-field="prismaDuplicatesRemoved"></label><label>去重後待篩選<output id="prismaAfterDedupe">0</output></label><label>標題／摘要階段排除<input type="number" min="0" data-field="prismaTitleExcluded"></label><label>全文評估篇數<input type="number" min="0" data-field="prismaFullTextAssessed"></label><label>全文排除篇數<input type="number" min="0" data-field="prismaFullTextExcluded"></label><label>最終納入篇數<input type="number" min="0" data-field="prismaIncluded"></label></div><label class="prisma-reasons">全文排除理由與流程圖檔案<textarea data-field="prisma" placeholder="例：非目標族群 n=__；非目標介入 n=__；無全文 n=__。可附上 PRISMA 流程圖連結／檔名。"></textarea></label></section>`;
  prisma.append(summary);
  const prismaText = summary.querySelector('[data-field="prisma"]');
  prismaText.placeholder = '貼上PRISMA截圖';
  prismaText.closest('label').firstChild.textContent = 'PRISMA 截圖／排除理由備註';
  document.querySelectorAll('[data-field="prisma"]').forEach(field => { if (field !== prismaText) field.closest('label')?.remove(); });
  const value = field => Number(document.querySelector(`[data-field="${field}"]`)?.value || 0);
  const update = () => {
    const total = databases.reduce((sum, [key]) => {
      const n = value(`${key}Exported`); const out = document.getElementById(`${key}Total`); if (out) out.textContent = n; return sum + n;
    }, 0);
    const identified = total + value('prismaOtherSources');
    const after = Math.max(0, identified - value('prismaDuplicatesRemoved'));
    document.getElementById('prismaDatabaseTotal').textContent = total;
    document.getElementById('prismaIdentifiedTotal').textContent = identified;
    document.getElementById('prismaAfterDedupe').textContent = after;
  };
  document.addEventListener('input', update);
  document.addEventListener('workspace:loaded', update);
  update();
})();


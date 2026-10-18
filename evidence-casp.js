(() => {
  const card = document.querySelector('.task-card.phase-card:last-of-type');
  if (!card || card.dataset.caspReady) return;
  card.dataset.caspReady = 'true';
  const questions = [
    ['A', '研究是否針對明確界定的研究問題？', 'Did the study address a clearly formulated research question?'],
    ['A', '受試者分派至介入措施是否採隨機化？', 'Was the assignment of participants to interventions randomised?'],
    ['A', '所有進入研究的受試者，在研究結束時是否都被交代清楚？', 'Were all participants who entered the study accounted for at its conclusion?'],
    ['B', '受試者、研究人員及結果評估／分析者是否盲化？', 'Were participants, investigators and outcome assessors/analysts blinded?'],
    ['B', 'RCT 開始時，各研究組別是否相似？', 'Were the study groups similar at the start of the randomised controlled trial?'],
    ['B', '除實驗介入外，各組是否接受相同程度的照護？', 'Apart from the experimental intervention, did each study group receive the same level of care?'],
    ['C', '介入效果是否有完整報告？', 'Were the effects of intervention reported comprehensively?'],
    ['C', '介入／治療效果估計值的精確性是否有報告？', 'Was the precision of the estimate of the intervention or treatment effect reported?'],
    ['C', '實驗介入的效益是否大於傷害與成本？', 'Do the benefits of the experimental intervention outweigh the harms and costs?'],
    ['D', '結果能否套用至你的在地族群／情境？', 'Can the results be applied to your local population/in your context?'],
    ['D', '相較於既有介入，實驗介入是否能為照護對象帶來更高價值？', 'Would the experimental intervention provide greater value to the people in your care than existing interventions?']
  ];
  const scale = document.createElement('section');
  scale.className = 'evidence-reference';
  scale.innerHTML = `<p class="eyebrow">REFERENCE · OXFORD OCEBM 2011</p><h4>Oxford OCEBM 2011 證據等級速查</h4><p class="reference-note">採用 OCEBM 2011 的 Level 1–5。下表是「治療效益」（Treatment Benefits）問題的中文摘要；診斷、預後、傷害、篩檢等問題請查閱官方完整量表。</p><div class="oxford-grid"><div><h5>治療效益：這項介入是否有效？</h5><table><thead><tr><th>2011 證據等級</th><th>研究設計</th></tr></thead><tbody><tr><th>Level 1</th><td>隨機試驗的系統性回顧，或 N-of-1 隨機試驗</td></tr><tr><th>Level 2</th><td>隨機試驗，或效果極顯著的觀察性研究</td></tr><tr><th>Level 3</th><td>非隨機對照世代／追蹤研究</td></tr><tr><th>Level 4</th><td>病例系列、病例對照研究，或歷史對照研究</td></tr><tr><th>Level 5</th><td>以機轉為基礎的推論</td></tr></tbody></table></div><div class="ocebm-2011-note"><h5>如何形成照護建議？</h5><p>OCEBM 2011 證據等級不提供 A–D 建議等級，也不會自動產生建議強度。</p><p>請綜合研究品質、臨床重要性、效益與傷害、病人價值與偏好，以及本地資源，說明照護建議與理由。</p><p>等級可因品質、不精確、間接性、研究結果不一致或絕對效果很小而調降；效果大或極大時可調升。</p><a href="https://www.cebm.ox.ac.uk/files/levels-of-evidence/cebm-levels-of-evidence-2-1.pdf" target="_blank" rel="noopener">查看 2011 官方完整量表（PDF） ↗</a></div></div>`;
  const casp = document.createElement('section');
  casp.className = 'casp-2024';
  casp.innerHTML = `<div class="casp-heading"><div><p class="eyebrow">CASP 2024 · RCT APPRAISAL</p><h4>CASP 2024 RCT 批判性評讀表</h4><p>逐題選擇 <strong>Yes／No／Can't tell</strong>，系統會自動彙總；請於每題備註欄留下頁碼或理由。</p></div><a href="https://casp-uk.net/casp-checklists/CASP-checklist-randomised-controlled-trials-RCT-2024.pdf" target="_blank" rel="noopener">CASP 2024 原版 ↗</a></div><div class="casp-meta"><label>評讀者<input data-field="caspReviewer" placeholder="姓名"></label><label>文章題名<input data-field="caspPaperTitle" placeholder="Paper title"></label><label>作者／年份<input data-field="caspAuthor" placeholder="Author, year"></label><label>評讀日期<input type="date" data-field="caspDate"></label></div><div class="casp-scroll"><table class="casp-table"><thead><tr><th>題號</th><th>CASP 2024 中英文題目</th><th>判讀</th><th>頁碼／理由／備註</th></tr></thead><tbody>${questions.map(([section, zh, en], i) => `<tr><th><span>Section ${section}</span>${i + 1}</th><td><strong>${zh}</strong><small>${en}</small></td><td class="answer"><label><input type="radio" name="casp${i+1}" value="Yes" data-field="caspQ${i+1}"> Yes</label><label><input type="radio" name="casp${i+1}" value="No" data-field="caspQ${i+1}"> No</label><label><input type="radio" name="casp${i+1}" value="Can't tell" data-field="caspQ${i+1}"> Can't tell</label></td><td><textarea data-field="caspQ${i+1}Note" placeholder="例：p. 4；未說明分派隱蔽"></textarea></td></tr>`).join('')}</tbody></table></div><div class="casp-summary"><div><b id="caspYes">0</b><span>Yes</span></div><div><b id="caspNo">0</b><span>No</span></div><div><b id="caspUnknown">0</b><span>Can't tell</span></div><label>評讀總結<textarea data-field="caspSummary" placeholder="請整合研究效度、結果重要性與臨床適用性。"></textarea></label></div><p class="casp-credit">題目依 CASP Checklist: Randomised Controlled Trials (2024)，CC BY-NC-SA 4.0；中文為本課程翻譯。</p></section>`;
  card.append(scale, casp);
  const ocebm = document.createElement('section');
  ocebm.className = 'evidence-reference';
  ocebm.innerHTML = `<p class="eyebrow">OCEBM LEVELS OF EVIDENCE · 2011</p><h4>OCEBM 2011 官方參考</h4><p><a href="https://www.cebm.ox.ac.uk/resources/levels-of-evidence/ocebm-levels-of-evidence" target="_blank" rel="noopener">開啟 OCEBM Levels of Evidence 官方網頁與量表 ↗</a></p><p><a href="https://www.cebm.ox.ac.uk/resources/levels-of-evidence/levels-of-evidence-introductory-document" target="_blank" rel="noopener">閱讀 2011 官方使用說明 ↗</a></p><p>來源：OCEBM Levels of Evidence Working Group. The Oxford 2011 Levels of Evidence。請搭配官方使用說明，依臨床問題類型判定等級。</p>`;
  scale.after(ocebm);
  const evidenceField=card.querySelector('[data-field="evidence"]');
  if(evidenceField){evidenceField.placeholder='臨床問題類型：\nOCEBM 2011 Level（1–5）：\n分級及升降級理由：\n照護建議與理由（不自動換算為 A–D）：';evidenceField.closest('label').firstChild.textContent='OCEBM 2011 證據等級與照護建議';}
  const introduction=card.querySelector(':scope > p');
  if(introduction)introduction.textContent='依 CASP 完成 RCT 或 SR／MA 評讀，判定 OCEBM 2011 證據等級，並整合 V／I／P 提出照護建議。';
  const vipFields = (key) => `<div class="vip-fields"><h5>V／I／P 評讀總結</h5><label>V · Validity｜效度<textarea data-field="${key}V" placeholder="研究方法是否可信？說明偏差風險、方法優點、限制與未交代事項，附原文頁碼。"></textarea></label><label>I · Importance｜結果重要性<textarea data-field="${key}I" placeholder="填入效應量、95% CI、絕對效益／臨床重要差異；說明效果大小、精確性與臨床意義。"></textarea></label><label>P · Practice applicability｜臨床適用性<textarea data-field="${key}P" placeholder="結果能否用於本組 PICO 族群？考量病人偏好、效益與傷害、成本、資源及執行條件，提出照護建議。"></textarea></label></div>`;
  const oldSummary = casp.querySelector('[data-field="caspSummary"]').closest('label');
  oldSummary.hidden = true;
  casp.insertAdjacentHTML('beforeend', vipFields('rctVip'));
  const srQuestions = [
    ['1', 'A', '研究問題是否明確界定？', 'Clear review question?'],
    ['2', 'A', '是否搜尋能回答研究問題的適當研究設計？', 'Appropriate study designs sought?'],
    ['3', 'B', '是否可能納入所有相關原始研究？', 'All relevant studies included?'],
    ['3a', 'B', '原始研究搜尋是否完整且可重現？', 'Comprehensive primary-study search?'],
    ['3b', 'B', '題名與摘要初篩是否嚴謹？', 'Rigorous initial screening?'],
    ['3c', 'B', '全文納入與排除決策是否符合預設條件？', 'Sound full-text study selection?'],
    ['3d', 'B', '是否以流程圖清楚呈現搜尋與篩選數量？', 'Transparent search-flow reporting?'],
    ['4', 'B', '是否適當評估納入研究的效度與方法品質？', 'Primary-study validity assessed?'],
    ['5', 'B', '資料擷取與呈現是否適當透明？', 'Transparent extraction and presentation?'],
    ['5a', 'B', '資料擷取流程是否嚴謹？', 'Rigorous data extraction?'],
    ['5b', 'B', '研究特徵與個別結果是否清楚呈現？', 'Clear study characteristics and findings?'],
    ['6', 'C', '合併分析方法是否適當？', 'Appropriate pooled analysis?'],
    ['6.1', 'C', '次族群分析的方法是否適當？', 'Sound subgroup-analysis methods?'],
    ['6.2', 'C', '統合迴歸的方法是否適當？', 'Sound meta-regression methods?'],
    ['7', 'C', '是否完整討論限制及其對結果的影響？', 'Limitations adequately interpreted?'],
    ['7.1', 'C', '是否適當討論次族群分析的限制？', 'Subgroup limitations discussed?'],
    ['7.2', 'C', '是否適當討論統合迴歸的限制？', 'Meta-regression limitations discussed?'],
    ['8', 'C', '介入效益是否大於潛在傷害、負擔及資源需求？', 'Benefits justify harms and resources?'],
    ['9', 'D', '結果是否適用於本地族群與照護情境？', 'Applicable to local care?'],
    ['10', 'E', '採用結果能否為照護對象帶來額外價值？', 'Added value if implemented?'],
    ['結論', 'E', '這篇回顧能否支持實證決策？', 'Useful for evidence-based decisions?']
  ];
  const srma = document.createElement('section'); srma.className = 'casp-2024 srma-appraisal';
  const srUrl = 'https://casp-uk.net/casp-checklists/CASP-checklist-systematic-reviews-meta-analysis-rct-checklist-2024.pdf';
  srma.innerHTML = `<div class="casp-heading"><div><p class="eyebrow">CASP 2024 · SR &amp; MA</p><h4>系統性回顧與統合分析評讀表（RCT 研究）</h4><p>本表對應 CASP 2024 RCT 系統性回顧／統合分析版，含 10 個主題、10 個細項與結論。中英文為教學轉述，完整題意與提示請對照原版；若文章未進行某項分析，請於備註說明，依原文資訊作答。</p></div><a href="${srUrl}" target="_blank" rel="noopener">CASP 2024 SR／MA 原版 ↗</a></div><div class="casp-meta"><label>評讀者<input data-field="srReviewer"></label><label>文章題名<input data-field="srTitle"></label><label>作者／年份<input data-field="srAuthor"></label><label>評讀日期<input type="date" data-field="srDate"></label></div><div class="casp-scroll"><table class="casp-table"><thead><tr><th>題號</th><th>中英文評讀項目（教學轉述）</th><th>判讀</th><th>原文頁碼／理由</th></tr></thead><tbody>${srQuestions.map(([id,section,zh,en],i)=>`<tr><th><span>Section ${section}</span>${id}</th><td><strong>${zh}</strong><small>${en}</small></td><td class="answer">${['Yes','No',"Can't tell"].map(answer=>`<label><input type="radio" name="srQ${i}" data-field="srQ${i}" value="${answer}"> ${answer}</label>`).join('')}</td><td><textarea data-field="srQ${i}Note" placeholder="證據、頁碼、限制；未執行該分析時請說明"></textarea></td></tr>`).join('')}</tbody></table></div><div class="sr-response-count" role="status" aria-live="polite"></div><p class="reference-note">數量為作答進度與回應分布，不作為品質總分；主題、細項與結論分開統計。</p>${vipFields('srVip')}<p class="casp-credit">改編自 CASP (2024), Systematic reviews with meta-analysis of RCTs checklist。中英教學轉述與改編部分採 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>；未經 CASP 審定。</p>`;
  card.append(srma);
  const vipReport = (data,key) => ['V','I','P'].map(letter=>`${letter}：${data[key+letter] || '尚未填寫'}`).join('\n');
  window.buildSrmaReport = (data) => {
    const main = srQuestions.map((q,i)=>({q,i})).filter(({q})=>/^\d+$/.test(q[0]));
    const counts = ['Yes','No',"Can't tell"].map(answer=>`${answer} ${main.filter(({i})=>data['srQ'+i]===answer).length}`).join('；');
    return `文章：${data.srTitle || '尚未填寫'}\n作者：${data.srAuthor || ''}\n評讀者：${data.srReviewer || ''}\n日期：${data.srDate || ''}\n主題回應分布（10 題）：${counts}\n${srQuestions.map(([id,,zh,en],i)=>`${id}. ${zh} / ${en}\n${data['srQ'+i] || '未作答'}；${data['srQ'+i+'Note'] || ''}`).join('\n')}\nV／I／P 總結\n${vipReport(data,'srVip')}\n來源：${srUrl}\n中英文為教學轉述／改編，CC BY-NC-SA 4.0。`;
  };
  window.buildRctVipReport = (data) => vipReport(data,'rctVip');
  const refresh = () => {
    const answers = [...casp.querySelectorAll('input[type="radio"][data-field]:checked')].map(x => x.value);
    document.getElementById('caspYes').textContent = answers.filter(x => x === 'Yes').length;
    document.getElementById('caspNo').textContent = answers.filter(x => x === 'No').length;
    document.getElementById('caspUnknown').textContent = answers.filter(x => x === "Can't tell").length;
    const countSet = (predicate) => {
      const items = srQuestions.map((q,i)=>({q,i})).filter(({q})=>predicate(q[0]));
      const selected = items.map(({i})=>srma.querySelector(`input[name="srQ${i}"]:checked`)?.value);
      return `${['Yes','No',"Can't tell"].map(a=>`${a} ${selected.filter(v=>v===a).length}`).join(' ／ ')} ／ 未作答 ${selected.filter(v=>!v).length}`;
    };
    srma.querySelector('.sr-response-count').textContent = `10 個主題：${countSet(id=>/^\d+$/.test(id))}\n10 個細項：${countSet(id=>/\d[.a-z]/.test(id))}\n結論：${countSet(id=>id==='結論')}`;
  };
  document.addEventListener('change', refresh);
  document.addEventListener('workspace:loaded', refresh);
  refresh();
})();


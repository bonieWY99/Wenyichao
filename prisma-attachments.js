(() => {
  const target = document.querySelector('.prisma-consolidated');
  if (!target) return;
  const group = document.getElementById('groupSelect');
  const panel = document.createElement('section');
  panel.className = 'prisma-attachments'; panel.tabIndex = 0;
  panel.setAttribute('aria-label', 'PRISMA 檔案與截圖附件');
  panel.innerHTML = `<h4>貼上PRISMA截圖，或加入完成的檔案</h4><p>支援截圖 PNG／JPG、Word（.doc／.docx）、PDF；每個檔案上限 20 MB。</p><label class="attachment-picker">＋ 選擇 PRISMA 截圖／Word／PDF<input id="prismaFileInput" type="file" multiple accept=".png,.jpg,.jpeg,.doc,.docx,.pdf"></label><p>也可以點選此區，按 Ctrl+V 貼上截圖。</p><p class="attachment-storage-note">附件依組別保存在這台裝置的瀏覽器，未上傳至教師端。換裝置前請下載原檔；JSON 備份不包含附件。截圖可隨成果 PDF 列印，Word／PDF 原檔請另行下載繳交。</p><p class="attachment-status" role="status" aria-live="polite"></p><div class="attachment-list"></div>`;
  target.append(panel);
  const input = panel.querySelector('input');
  const status = panel.querySelector('.attachment-status');
  const list = panel.querySelector('.attachment-list');
  let urls = [], refreshId = 0;
  const dbPromise = new Promise((resolve,reject) => {
    if (!window.indexedDB) return reject(new Error('此瀏覽器無法儲存附件'));
    const request = indexedDB.open('ebn-prisma-attachments',1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('files',{keyPath:'id'});
      store.createIndex('group','group',{unique:false});
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('請關閉其他課程頁面後再試'));
  });
  const records = async name => {
    const db=await dbPromise;
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('files','readonly');
      const req=tx.objectStore('files').index('group').getAll(name);
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
  };
  const mutate = async (method,value) => {
    const db=await dbPromise;
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('files','readwrite');
      tx.objectStore('files')[method](value);
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
  };
  const imageFile = record => /\.(png|jpe?g)$/i.test(record.name) && /^image\/(png|jpeg)$/.test(record.file.type);
  async function refresh() {
    const id=++refreshId,name=group.value;
    try {
      const files=await records(name);
      if(id!==refreshId || name!==group.value)return;
      urls.forEach(url=>URL.revokeObjectURL(url));urls=[];list.replaceChildren();
      if(!files.length){const empty=document.createElement('p');empty.textContent='此組尚未加入 PRISMA 附件。';list.append(empty);}
      files.forEach(record=>{
        const item=document.createElement('article');item.className='attachment-item';
        const info=document.createElement('div');
        const title=document.createElement('strong');title.textContent=record.name;
        const size=document.createElement('small');size.textContent=`${(record.file.size/1024/1024).toFixed(2)} MB・${name}`;
        info.append(title,size);item.append(info);
        const url=URL.createObjectURL(record.file);urls.push(url);
        if(imageFile(record)){const img=document.createElement('img');img.src=url;img.alt=`PRISMA 截圖：${record.name}`;item.append(img);}
        const actions=document.createElement('div');actions.className='attachment-actions';
        const download=document.createElement('a');download.href=url;download.download=record.name;download.textContent='下載原檔';
        const remove=document.createElement('button');remove.type='button';remove.textContent='移除此附件';
        remove.addEventListener('click',async()=>{try{await mutate('delete',record.id);status.textContent=`已移除 ${record.name}`;await refresh();}catch{status.textContent='移除失敗，請稍後再試。';}});
        actions.append(download,remove);item.append(actions);list.append(item);
      });
    } catch { input.disabled=true;status.textContent='此瀏覽器無法保存附件，請保留原檔並隨作業另行繳交。'; }
  }
  async function addFiles(files) {
    const name=group.value;let added=0;const failed=[];
    input.disabled=true;status.textContent='正在保存附件…';
    try {
      for(const file of files){
        if(!/\.(png|jpe?g|docx?|pdf)$/i.test(file.name)){failed.push(`${file.name}：不支援的格式`);continue;}
        if(file.size>20*1024*1024){failed.push(`${file.name}：超過 20 MB`);continue;}
        await mutate('put',{id:crypto.randomUUID(),group:name,name:file.name,file,createdAt:Date.now()});added++;
      }
      status.textContent=`已為${name}保存 ${added} 個附件。${failed.join('；')}`;
    }catch{status.textContent=`已保存 ${added} 個；其餘附件未保存，請檢查瀏覽器儲存空間並保留原檔。`;}
    finally{input.disabled=false;input.value='';await refresh();}
  }
  input.addEventListener('change',()=>addFiles([...input.files]));
  const paste = event => {
    const images=[...(event.clipboardData?.files||[])].filter(f=>/^image\/(png|jpeg)$/.test(f.type));
    if(!images.length)return;
    event.preventDefault();
    addFiles(images.map((file,i)=>new File([file],`PRISMA截圖_${Date.now()}_${i+1}.${file.type==='image/png'?'png':'jpg'}`,{type:file.type})));
  };
  panel.addEventListener('paste',paste);
  document.querySelector('[data-field="prisma"]')?.addEventListener('paste',paste);
  group.addEventListener('change',()=>{status.textContent='';refresh();});
  const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asDataUrl = file => new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
  window.buildPrismaAttachmentsReport = async name => {
    const files=await records(name);if(!files.length)return '';
    const content=await Promise.all(files.map(async record=>`<div><h4>${escape(record.name)}</h4>${imageFile(record)?`<img src="${await asDataUrl(record.file)}" alt="PRISMA 截圖" style="max-width:100%;max-height:240mm;object-fit:contain">`:'<p>Word／PDF 附件原檔請另行繳交；此處列出檔名。</p>'}</div>`));
    return '<h3>PRISMA 截圖與附件</h3>'+content.join('');
  };
  refresh();
})();


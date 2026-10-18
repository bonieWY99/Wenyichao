(() => {
  const cards=[...document.querySelectorAll('.task-grid > .phase-card')];
  if(!cards.length)return;
  const jump=document.createElement('nav');jump.className='workspace-jump';jump.setAttribute('aria-label','1A 至 3A 學習任務分頁');jump.setAttribute('role','tablist');
  jump.innerHTML='<span>學習任務</span>';
  const names=['1A · 提出問題','2A · 搜尋證據','3A · 評讀應用'];
  const tabs=[];
  const progress=document.createElement('p');progress.className='task-page-progress';progress.setAttribute('role','status');progress.setAttribute('aria-live','polite');
  const choose=(index,{historyMode=null,focus=false,scroll=false}={})=>{
    cards.forEach((card,i)=>{card.hidden=i!==index;tabs[i].setAttribute('aria-selected',String(i===index));tabs[i].tabIndex=i===index?0:-1;});
    progress.textContent=`第 ${index+1}／3 頁・${names[index]}｜切換分頁會保留填寫內容`;
    if(historyMode)history[historyMode](null,'',`#task-${index+1}a`);
    if(focus)tabs[index].focus();
    if(scroll)cards[index].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  };
  cards.forEach((card,i)=>{
    card.id=`task-${i+1}a`;
    card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',`tab-${i+1}a`);
    const a=document.createElement('a');a.href=`#${card.id}`;a.id=`tab-${i+1}a`;a.textContent=names[i];a.setAttribute('role','tab');a.setAttribute('aria-controls',card.id);
    a.addEventListener('click',event=>{event.preventDefault();choose(i,{historyMode:'pushState',scroll:true});});
    a.addEventListener('keydown',event=>{
      const keys=['ArrowRight','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;
      event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?cards.length-1:(i+(event.key==='ArrowRight'?1:cards.length-1))%cards.length;
      choose(next,{historyMode:'pushState',focus:true});
    });
    tabs.push(a);jump.append(a);
    const pageNav=document.createElement('nav');pageNav.className='phase-page-nav';pageNav.setAttribute('aria-label',`${i+1}A 前後分頁`);
    if(i>0){const previous=document.createElement('button');previous.type='button';previous.textContent=`← 上一頁：${i}A`;previous.addEventListener('click',()=>choose(i-1,{historyMode:'pushState',focus:true,scroll:true}));pageNav.append(previous);}
    if(i<cards.length-1){const next=document.createElement('button');next.type='button';next.textContent=`下一頁：${i+2}A →`;next.addEventListener('click',()=>choose(i+1,{historyMode:'pushState',focus:true,scroll:true}));pageNav.append(next);}
    card.append(pageNav);
  });
  document.querySelector('.team-card').after(jump);
  jump.after(progress);
  const boolean=document.querySelector('.boolean-tracker');
  if(boolean)cards[1].insertBefore(boolean,cards[1].querySelector('.phase-export-actions'));
  const fromHash=()=>{const match=location.hash.match(/^#task-([123])a$/);if(match)choose(Number(match[1])-1);};
  choose(location.hash.match(/^#task-([123])a$/)?Number(location.hash.match(/^#task-([123])a$/)[1])-1:0);
  window.addEventListener('hashchange',fromHash);window.addEventListener('popstate',fromHash);
})();


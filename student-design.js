(() => {
  const cards=[...document.querySelectorAll('.task-grid > .phase-card')];
  if(!cards.length)return;
  const jump=document.createElement('nav');jump.className='workspace-jump';jump.setAttribute('aria-label','小組任務快速導覽');
  jump.innerHTML='<span>學習任務</span>';
  const names=['1A · 提出問題','2A · 搜尋證據','3A · 評讀應用'];
  cards.forEach((card,i)=>{
    card.id=`task-${i+1}a`;
    const a=document.createElement('a');a.href=`#${card.id}`;a.textContent=names[i];jump.append(a);
  });
  document.querySelector('.team-card').after(jump);
})();


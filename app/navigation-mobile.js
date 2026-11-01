/* ShiftMemories Web V5 — balayage horizontal mobile (navigateur et PWA).
   Protège les champs de formulaire, les dialogues et les zones défilantes. */
(() => {
  'use strict';
  const pages = ['dashboard', 'calendar', 'days', 'reports'];
  let start = null;
  const blockedSelector = 'input,textarea,select,button,a,[contenteditable],.modal-backdrop,.modal-panel,.review-table,#drop-zone,.sidebar';
  function blocked(target) {
    if (!(target instanceof Element)) return true;
    return Boolean(target.closest(blockedSelector));
  }
  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || blocked(event.target)) { start = null; return; }
    // Ne pas naviguer si une modale est ouverte, ou en cas de zoom navigateur.
    if (document.getElementById('modal-root')?.childElementCount || window.visualViewport?.scale > 1.05) { start = null; return; }
    start = {x:event.touches[0].clientX, y:event.touches[0].clientY, time:Date.now()};
  }, {passive:true});
  document.addEventListener('touchend', event => {
    if (!start || event.changedTouches.length !== 1 || blocked(event.target)) {start=null;return;}
    const dx = event.changedTouches[0].clientX-start.x;
    const dy = event.changedTouches[0].clientY-start.y;
    const dt = Date.now()-start.time;
    start = null;
    if (Math.abs(dx) < 75 || Math.abs(dx) <= Math.abs(dy)*1.6 || dt > 900) return;
    if (typeof route !== 'string' || typeof navigate !== 'function') return;
    const current = pages.indexOf(route);
    if (current === -1) return;
    const next = current + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < pages.length) navigate(pages[next]);
  }, {passive:true});
  document.addEventListener('touchcancel', () => { start = null; }, {passive:true});
})();

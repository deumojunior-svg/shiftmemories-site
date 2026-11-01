/* Installation helper: the iOS route uses Add to Home Screen; Android can prompt if supported. */
(() => {
  let deferred = null;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferred = event;
    update();
  });
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const ios = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
  function showGuide(){
    const text = ios() ? 'Sur iPhone : ouvrez ce site dans Safari, touchez Partager, puis « Sur l’écran d’accueil » et Ajouter.' : 'Dans le menu du navigateur, choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».';
    alert(text);
  }
  function update(){
    let btn = document.getElementById('sm-install-action');
    if (standalone()) { if(btn) btn.remove(); return; }
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'sm-install-action';
      btn.type = 'button';
      btn.className = 'btn btn-outline';
      btn.setAttribute('aria-label','Installer ShiftMemories');
      btn.textContent = '↧ Installer';
      btn.style.cssText = 'position:fixed;top:58px;right:13px;z-index:18;box-shadow:0 8px 24px #142f2920;font-size:11px;padding:10px 12px;';
      document.body.appendChild(btn);
      btn.addEventListener('click', async () => {
        if (deferred) {
          deferred.prompt();
          try{ await deferred.userChoice; } catch(_e) {}
          deferred=null;
          update();
        } else showGuide();
      });
    }
  }
  document.addEventListener('DOMContentLoaded', () => {if(!standalone()) update();});
  window.addEventListener('appinstalled', () => {deferred=null; update();});
})();

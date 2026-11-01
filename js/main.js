(function(){
  var REPO='deumojunior-svg/shiftmemories-site', ASSET='ShiftMemories-android.apk';
  var sel=document.getElementById('lang');
  function pick(){
    var s=null;try{s=localStorage.getItem('sm-lang')}catch(e){}
    if(s&&I18N[s])return s;
    var n=(navigator.language||'fr').slice(0,2).toLowerCase();
    return I18N[n]?n:'en';
  }
  var current='fr';
  function apply(l){
    current=l;var d=I18N[l];
    document.documentElement.lang=l;
    document.querySelectorAll('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n');if(d[k]!=null)el.innerHTML=d[k]});
    sel.value=l;renderMeta();
  }
  sel.addEventListener('change',function(){try{localStorage.setItem('sm-lang',sel.value)}catch(e){}apply(sel.value)});
  var rel=null;
  function renderMeta(){
    var m=document.getElementById('apk-meta');if(!rel||!m)return;
    var d=I18N[current];var mb=(rel.size/1048576).toFixed(1).replace('.',current==='en'?'.':',');
    m.textContent=d.apkVersion+' '+rel.tag+' · '+mb+' MB';m.hidden=false;
  }
  function setApk(){
    var btn=document.getElementById('apk-btn');if(btn)btn.href=rel.url;
    var hero=document.querySelector('[data-apk-hero]');if(hero)hero.href=rel.url;
    renderMeta();
  }
  fetch('https://api.github.com/repos/'+REPO+'/releases/latest',{headers:{Accept:'application/vnd.github+json'}})
    .then(function(r){return r.ok?r.json():null}).then(function(j){
      if(!j||j.draft||j.prerelease)return;
      var a=(j.assets||[]).filter(function(x){return x.name===ASSET&&x.size>0&&x.state==='uploaded'})[0];
      if(!a)return;
      if(a.browser_download_url.indexOf('https://github.com/'+REPO+'/releases/download/')!==0)return;
      rel={url:a.browser_download_url,tag:j.tag_name||'',size:a.size};setApk();
    }).catch(function(){});
  apply(pick());
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  }else document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')});
})();

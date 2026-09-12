(()=>{
  const SESSION_KEY='lefillibre.linkedin.session.v1';
  const API_BASE=String(window.LEFIL_API_BASE||localStorage.getItem('lefillibre.apiBase')||'').replace(/\/$/,'');
  const $=id=>document.getElementById(id);
  const toast=message=>{ if(typeof window.showToast==='function') return window.showToast(message); console.log(message); };

  function readLocalSubscription(){try{return JSON.parse(localStorage.getItem('lefillibre.subscription.v1')||'null')}catch{return null}}
  function writeLocalSubscription(patch){const current=readLocalSubscription()||{};localStorage.setItem('lefillibre.subscription.v1',JSON.stringify({...current,...patch,updatedAt:new Date().toISOString()}));}
  function session(){return localStorage.getItem(SESSION_KEY)||''}
  function authHeaders(){return session()?{authorization:`Bearer ${session()}`}:{}}
  function backendPrefs(){
    const s=readLocalSubscription()||{};
    return {
      categories:Array.isArray(s.categories)?s.categories:['IA & Tech'],
      mode:s.mode||'review',
      maxPerDay:Number(s.dailyLimit||3),
      minIntervalMinutes:Number(s.minGap||90),
      quietStart:s.quietStart||'22:30',
      quietEnd:s.quietEnd||'07:30'
    };
  }
  function setLinkedInUi(connected,name='',reconnect=false){
    const status=$('linkedinStatus'),button=$('connectLinkedIn');
    if(status) status.textContent=connected?(reconnect?'LinkedIn à reconnecter':`LinkedIn connecté${name?` · ${name}`:''}`):'LinkedIn non connecté';
    if(button){button.textContent=connected&&!reconnect?'Reconnecter LinkedIn':'Connecter LinkedIn';button.dataset.connected=connected?'true':'false';}
    writeLocalSubscription({linkedinConnected:connected&&!reconnect});
    if(typeof window.updateSubscribeButton==='function') window.updateSubscribeButton();
  }
  async function api(path,options={}){
    if(!API_BASE) throw new Error('backend_not_configured');
    const r=await fetch(`${API_BASE}${path}`,{...options,headers:{accept:'application/json',...authHeaders(),...(options.headers||{})}});
    const data=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(data.error||`http_${r.status}`);
    return data;
  }
  function consumeOAuthReturn(){
    const hash=new URLSearchParams(location.hash.replace(/^#/,''));
    const s=hash.get('lf_session');
    if(s){localStorage.setItem(SESSION_KEY,s);history.replaceState({},'',location.pathname+location.search);}
    const q=new URLSearchParams(location.search);
    if(q.get('linkedin')==='connected'){
      q.delete('linkedin');q.delete('reason');
      const qs=q.toString();history.replaceState({},'',location.pathname+(qs?`?${qs}`:''));
      toast('LinkedIn connecté. L’autopublication peut maintenant être activée.');
    }else if(q.get('linkedin')==='error'){
      const reason=q.get('reason')||'authorization_failed';q.delete('linkedin');q.delete('reason');
      const qs=q.toString();history.replaceState({},'',location.pathname+(qs?`?${qs}`:''));
      toast(`Connexion LinkedIn refusée : ${reason}`);
    }
  }
  async function refreshLinkedInStatus(){
    if(!API_BASE||!session()){setLinkedInUi(false);return;}
    try{const me=await api('/me');setLinkedInUi(true,me.name||'',!!me.reconnectRequired);if(me.prefs){const s=readLocalSubscription()||{};writeLocalSubscription({...s,linkedinConnected:!me.reconnectRequired});}}
    catch{localStorage.removeItem(SESSION_KEY);setLinkedInUi(false);}
  }
  async function syncPreferences(){
    if(!session()||!API_BASE) return;
    try{await api('/me/preferences',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(backendPrefs())});toast('Préférences synchronisées avec le service LinkedIn sécurisé.');}
    catch(e){toast(`Préférences enregistrées localement, mais synchronisation impossible : ${e.message}`);}
  }
  function connectLinkedIn(){
    if(!API_BASE){toast('Le backend LinkedIn est prêt dans GitHub mais son URL Hostinger doit encore être renseignée.');return;}
    const returnTo=`${location.origin}${location.pathname}`;
    location.href=`${API_BASE}/auth/linkedin/start?returnTo=${encodeURIComponent(returnTo)}`;
  }

  consumeOAuthReturn();
  document.addEventListener('DOMContentLoaded',()=>{
    const connect=$('connectLinkedIn');
    if(connect) connect.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();connectLinkedIn();},true);
    const launch=$('launchSubscription');
    if(launch) launch.addEventListener('click',()=>setTimeout(syncPreferences,0));
    refreshLinkedInStatus();
  });
})();

import { createServer } from 'node:http';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes, createHash, createHmac, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 8787);
const PUBLIC_BASE_URL = String(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://xdsawyerlol.github.io/LEFILLIBRE/';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || new URL(FRONTEND_URL).origin;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || `${PUBLIC_BASE_URL}/auth/linkedin/callback`;
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202609';
const STATE_SECRET = process.env.STATE_SECRET || '';
const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';
const DATA_DIR = process.env.DATA_DIR || './data';
const DATA_FILE = join(DATA_DIR, 'subscribers.json');
const FEED_URL = process.env.FEED_URL || 'https://raw.githubusercontent.com/XDSawyerLoL/LEFILLIBRE/main/feed.json';

const CATEGORIES = new Set(['IA & Tech','Politique & État','Justice & Libertés','Économie & Travail','Monde','Climat & Énergie']);
const ALLOWED_MODES = new Set(['review','auto']);
const ALLOWED_LIMITS = new Set([1,2,3,4,6]);
const ALLOWED_GAPS = new Set([60,90,120,180]);
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const encKey = TOKEN_ENCRYPTION_KEY ? createHash('sha256').update(TOKEN_ENCRYPTION_KEY).digest() : null;
let writeQueue = Promise.resolve();

function json(res, status, body, extra={}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store',...extra});
  res.end(payload);
}
function redirect(res, location) {
  res.writeHead(302, {'location':location,'cache-control':'no-store','referrer-policy':'no-referrer'});
  res.end();
}
function corsHeaders(req) {
  const origin = req.headers.origin;
  if (origin && origin === FRONTEND_ORIGIN) return {'access-control-allow-origin':origin,'vary':'Origin','access-control-allow-headers':'authorization, content-type, x-cron-secret','access-control-allow-methods':'GET,PUT,POST,OPTIONS'};
  return {};
}
function b64url(input) { return Buffer.from(input).toString('base64url'); }
function sha(value) { return createHash('sha256').update(String(value)).digest('hex'); }
function safeEqual(a,b) {
  const aa = Buffer.from(String(a)); const bb = Buffer.from(String(b));
  return aa.length === bb.length && timingSafeEqual(aa,bb);
}
function mustBeConfigured() {
  const missing = [];
  for (const [name,value] of Object.entries({PUBLIC_BASE_URL,LINKEDIN_CLIENT_ID,LINKEDIN_CLIENT_SECRET,STATE_SECRET,TOKEN_ENCRYPTION_KEY,CRON_SECRET})) if (!value) missing.push(name);
  return missing;
}
function signState(payload) {
  const encoded = b64url(JSON.stringify(payload));
  const sig = createHmac('sha256', STATE_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}
function verifyState(state) {
  const [encoded,sig] = String(state || '').split('.');
  if (!encoded || !sig) throw new Error('invalid_state');
  const expected = createHmac('sha256', STATE_SECRET).update(encoded).digest('base64url');
  if (!safeEqual(sig, expected)) throw new Error('invalid_state');
  const payload = JSON.parse(Buffer.from(encoded,'base64url').toString('utf8'));
  if (!payload.iat || Date.now() - payload.iat > 10 * 60 * 1000) throw new Error('expired_state');
  return payload;
}
function encryptToken(token) {
  if (!encKey) throw new Error('encryption_not_configured');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encKey, iv);
  const encrypted = Buffer.concat([cipher.update(token,'utf8'), cipher.final()]);
  return {iv:iv.toString('base64url'), tag:cipher.getAuthTag().toString('base64url'), data:encrypted.toString('base64url')};
}
function decryptToken(record) {
  if (!encKey || !record?.iv || !record?.tag || !record?.data) throw new Error('token_unavailable');
  const decipher = createDecipheriv('aes-256-gcm', encKey, Buffer.from(record.iv,'base64url'));
  decipher.setAuthTag(Buffer.from(record.tag,'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(record.data,'base64url')), decipher.final()]).toString('utf8');
}
async function ensureStore() {
  await mkdir(DATA_DIR,{recursive:true});
  try { await readFile(DATA_FILE,'utf8'); }
  catch { await writeFile(DATA_FILE, JSON.stringify({version:1,subscribers:{}},null,2)); }
}
async function readStore() {
  await ensureStore();
  try { return JSON.parse(await readFile(DATA_FILE,'utf8')); }
  catch { return {version:1,subscribers:{}}; }
}
async function mutateStore(mutator) {
  let result;
  writeQueue = writeQueue.then(async()=>{
    const store = await readStore();
    result = await mutator(store);
    const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmp, JSON.stringify(store,null,2));
    await rename(tmp, DATA_FILE);
  });
  await writeQueue;
  return result;
}
async function bodyJson(req, limit=32_768) {
  let size=0, chunks=[];
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw new Error('body_too_large'); chunks.push(chunk); }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function cleanPrefs(input={}) {
  const categories = [...new Set(Array.isArray(input.categories) ? input.categories.filter(x=>CATEGORIES.has(x)) : [])];
  const mode = ALLOWED_MODES.has(input.mode) ? input.mode : 'review';
  const maxPerDay = ALLOWED_LIMITS.has(Number(input.maxPerDay)) ? Number(input.maxPerDay) : 3;
  const minIntervalMinutes = ALLOWED_GAPS.has(Number(input.minIntervalMinutes)) ? Number(input.minIntervalMinutes) : 90;
  const quietStart = TIME_RE.test(input.quietStart || '') ? input.quietStart : '22:30';
  const quietEnd = TIME_RE.test(input.quietEnd || '') ? input.quietEnd : '07:30';
  return {active:true,categories:categories.length?categories:['IA & Tech'],mode,maxPerDay,minIntervalMinutes,quietStart,quietEnd};
}
function bearer(req) {
  const m = String(req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  return m?.[1] || '';
}
async function subscriberFromSession(req) {
  const token = bearer(req); if (!token) return null;
  const sessionHash = sha(token); const store = await readStore();
  return Object.values(store.subscribers || {}).find(s=>s.sessionHash === sessionHash) || null;
}
function returnUrl(input) {
  try {
    const u = new URL(input || FRONTEND_URL, FRONTEND_URL);
    if (u.origin !== new URL(FRONTEND_URL).origin) return new URL(FRONTEND_URL);
    return u;
  } catch { return new URL(FRONTEND_URL); }
}
async function linkedinToken(code) {
  const form = new URLSearchParams({grant_type:'authorization_code',code,client_id:LINKEDIN_CLIENT_ID,client_secret:LINKEDIN_CLIENT_SECRET,redirect_uri:LINKEDIN_REDIRECT_URI});
  const r = await fetch('https://www.linkedin.com/oauth/v2/accessToken',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:form});
  const data = await r.json().catch(()=>({}));
  if (!r.ok || !data.access_token) throw new Error(`token_exchange_failed:${r.status}`);
  return data;
}
async function linkedinUserInfo(accessToken) {
  const r = await fetch('https://api.linkedin.com/v2/userinfo',{headers:{authorization:`Bearer ${accessToken}`}});
  const data = await r.json().catch(()=>({}));
  if (!r.ok || !data.sub) throw new Error(`userinfo_failed:${r.status}`);
  return data;
}
async function linkedinPersonId(accessToken, fallbackSub) {
  try {
    const r = await fetch('https://api.linkedin.com/v2/me',{headers:{authorization:`Bearer ${accessToken}`,'X-Restli-Protocol-Version':'2.0.0'}});
    if (r.ok) { const data = await r.json(); if (data.id) return data.id; }
  } catch {}
  return fallbackSub;
}
function categoryOf(item) {
  if (CATEGORIES.has(item.category)) return item.category;
  const t = `${item.title||''} ${item.summary||''}`.toLowerCase();
  if (/intelligence artificielle|\bia\b|openai|chatgpt|anthropic|gemini|robot|technolog|numérique|cyber|ordinateur|smartphone|semi-conducteur|puce|logiciel|cloud|data center|cryptomonnaie|drone/.test(t)) return 'IA & Tech';
  if (/justice|tribunal|magistrat|police|prison|liberté|droits humains|igpn|préfecture/.test(t)) return 'Justice & Libertés';
  if (/gouvernement|ministre|président|parlement|assemblée|sénat|élection|parti|député|loi|réforme|état/.test(t)) return 'Politique & État';
  if (/économie|emploi|travail|entreprise|budget|impôt|taxe|dette|salaire|chômage|industrie/.test(t)) return 'Économie & Travail';
  if (/climat|énergie|solaire|électrique|pétrole|gaz|nucléaire|environnement/.test(t)) return 'Climat & Énergie';
  return 'Monde';
}
function parisParts(date=new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const o = Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return {date:`${o.year}-${o.month}-${o.day}`, minutes:Number(o.hour)*60+Number(o.minute)};
}
function timeToMinutes(s){ const [h,m]=s.split(':').map(Number); return h*60+m; }
function isQuiet(prefs, now=new Date()) {
  const cur = parisParts(now).minutes, start=timeToMinutes(prefs.quietStart), end=timeToMinutes(prefs.quietEnd);
  return start === end ? false : start < end ? cur >= start && cur < end : cur >= start || cur < end;
}
function postText(item, category) {
  const hooks = {
    'IA & Tech':'La technologie avance plus vite que le débat public. La vraie question : progrès concret ou nouvelle dépendance ?',
    'Politique & État':'Décision nécessaire, ou nouvelle démonstration d’un pouvoir qui s’éloigne du terrain ?',
    'Justice & Libertés':'Où place-t-on la limite entre autorité, responsabilité et libertés publiques ?',
    'Économie & Travail':'Qui bénéficie réellement de cette décision, et qui en supportera le coût ?',
    'Climat & Énergie':'Transition réelle ou déplacement du problème ? Les conséquences méritent d’être regardées de près.',
    'Monde':'Au-delà du titre, cette évolution peut modifier durablement l’équilibre en cours.'
  };
  const tags = {'IA & Tech':'#IntelligenceArtificielle #Technologie','Politique & État':'#Politique #État','Justice & Libertés':'#Justice #Libertés','Économie & Travail':'#Économie #Travail','Climat & Énergie':'#Énergie #Climat','Monde':'#International'};
  const url = item.articleUrl || item.url;
  return `${item.title}\n\n${hooks[category] || hooks.Monde}\n\nLire : ${url}\n\n${tags[category] || tags.Monde} #LeFilLibre`;
}
async function publishLinkedIn(subscriber, item) {
  const accessToken = decryptToken(subscriber.accessToken);
  const category = categoryOf(item);
  const body = {
    author: subscriber.linkedinUrn,
    commentary: postText(item, category),
    visibility:'PUBLIC',
    distribution:{feedDistribution:'MAIN_FEED',targetEntities:[],thirdPartyDistributionChannels:[]},
    lifecycleState:'PUBLISHED',
    isReshareDisabledByAuthor:false
  };
  const r = await fetch('https://api.linkedin.com/rest/posts',{method:'POST',headers:{authorization:`Bearer ${accessToken}`,'content-type':'application/json','X-Restli-Protocol-Version':'2.0.0','Linkedin-Version':LINKEDIN_VERSION},body:JSON.stringify(body)});
  const text = await r.text();
  if (!r.ok) throw new Error(`linkedin_post_failed:${r.status}:${text.slice(0,240)}`);
  return r.headers.get('x-restli-id') || 'published';
}
async function runPublisher() {
  const feedRes = await fetch(`${FEED_URL}?v=${Date.now()}`,{headers:{accept:'application/json'}});
  if (!feedRes.ok) throw new Error(`feed_failed:${feedRes.status}`);
  const feed = await feedRes.json();
  const items = Array.isArray(feed.items) ? feed.items : [];
  const store = await readStore();
  const report = [];
  for (const subscriber of Object.values(store.subscribers || {})) {
    const prefs = cleanPrefs(subscriber.prefs || {});
    if (!prefs.active || prefs.mode !== 'auto') { report.push({id:subscriber.id,status:'skipped_mode'}); continue; }
    if (subscriber.tokenExpiresAt && Date.now() >= subscriber.tokenExpiresAt) { report.push({id:subscriber.id,status:'reconnect_required'}); continue; }
    if (isQuiet(prefs)) { report.push({id:subscriber.id,status:'quiet_hours'}); continue; }
    const nowParts = parisParts();
    const published = Array.isArray(subscriber.published) ? subscriber.published : [];
    const todayCount = published.filter(p=>parisParts(new Date(p.publishedAt)).date===nowParts.date).length;
    if (todayCount >= prefs.maxPerDay) { report.push({id:subscriber.id,status:'daily_limit'}); continue; }
    const last = published.map(p=>Date.parse(p.publishedAt)).filter(Number.isFinite).sort((a,b)=>b-a)[0];
    if (last && Date.now()-last < prefs.minIntervalMinutes*60_000) { report.push({id:subscriber.id,status:'min_gap'}); continue; }
    const done = new Set(published.map(p=>p.articleUrl));
    const item = items.find(x=>prefs.categories.includes(categoryOf(x)) && !done.has(x.articleUrl||x.url));
    if (!item) { report.push({id:subscriber.id,status:'no_matching_story'}); continue; }
    try {
      const postId = await publishLinkedIn(subscriber,item);
      await mutateStore(s=>{
        const current=s.subscribers[subscriber.id]; if(!current) return;
        current.published = [...(current.published||[]),{articleUrl:item.articleUrl||item.url,publishedAt:new Date().toISOString(),postId,title:item.title}].slice(-500);
      });
      report.push({id:subscriber.id,status:'published',postId,title:item.title});
    } catch (e) { report.push({id:subscriber.id,status:'error',error:String(e.message||e).slice(0,320)}); }
  }
  return report;
}

async function handler(req,res) {
  const cors = corsHeaders(req);
  if (req.method==='OPTIONS') { res.writeHead(204,cors); return res.end(); }
  const url = new URL(req.url, PUBLIC_BASE_URL || 'http://localhost');
  try {
    if (url.pathname==='/health' && req.method==='GET') return json(res,200,{ok:true,configured:mustBeConfigured().length===0,missing:mustBeConfigured()},cors);

    if (url.pathname==='/auth/linkedin/start' && req.method==='GET') {
      const missing=mustBeConfigured(); if(missing.length) return json(res,503,{error:'backend_not_configured',missing});
      const rt = returnUrl(url.searchParams.get('returnTo'));
      const state = signState({iat:Date.now(),nonce:randomBytes(16).toString('hex'),returnTo:rt.href});
      const auth = new URL('https://www.linkedin.com/oauth/v2/authorization');
      auth.search = new URLSearchParams({response_type:'code',client_id:LINKEDIN_CLIENT_ID,redirect_uri:LINKEDIN_REDIRECT_URI,state,scope:'openid profile email w_member_social'}).toString();
      return redirect(res,auth.href);
    }

    if (url.pathname==='/auth/linkedin/callback' && req.method==='GET') {
      let state;
      try { state=verifyState(url.searchParams.get('state')); }
      catch { const rt=returnUrl(FRONTEND_URL); rt.searchParams.set('linkedin','error'); rt.searchParams.set('reason','invalid_state'); return redirect(res,rt.href); }
      const rt=returnUrl(state.returnTo);
      if (url.searchParams.get('error')) { rt.searchParams.set('linkedin','error'); rt.searchParams.set('reason',url.searchParams.get('error')); return redirect(res,rt.href); }
      const code=url.searchParams.get('code'); if(!code) { rt.searchParams.set('linkedin','error'); rt.searchParams.set('reason','missing_code'); return redirect(res,rt.href); }
      const token=await linkedinToken(code);
      const info=await linkedinUserInfo(token.access_token);
      const personId=await linkedinPersonId(token.access_token,info.sub);
      const id=sha(`linkedin:${info.sub}`).slice(0,32);
      const sessionToken=randomBytes(32).toString('base64url');
      await mutateStore(store=>{
        const prev=store.subscribers[id]||{};
        store.subscribers[id]={...prev,id,linkedinSub:info.sub,personId,linkedinUrn:`urn:li:person:${personId}`,name:info.name||prev.name||'',email:info.email||prev.email||'',accessToken:encryptToken(token.access_token),tokenExpiresAt:Date.now()+Number(token.expires_in||0)*1000,sessionHash:sha(sessionToken),prefs:prev.prefs||cleanPrefs(),published:prev.published||[],updatedAt:new Date().toISOString()};
      });
      rt.searchParams.set('linkedin','connected'); rt.hash=`lf_session=${encodeURIComponent(sessionToken)}`; return redirect(res,rt.href);
    }

    if (url.pathname==='/me' && req.method==='GET') {
      const sub=await subscriberFromSession(req); if(!sub) return json(res,401,{error:'unauthorized'},cors);
      return json(res,200,{linkedinConnected:true,name:sub.name,email:sub.email,prefs:cleanPrefs(sub.prefs||{}),reconnectRequired:!!(sub.tokenExpiresAt&&Date.now()>=sub.tokenExpiresAt),tokenExpiresAt:sub.tokenExpiresAt||null},cors);
    }

    if (url.pathname==='/me/preferences' && req.method==='PUT') {
      const sub=await subscriberFromSession(req); if(!sub) return json(res,401,{error:'unauthorized'},cors);
      const prefs=cleanPrefs(await bodyJson(req));
      await mutateStore(store=>{ if(store.subscribers[sub.id]) { store.subscribers[sub.id].prefs=prefs; store.subscribers[sub.id].updatedAt=new Date().toISOString(); } });
      return json(res,200,{ok:true,prefs},cors);
    }

    if (url.pathname==='/me/disconnect' && req.method==='POST') {
      const sub=await subscriberFromSession(req); if(!sub) return json(res,401,{error:'unauthorized'},cors);
      await mutateStore(store=>{ delete store.subscribers[sub.id]; });
      return json(res,200,{ok:true},cors);
    }

    if (url.pathname==='/jobs/publish' && req.method==='POST') {
      if (!CRON_SECRET || !safeEqual(req.headers['x-cron-secret']||'',CRON_SECRET)) return json(res,401,{error:'unauthorized'});
      const report=await runPublisher(); return json(res,200,{ok:true,report});
    }

    return json(res,404,{error:'not_found'},cors);
  } catch (e) {
    console.error(new Date().toISOString(),e);
    return json(res,500,{error:'internal_error',message:String(e.message||e).slice(0,240)},cors);
  }
}

await ensureStore();
createServer(handler).listen(PORT,'0.0.0.0',()=>console.log(`Le Fil Libre LinkedIn backend listening on :${PORT}`));

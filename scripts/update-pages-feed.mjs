import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const SIX_HOURS = 6 * 60 * 60 * 1000;
const SITE = 'https://xdsawyerlol.github.io/LEFILLIBRE/';
const FEEDS = [
  { url: 'https://www.france24.com/fr/rss', domain: 'france24.com', source: 'France 24' },
  { url: 'https://www.rfi.fr/fr/rss', domain: 'rfi.fr', source: 'RFI' },
  { url: 'https://www.francetvinfo.fr/titres.rss', domain: 'francetvinfo.fr', source: 'franceinfo' },
  { url: 'https://fr.euronews.com/rss?format=mrss&level=theme&name=news', domain: 'euronews.com', source: 'Euronews' },
];

const POWER_STORY = /gouvernement|minist(?:re|ères?)|garde des sceaux|présiden(?:t|ce)|élysée|matignon|assemblée nationale|sénat|parlement|député|loi\b|décret|budget|déficit|dette publique|sanctions? économiques?|cour des comptes|commission européenne|conseil de l['’]ue|fonction publique|réforme|impôt|taxe\b|fiscal|administration|État\b|etat\b|défenseur des droits|administration pénitentiaire|inspection générale de la police|IGPN\b|CGLPL\b|droits fondamentaux|marchés? publics?|collectivités|justice|magistrat|tribunal|police|préfecture|mairie|région|département|parti|élection|immigration|occupation|onu|droits humains|manifest/i;
const OUTSIDE_SCOPE = /déraillement|accident|crash|football|judo|tennis|rugby|championnat|ligue 1|match\b|concert|chanteu(?:r|se)|actrice|acteur|célébrité|people|résultat sportif/i;

function decodeXml(value='') {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, ' ').trim();
}

function tag(block, name) {
  return decodeXml(block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '');
}

function attrUrl(block) {
  const candidates = [...block.matchAll(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*\burl=["']([^"']+)["'][^>]*>/gi)];
  for (const m of candidates) {
    try { const u = new URL(m[1]); if (u.protocol === 'https:') return u.href; } catch {}
  }
}

function publisherUrl(url, domain) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    return u.protocol === 'https:' && (host === domain || host.endsWith(`.${domain}`));
  } catch { return false; }
}

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72) || 'article';
}

function articleId(item) {
  const hash = createHash('sha1').update(item.url).digest('hex').slice(0, 10);
  return `${slugify(item.title)}-${hash}`;
}

function esc(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function absoluteImage(item) {
  if (item.image && /^https:\/\//i.test(item.image)) return item.image;
  return `${SITE}public/images/flash-monde.webp`;
}

function articleHtml(item) {
  const id = articleId(item);
  const url = `${SITE}articles/${id}.html`;
  const image = absoluteImage(item);
  const title = esc(item.title);
  const summary = esc(item.summary || 'Une information récente sélectionnée par Le Fil Libre, avec sa source et son heure de publication.');
  const source = esc(item.source || 'Source');
  const original = esc(item.url);
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const published = new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeStyle:'short',timeZone:'Europe/Paris'}).format(new Date(item.publishedAt));
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Le Fil Libre</title>
<meta name="description" content="${summary}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Le Fil Libre">
<meta property="og:title" content="${title}"><meta property="og:description" content="${summary}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${esc(image)}">
<meta property="article:published_time" content="${esc(item.publishedAt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${summary}"><meta name="twitter:image" content="${esc(image)}">
<style>
:root{--bg:#f5f3ed;--ink:#102c34;--paper:#fffefa;--muted:#5d7072;--line:#c9cfca;--red:#cb4336}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Arial,Helvetica,sans-serif}a{color:inherit}.shell{max-width:1050px;margin:auto;padding:0 32px}.top{display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:3px solid var(--ink)}.brand{font:900 34px/.9 Georgia,serif;letter-spacing:-.06em;text-decoration:none}.brand i{font-style:normal;color:var(--red);font-weight:400}.back{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.07em}.article{max-width:820px;margin:58px auto 90px}.eyebrow{color:var(--red);font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.article h1{font:700 clamp(42px,6vw,72px)/1.05 Georgia,serif;letter-spacing:-.045em;margin:15px 0 20px}.summary{font:21px/1.5 Georgia,serif;color:#445f62}.meta{display:flex;gap:14px;flex-wrap:wrap;border-block:1px solid #aebbb8;padding:13px 0;margin:26px 0;color:#627578;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.hero{width:100%;max-height:470px;object-fit:cover;background:var(--ink);display:block;margin:28px 0}.notice{background:var(--paper);border-left:4px solid var(--red);padding:18px 20px;color:#4f6466}.actions{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0}.btn{display:inline-block;padding:13px 18px;background:var(--ink);color:#fff;text-decoration:none;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.btn.alt{background:var(--red)}.sourcebox{border-top:1px solid var(--line);padding-top:22px;margin-top:42px}.sourcebox strong{display:block;margin-bottom:7px}.footer{border-top:1px solid #aebbb8;padding:24px 0 40px;color:var(--muted);font-size:13px}@media(max-width:650px){.shell{padding:0 18px}.article{margin-top:38px}.article h1{font-size:clamp(38px,10vw,58px)}.summary{font-size:19px}.actions{display:grid}.btn{text-align:center}}
</style></head>
<body><div class="shell"><header class="top"><a class="brand" href="${SITE}">LE FIL <i>LIBRE</i></a><a class="back" href="${SITE}">← Retour au fil</a></header>
<main class="article"><div class="eyebrow">À l’instant · ${source}</div><h1>${title}</h1><p class="summary">${summary}</p><div class="meta"><span>Publié ${esc(published)}</span><span>Source : ${source}</span></div><img class="hero" src="${esc(image)}" alt="Illustration du sujet" referrerpolicy="no-referrer"><div class="notice">Le Fil Libre relaie ce sujet récent et renvoie vers la publication d’origine pour la lecture complète et la vérification de la source.</div><div class="actions"><a class="btn alt" href="${share}" target="_blank" rel="noopener noreferrer">Partager sur LinkedIn</a><a class="btn" href="${original}" target="_blank" rel="noopener noreferrer">Lire la source originale ↗</a></div><div class="sourcebox"><strong>Source originale</strong><a href="${original}" target="_blank" rel="noopener noreferrer">${source} — ouvrir l’article ↗</a></div></main><footer class="footer">Le Fil Libre — l’actualité récente, datée et sourcée.</footer></div></body></html>\n`;
}

async function fetchFeed(feed) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const r = await fetch(feed.url, { headers: { accept: 'application/rss+xml, application/xml, text/xml' }, signal: controller.signal });
    if (!r.ok) throw new Error(`${feed.source}: HTTP ${r.status}`);
    const xml = await r.text();
    return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0, 80).flatMap(([, block]) => {
      const url = tag(block, 'link');
      const title = tag(block, 'title');
      const description = tag(block, 'description');
      const rawDate = tag(block, 'pubDate') || tag(block, 'dc:date');
      const published = Date.parse(rawDate);
      if (!url || !title || !Number.isFinite(published) || !publisherUrl(url, feed.domain)) return [];
      return [{ title: title.slice(0, 240), url, source: feed.source, publishedAt: new Date(published).toISOString(), summary: description ? description.slice(0, 320) : undefined, image: attrUrl(block) }];
    });
  } finally { clearTimeout(timer); }
}

const now = Date.now();
const settled = await Promise.allSettled(FEEDS.map(fetchFeed));
for (let i = 0; i < settled.length; i++) if (settled[i].status === 'rejected') console.warn(String(settled[i].reason));

const seen = new Set();
const recent = settled.flatMap(r => r.status === 'fulfilled' ? r.value : []).filter(item => {
  const age = now - Date.parse(item.publishedAt);
  if (age < 0 || age >= SIX_HOURS || seen.has(item.url)) return false;
  seen.add(item.url); return true;
}).sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

let items = recent.filter(item => POWER_STORY.test(`${item.title} ${item.summary || ''}`) && !OUTSIDE_SCOPE.test(`${item.title} ${item.summary || ''}`)).slice(0, 18);
if (items.length === 0) items = recent.filter(item => !OUTSIDE_SCOPE.test(`${item.title} ${item.summary || ''}`)).slice(0, 3);

await mkdir('articles', { recursive: true });
const cleanItems = [];
for (const item of items) {
  const id = articleId(item);
  const articleUrl = `${SITE}articles/${id}.html`;
  await writeFile(`articles/${id}.html`, articleHtml(item));
  cleanItems.push({
    title: item.title, url: item.url, source: item.source, publishedAt: item.publishedAt,
    ...(item.summary ? { summary: item.summary } : {}), ...(item.image ? { image: item.image } : {}),
    articleUrl,
  });
}

let previous = null;
try { previous = JSON.parse(await readFile('feed.json', 'utf8')); } catch {}
const previousItems = JSON.stringify(previous?.items ?? []);
const nextItems = JSON.stringify(cleanItems);
if (previousItems !== nextItems) {
  await writeFile('feed.json', JSON.stringify({ updatedAt: new Date(now).toISOString(), items: cleanItems }, null, 2) + '\n');
}
console.log(`Prepared ${cleanItems.length} shareable stories from ${settled.filter(r => r.status === 'fulfilled').length} sources.`);

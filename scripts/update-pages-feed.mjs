import { readFile, writeFile } from 'node:fs/promises';

const SIX_HOURS = 6 * 60 * 60 * 1000;
const FEEDS = [
  { url: 'https://www.france24.com/fr/rss', domain: 'france24.com', source: 'France 24' },
  { url: 'https://www.rfi.fr/fr/rss', domain: 'rfi.fr', source: 'RFI' },
  { url: 'https://www.francetvinfo.fr/titres.rss', domain: 'francetvinfo.fr', source: 'franceinfo' },
  { url: 'https://fr.euronews.com/rss?format=mrss&level=theme&name=news', domain: 'euronews.com', source: 'Euronews' },
];

const POWER_STORY = /gouvernement|minist(?:re|ères?)|garde des sceaux|présiden(?:t|ce)|élysée|matignon|assemblée nationale|sénat|parlement|député|loi\b|décret|budget|déficit|dette publique|sanctions? économiques?|cour des comptes|commission européenne|conseil de l['’]ue|fonction publique|réforme|impôt|taxe\b|fiscal|administration|État\b|etat\b|défenseur des droits|administration pénitentiaire|inspection générale de la police|IGPN\b|CGLPL\b|droits fondamentaux|marchés? publics?|collectivités|justice|magistrat|tribunal|police|préfecture|mairie|région|département/i;
const OUTSIDE_SCOPE = /déraillement|accident|crash|football|judo|tennis|rugby|championnat|ligue 1|match\b|concert|actrice|acteur|célébrité|people|résultat sportif/i;

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
  const candidates = [
    ...block.matchAll(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*\burl=["']([^"']+)["'][^>]*>/gi),
  ];
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
      return [{
        title: title.slice(0, 240),
        url,
        source: feed.source,
        publishedAt: new Date(published).toISOString(),
        summary: description ? description.slice(0, 320) : undefined,
        image: attrUrl(block),
      }];
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
  seen.add(item.url);
  return true;
}).sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

let items = recent.filter(item => POWER_STORY.test(item.title) && !OUTSIDE_SCOPE.test(item.title)).slice(0, 18);
// Evite une page totalement vide si un flux utilise un titre trop elliptique :
// dans ce cas, on garde seulement les trois informations les plus récentes comme veille brute.
if (items.length === 0) items = recent.slice(0, 3);

const cleanItems = items.map(({title,url,source,publishedAt,summary,image}) => ({
  title, url, source, publishedAt,
  ...(summary ? { summary } : {}),
  ...(image ? { image } : {}),
}));

let previous = null;
try { previous = JSON.parse(await readFile('feed.json', 'utf8')); } catch {}
const previousItems = JSON.stringify(previous?.items ?? []);
const nextItems = JSON.stringify(cleanItems);
if (previousItems === nextItems) {
  console.log(`No feed change (${cleanItems.length} items).`);
  process.exit(0);
}

await writeFile('feed.json', JSON.stringify({ updatedAt: new Date(now).toISOString(), items: cleanItems }, null, 2) + '\n');
console.log(`Updated feed.json with ${cleanItems.length} items from ${settled.filter(r => r.status === 'fulfilled').length} sources.`);

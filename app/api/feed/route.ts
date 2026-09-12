import { NextResponse } from "next/server";
import { SIX_HOURS_MS } from "@/lib/articles";
export const dynamic = "force-dynamic";

type FeedItem = {url:string; title:string; source:string; publishedAt:string};
const RSS = [
  {url:"https://www.france24.com/fr/rss", domain:"france24.com", source:"France 24"},
  {url:"https://www.rfi.fr/fr/rss", domain:"rfi.fr", source:"RFI"},
  {url:"https://www.francetvinfo.fr/titres.rss", domain:"francetvinfo.fr", source:"franceinfo"},
  {url:"https://fr.euronews.com/rss?format=mrss&level=theme&name=news", domain:"euronews.com", source:"Euronews"},
];
function isPublisher(url:string, domain:string) {
  try { const parsed = new URL(url); const host=parsed.hostname.replace(/^www\./,"").toLowerCase(); return parsed.protocol==="https:" && (host===domain || host.endsWith(`.${domain}`)); }
  catch { return false; }
}
function clean(value:string) {return value.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).trim();}
function tag(block:string,name:string){return clean(block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,"i"))?.[1]??"");}
async function fromRss(feed:typeof RSS[number]):Promise<FeedItem[]>{
  const res=await fetch(feed.url,{headers:{accept:"application/rss+xml, application/xml, text/xml"},signal:AbortSignal.timeout(6500)});
  if(!res.ok)throw new Error(`RSS ${feed.source}: ${res.status}`);
  const xml=await res.text();
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0,60).flatMap(([_,block])=>{
    const url=tag(block,"link"), title=tag(block,"title"), rawDate=tag(block,"pubDate");
    const published=Date.parse(rawDate);
    if(!url||!title||!Number.isFinite(published)||!isPublisher(url,feed.domain))return [];
    return [{url,title:title.slice(0,220),source:feed.source,publishedAt:new Date(published).toISOString()}];
  });
}
export async function GET(){
  const now=Date.now();
  const settled=await Promise.allSettled(RSS.map(fromRss));
  settled.forEach((result,index)=>{
    if(result.status==="rejected") console.warn("RSS source unavailable",RSS[index].source,String(result.reason));
  });
  const seen=new Set<string>();
  const items=settled.flatMap(result=>result.status==="fulfilled"?result.value:[])
    .filter(item=>{
      const age=now-Date.parse(item.publishedAt);
      if(age<0||age>=SIX_HOURS_MS||seen.has(item.url))return false;
      seen.add(item.url);return true;
    }).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,80);
  console.info("RSS feed result",items.length,"recent links from",settled.filter(result=>result.status==="fulfilled").length,"sources");
  return NextResponse.json({items,updatedAt:new Date(now).toISOString()}, {status:settled.some(result=>result.status==="fulfilled")?200:503,headers:{"Cache-Control":"no-store"}});
}

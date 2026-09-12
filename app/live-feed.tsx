"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";

type FeedItem = { title:string; url:string; source:string; publishedAt:string };
type BriefItem = { slug:string; category:string; title:string; summary:string; publishedAt:string; image?:string; imageCredit?:string; sources:{name:string;url:string}[] };
type Card = { key:string; url:string; title:string; source:string; publishedAt:string; summary?:string; image:string; credit:string; verified:boolean };
const SIX_HOURS = 6 * 60 * 60 * 1000;
// Une sélection de liens de veille, jamais des brèves validées par le journal.
const POWER_STORY = /gouvernement|minist(?:re|ères?)|garde des sceaux|présiden(?:t|ce)|élysée|matignon|assemblée nationale|sénat|parlement|député|loi\b|décret|budget|déficit|dette publique|sanctions? économiques?|cour des comptes|commission européenne|conseil de l['’]ue|fonction publique|réforme|impôt|taxe\b|fiscal|administration|État\b|etat\b|défenseur des droits|administration pénitentiaire|inspection générale de la police|IGPN\b|CGLPL\b|droits fondamentaux|marchés? publics?|collectivités/i;
const OUTSIDE_SCOPE = /déraillement|accident|crash|football|judo|tennis|rugby|championnat|ligue 1|match\b|concert|actrice|acteur|célébrité|people|résultat sportif/i;
function isPowerStory(title:string) { return POWER_STORY.test(title) && !OUTSIDE_SCOPE.test(title); }

function pictureFor(title:string,category="") {
  const text=`${title} ${category}`.toLocaleLowerCase("fr-FR");
  if(/économie|emploi|financ|prix|pétrole|énergie|climat|environnement|société|santé|école|logement|transport|inflation|salair/.test(text))return "/images/flash-societe.webp";
  if(/france|français|paris|gouvernement|ministre|assemblée|sénat|police|justice|élysée|président|député|retraite|sncf/.test(text))return "/images/flash-france.webp";
  return "/images/flash-monde.webp";
}
function isRecent(publishedAt:string,now:number) {
  const age=now-Date.parse(publishedAt);
  return Number.isFinite(age) && age>=0 && age<SIX_HOURS;
}
function displayTime(date:string) {
  return new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Paris"}).format(new Date(date));
}

export default function LiveFeed() {
  const [feed,setFeed]=useState<FeedItem[]>([]);
  const [briefs,setBriefs]=useState<BriefItem[]>([]);
  const [now,setNow]=useState(0);
  const [status,setStatus]=useState<"loading"|"ok"|"error">("loading");
  const [updated,setUpdated]=useState("");
  useEffect(()=>{
    let live=true;
    async function refresh() {
      const results=await Promise.allSettled([
        fetch("/api/feed",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error("feed");return r.json() as Promise<{items:FeedItem[]}>;}),
        fetch("/api/briefs",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error("briefs");return r.json() as Promise<{items:BriefItem[]}>;})
      ]);
      if(!live)return;
      if(results[0].status==="fulfilled")setFeed(results[0].value.items);
      else setFeed([]);
      if(results[1].status==="fulfilled")setBriefs(results[1].value.items);
      else setBriefs([]);
      // The editorial API can succeed with zero briefs while the live RSS feed has failed.
      setStatus(results[0].status==="fulfilled"?"ok":"error");
      setUpdated(new Date().toISOString());
      setNow(Date.now());
    }
    setNow(Date.now());refresh();
    const polling=setInterval(refresh,120000);
    const aging=setInterval(()=>setNow(Date.now()),15000);
    return ()=>{live=false;clearInterval(polling);clearInterval(aging);};
  },[]);
  const cards=useMemo<Card[]>(()=>{
    const editorial=briefs.filter(item=>isRecent(item.publishedAt,now)).map(item=>({key:item.slug,url:`/articles/${item.slug}`,title:item.title,source:"Le Fil Libre",publishedAt:item.publishedAt,summary:item.summary,image:item.image??pictureFor(item.title,item.category),credit:item.imageCredit??"Illustration originale · Le Fil Libre",verified:true}));
    const existing=new Set(briefs.flatMap(item=>item.sources.map(s=>s.url)));
    const links=feed.filter(item=>isRecent(item.publishedAt,now)&&isPowerStory(item.title)&&!existing.has(item.url)).slice(0,12).map(item=>({key:item.url,url:item.url,title:item.title,source:item.source,publishedAt:item.publishedAt,image:pictureFor(item.title),credit:"Illustration originale · Le Fil Libre",verified:false}));
    return [...editorial.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)),...links];
  },[feed,briefs,now]);
  return <div className="hot-content" aria-live="polite">
    <div className="hot-status"><span>{status==="loading"?"Recherche des nouvelles récentes…":status==="error"?(cards.length?"Le fil des rédactions est indisponible ; les brèves vérifiées restent accessibles.":"Le fil des rédactions est momentanément indisponible."):cards.length?`${cards.length} publication${cards.length>1?"s":""} des six dernières heures`:"Aucun article ni lien récent sur les décisions du pouvoir."}</span>{updated&&<span className="hot-checked"><RefreshCw size={14} aria-hidden="true"/> {status==="error"?"Tentative à":"Relevé à"} {displayTime(updated)}</span>}</div>
    {cards.length>0&&<div className="hot-grid">{cards.map((card,index)=><article className={`hot-card ${index===0?"hot-card-featured":""}`} key={card.key}>
      <a className="hot-card-link" href={card.url} {...(!card.verified?{target:"_blank",rel:"noopener noreferrer"}:{})}>
        <div className="hot-visual"><img src={card.image} alt="Illustration éditoriale, pas une photographie des faits" loading={index<2?"eager":"lazy"}/><span className="visual-caption">Illustration</span></div>
        <div className="hot-card-body"><div className="hot-meta"><span>{card.verified?"BRÈVE VÉRIFIÉE":"LIEN SOURCE"} · {card.source}</span><time dateTime={card.publishedAt}>{displayTime(card.publishedAt)}</time></div><h2>{card.title}<ArrowUpRight size={21} aria-hidden="true"/></h2>{card.summary&&<p>{card.summary}</p>}<small>{card.verified?"Sources citées dans la brève":card.credit}</small></div>
      </a>
    </article>)}</div>}
    <p className="hot-disclaimer">Les liens « source » mènent directement à leur rédaction : leur titre n’est pas une vérification du Fil Libre. Les brèves du journal sont réécrites, recoupées et sourcées. Les visuels sont des illustrations, pas des photos des événements.</p>
  </div>;
}

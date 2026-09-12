import { NextResponse } from "next/server";
import { articles, isFreshArticle } from "@/lib/articles";
export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const items = articles.filter(article => isFreshArticle(article, now)).sort((a,b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!)).slice(0, 6).map(({slug,category,title,summary,publishedAt,image,imageCredit,sources}) => ({slug,category,title,summary,publishedAt,image,imageCredit,sources:sources.map(({name,url}) => ({name,url}))}));
  return NextResponse.json({items}, {headers:{"Cache-Control":"no-store"}});
}

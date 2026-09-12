import Link from "next/link";
import LiveFeed from "@/app/live-feed";

export const dynamic = "force-dynamic";

export default function Home() {
  return <main className="site-shell hot-shell">
    <header className="masthead hot-masthead">
      <div className="masthead-top"><span>LE JOURNAL DES SIX DERNIÈRES HEURES</span><span>{new Intl.DateTimeFormat("fr-FR", {dateStyle:"full",timeStyle:"short",timeZone:"Europe/Paris"}).format(new Date())}</span></div>
      <div className="brand-row"><Link href="/" className="brand" aria-label="Le Fil Libre, accueil"><span>LE FIL</span><i>LIBRE</i></Link><div className="brand-note">L’actualité qui vient de tomber.<br/>Après six heures, on passe à la suite.</div></div>
      <nav className="nav" aria-label="Navigation"><a href="#actualite">À l’instant</a><Link href="/methode">Comment ça marche</Link></nav>
    </header>
    <section id="actualite" className="hot-section" aria-labelledby="hot-title">
      <div className="hot-heading"><div><span className="live-label"><span className="pulse-dot"/> EN COURS</span><h1 id="hot-title">À l’instant<span className="hot-period">.</span></h1></div><p>Seulement les publications des six dernières heures. Les plus anciennes quittent le fil automatiquement.</p></div>
      <LiveFeed />
    </section>
    <footer className="footer"><Link href="/" className="footer-brand">LE FIL <em>LIBRE</em></Link><p>Des faits datés, leurs sources, pas de vieilles nouvelles repeintes en urgence.</p><Link href="/methode">Notre méthode</Link></footer>
  </main>;
}

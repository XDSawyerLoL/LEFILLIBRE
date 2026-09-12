import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Methode() {
  return <main className="site-shell article-page">
    <header className="detail-header"><Link href="/" className="detail-brand">LE FIL <em>LIBRE</em></Link><Link href="/" className="back-link"><ArrowLeft size={16}/> Retour au fil</Link></header>
    <article className="detail-main method-page"><div className="detail-eyebrow">NOTRE MÉTHODE</div><h1>Six heures. Pas une de plus.</h1><p className="detail-summary">Le Fil Libre affiche les publications récentes, puis les retire automatiquement.</p>
      <div className="detail-body">
        <h2>Repérer</h2><p>Les liens « source » renvoient aux rédactions d’origine. Ils apparaissent selon l’heure de publication indiquée dans leurs flux et ne sont pas des informations vérifiées indépendamment par notre rédaction.</p>
        <h2>Écrire</h2><p>Nos brèves sont des textes originaux. Elles distinguent les faits établis, les annonces et les incertitudes, et donnent les liens précis permettant de les vérifier.</p>
        <h2>Retirer</h2><p>Seules les publications des six dernières heures sont affichées. Les anciennes brèves cessent également d’être accessibles par leur adresse. Si les sources sont indisponibles ou si rien de récent n’est assez solide, nous n’affichons pas de vieux sujet pour remplir la page.</p>
        <h2>Illustrer</h2><p>Les images du fil sont des illustrations originales, pas des photographies des événements. Nous ne reprenons ni les photos, ni les articles complets des médias.</p>
      </div>
    </article><footer className="detail-footer"><Link href="/">← Revenir au fil</Link></footer>
  </main>;
}

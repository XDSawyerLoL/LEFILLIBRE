import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:{default:"Le Fil Libre — L’actualité avec ses sources",template:"%s | Le Fil Libre"},description:"Un journal indépendant : des faits sourcés, du contexte et un fil de veille actualisé en continu.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="fr"><body>{children}</body></html>}

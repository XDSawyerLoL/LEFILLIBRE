# Le Fil Libre — LinkedIn automatique

Le site public reste sur GitHub Pages. Le backend OAuth est séparé dans `backend/` afin que les secrets LinkedIn et les jetons des abonnés ne soient jamais exposés dans le navigateur.

## 1. Créer l’application LinkedIn

Dans LinkedIn Developer Portal, créer une application puis activer :

- **Sign in with LinkedIn using OpenID Connect**
- **Share on LinkedIn**

Les permissions demandées par Le Fil Libre sont :

- `openid`
- `profile`
- `email`
- `w_member_social`

Ajouter comme Redirect URL exactement :

`https://VOTRE-BACKEND/auth/linkedin/callback`

Conserver le Client ID et le Client Secret uniquement côté serveur.

## 2. Déployer `backend/` sur Hostinger Node.js

Le backend n’utilise aucune dépendance npm externe. Il nécessite Node.js 22+ et une zone de stockage persistante pour `DATA_DIR`.

Variables d’environnement obligatoires :

- `PUBLIC_BASE_URL=https://VOTRE-BACKEND`
- `FRONTEND_URL=https://xdsawyerlol.github.io/LEFILLIBRE/`
- `FRONTEND_ORIGIN=https://xdsawyerlol.github.io`
- `LINKEDIN_CLIENT_ID=...`
- `LINKEDIN_CLIENT_SECRET=...`
- `LINKEDIN_REDIRECT_URI=https://VOTRE-BACKEND/auth/linkedin/callback`
- `LINKEDIN_VERSION=202609`
- `STATE_SECRET=...`
- `TOKEN_ENCRYPTION_KEY=...`
- `CRON_SECRET=...`
- `DATA_DIR=./data`

Générer trois secrets longs et différents. Ne jamais les committer dans GitHub.

Le serveur démarre avec :

`npm start`

Test :

`GET https://VOTRE-BACKEND/health`

La réponse doit avoir `configured: true`.

## 3. Relier GitHub Pages au backend

Dans `lefillibre-config.js`, remplacer :

`window.LEFIL_API_BASE = '';`

par l’URL HTTPS du backend, par exemple :

`window.LEFIL_API_BASE = 'https://api.lefillibre.fr';`

Une fois GitHub Pages redéployé, le bouton **Connecter LinkedIn** lance réellement OAuth.

## 4. Activer le job automatique

Ajouter deux secrets GitHub Actions au dépôt :

- `LEFIL_BACKEND_URL` = URL du backend
- `LEFIL_CRON_SECRET` = même valeur que `CRON_SECRET` côté backend

Le workflow `.github/workflows/linkedin-autopublish.yml` appelle ensuite le backend toutes les 15 minutes.

Le backend respecte pour chaque abonné :

- catégories choisies ;
- mode automatique ou validation ;
- maximum de posts par jour ;
- délai minimum entre deux publications ;
- heures silencieuses ;
- anti-doublon par URL d’article.

## Sécurité

- Les tokens LinkedIn sont chiffrés au repos en AES-256-GCM.
- Le navigateur ne conserve qu’un token de session opaque.
- Les OAuth states sont signés et expirent après 10 minutes.
- Les Redirect URLs sont limitées à l’origine officielle du Fil Libre.
- Le job automatique est protégé par `CRON_SECRET`.
- Les secrets ne doivent jamais être placés dans `index.html`, `lefillibre-config.js` ou GitHub Pages.

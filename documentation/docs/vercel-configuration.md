---
sidebar_position: 3
---

# Configuration Vercel

Guide complet pour déployer Tamagotcho (Next.js + Docusaurus) sur Vercel.

## 🚀 Vue d'ensemble

Le projet Tamagotcho utilise une configuration spéciale pour héberger à la fois :
- **Application Next.js** sur `/` (routes principales)
- **Documentation Docusaurus** sur `/documentation/` (sous-chemin)

Cette configuration est définie dans `vercel.json` à la racine du projet.

## 📋 Fichier vercel.json

```json
{
  "buildCommand": "npm run build && cd documentation && npm run build",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/documentation/:path*",
      "destination": "/documentation/build/:path*"
    }
  ],
  "headers": [
    {
      "source": "/documentation/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Explication des options

| Option | Description |
|--------|-------------|
| `buildCommand` | Commande de build complète (Next.js puis Docusaurus) |
| `outputDirectory` | Dossier de sortie Next.js (`.next`) |
| `rewrites` | Redirection `/documentation/*` vers le build Docusaurus |
| `headers` | Cache long terme pour les assets de documentation |

## 🔧 Configuration du build

### Build Commands

```json
{
  "buildCommand": "npm run build && cd documentation && npm run build"
}
```

Cette commande :
1. **Build Next.js** : `npm run build` (exécute `next build --turbopack`)
2. **Build Docusaurus** : `cd documentation && npm run build`

### Output Directories

- **Next.js** : `.next/` (racine)
- **Docusaurus** : `documentation/build/`

## 🔀 Rewrites et routing

### Rewrite Rule

```json
{
  "source": "/documentation/:path*",
  "destination": "/documentation/build/:path*"
}
```

**Comportement :**
- Requête : `https://tamagotcho.vercel.app/documentation/intro`
- Servie depuis : `documentation/build/intro/index.html`

### Routes de l'application

| URL | Servie par | Description |
|-----|------------|-------------|
| `/` | Next.js | Page d'accueil |
| `/dashboard` | Next.js | Dashboard utilisateur |
| `/creature/[id]` | Next.js | Page détail créature |
| `/sign-in` | Next.js | Page de connexion |
| `/api/auth/*` | Next.js API | Routes d'authentification |
| `/documentation/*` | Docusaurus | Documentation technique |

## 🌐 Headers HTTP

### Cache Control

```json
{
  "source": "/documentation/(.*)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

**Bénéfices :**
- ✅ Cache long terme (1 an) pour les assets de documentation
- ✅ Réduction de la bande passante
- ✅ Temps de chargement plus rapide

## 🔐 Variables d'environnement

### Configuration dans Vercel Dashboard

Ajouter les variables dans **Settings > Environment Variables** :

#### Production

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Connexion MongoDB |
| `MONGODB_DATABASE_NAME` | `tamagotcho` | Nom de la base |
| `BETTER_AUTH_SECRET` | `secret_32_chars_min` | Secret Better Auth |
| `NEXT_PUBLIC_APP_URL` | `https://tamagotcho.vercel.app` | URL de production |
| `GITHUB_CLIENT_ID` | `your_client_id` | GitHub OAuth ID |
| `GITHUB_CLIENT_SECRET` | `your_secret` | GitHub OAuth Secret |

#### Preview (Branches)

Même configuration que Production, ou utiliser des credentials de test.

### ⚠️ Sécurité

:::danger Variables sensibles
Ne **JAMAIS** commiter les valeurs réelles de :
- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `GITHUB_CLIENT_SECRET`

Toujours utiliser `.env.local` en local et Vercel Environment Variables en production.
:::

## 📦 Processus de déploiement

### Déploiement automatique

1. **Push sur `master`** → Déploiement en production automatique
2. **Pull Request** → Déploiement preview automatique
3. **Autre branche** → Peut être configuré dans Vercel

### Déploiement manuel

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 🔍 Vérifications post-déploiement

### Checklist

- [ ] Application Next.js accessible sur `/`
- [ ] Documentation accessible sur `/documentation/`
- [ ] API routes fonctionnelles (`/api/auth/*`)
- [ ] Images et assets chargés correctement
- [ ] Authentification GitHub OAuth fonctionne
- [ ] Connexion MongoDB établie
- [ ] Pas d'erreurs dans les logs Vercel

### URLs à tester

```bash
# Application principale
https://tamagotcho.vercel.app/

# Dashboard (requiert authentification)
https://tamagotcho.vercel.app/dashboard

# Documentation
https://tamagotcho.vercel.app/documentation/

# API Health check
https://tamagotcho.vercel.app/api/auth/session
```

## 🐛 Troubleshooting

### Documentation non accessible

**Symptôme** : 404 sur `/documentation/*`

**Solutions :**
1. Vérifier que le build Docusaurus s'est bien exécuté dans les logs
2. Vérifier la présence de `documentation/build/` après le build
3. Vérifier les rewrites dans `vercel.json`

```bash
# Tester le build en local
npm run build
cd documentation && npm run build
```

### Variables d'environnement non définies

**Symptôme** : Erreurs `process.env.XXX is undefined`

**Solutions :**
1. Vérifier dans Vercel Dashboard > Settings > Environment Variables
2. Redéployer après ajout de variables
3. Vérifier le préfixe `NEXT_PUBLIC_` pour les variables client

### Build qui échoue

**Symptôme** : Build failed in Vercel

**Solutions :**
1. Vérifier les logs de build dans Vercel Dashboard
2. Tester le build en local : `npm run build`
3. Vérifier que toutes les dépendances sont dans `package.json`
4. Vérifier la version de Node.js (20.x recommandée)

### OAuth GitHub ne fonctionne pas

**Symptôme** : Erreur lors de la connexion GitHub

**Solutions :**
1. Vérifier les URLs de callback dans GitHub OAuth App :
   - Homepage URL : `https://tamagotcho.vercel.app`
   - Callback URL : `https://tamagotcho.vercel.app/api/auth/callback/github`
2. Vérifier `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`
3. Vérifier `NEXT_PUBLIC_APP_URL` pointe vers le bon domaine

## 📊 Performance

### Optimisations activées

- ✅ **Turbopack** pour des builds plus rapides
- ✅ **Image Optimization** Next.js
- ✅ **Static Generation** pour les pages non-dynamiques
- ✅ **Edge Functions** pour les API routes
- ✅ **Cache long terme** pour les assets de documentation

### Métriques recommandées

| Métrique | Cible |
|----------|-------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

Monitorer via **Vercel Analytics** et **Web Vitals**.

## 🔄 Mises à jour

### Update de la documentation

1. Modifier les fichiers dans `documentation/docs/`
2. Commit et push
3. Vercel rebuild automatiquement

### Update de l'application

1. Modifier le code dans `src/`
2. Tester en local : `npm run dev`
3. Commit et push
4. Vercel rebuild automatiquement

## 🌍 Domaines personnalisés

### Ajouter un domaine

1. Aller dans **Vercel Dashboard > Settings > Domains**
2. Ajouter le domaine (ex: `tamagotcho.com`)
3. Configurer les DNS selon les instructions Vercel
4. Mettre à jour `NEXT_PUBLIC_APP_URL` et GitHub OAuth URLs

### SSL/TLS

Vercel fournit automatiquement des certificats SSL via Let's Encrypt.

## 📈 Monitoring

### Logs Vercel

Accéder aux logs en temps réel :
- Vercel Dashboard > Deployments > [Deployment] > Logs

### Erreurs Runtime

Les erreurs sont loggées automatiquement dans :
- Vercel Dashboard > Logs > Runtime Logs

### Analytics

Activer Vercel Analytics pour :
- Web Vitals
- Trafic
- Géolocalisation des visiteurs

## 🔗 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Configuration réalisée pour Tamagotcho - My Digital School**

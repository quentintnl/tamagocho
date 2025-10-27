# Déploiement Vercel - Guide Rapide

Ce guide explique comment déployer Tamagotcho (Next.js + Docusaurus) sur Vercel.

## 🚀 Première installation

### 1. Importer le projet sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur **"Add New Project"**
3. Importer depuis GitHub : `RiusmaX/tamagotcho`
4. Sélectionner le repository

### 2. Configuration du build

Vercel détectera automatiquement Next.js. La configuration personnalisée est dans `vercel.json`.

**Paramètres détectés automatiquement :**
- Framework : Next.js
- Build Command : `npm run build && cd documentation && npm run build`
- Output Directory : `.next`
- Install Command : `npm install`

:::info
Vercel lira automatiquement le fichier `vercel.json` pour les rewrites et headers.
:::

### 3. Variables d'environnement

Ajouter dans **Settings > Environment Variables** :

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE_NAME=tamagotcho
BETTER_AUTH_SECRET=votre_secret_32_caracteres_minimum
NEXT_PUBLIC_APP_URL=https://tamagotcho.vercel.app
GITHUB_CLIENT_ID=votre_github_client_id
GITHUB_CLIENT_SECRET=votre_github_client_secret
```

**Important :** Définir ces variables pour les environnements :
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Déployer

Cliquer sur **"Deploy"** et attendre la fin du build (~2-5 minutes).

## 🔧 Configuration GitHub OAuth

1. Aller sur [GitHub OAuth Apps](https://github.com/settings/developers)
2. Cliquer sur **"New OAuth App"**
3. Remplir :
   - **Application name** : Tamagotcho
   - **Homepage URL** : `https://tamagotcho.vercel.app`
   - **Authorization callback URL** : `https://tamagotcho.vercel.app/api/auth/callback/github`
4. Copier **Client ID** et **Client Secret**
5. Les ajouter dans Vercel Environment Variables

## 📊 URLs de l'application

Après déploiement :

- **Application** : `https://tamagotcho.vercel.app/`
- **Dashboard** : `https://tamagotcho.vercel.app/dashboard`
- **Documentation** : `https://tamagotcho.vercel.app/documentation/`
- **API Auth** : `https://tamagotcho.vercel.app/api/auth/*`

## 🔄 Déploiements automatiques

- **Push sur `master`** → Déploiement Production
- **Pull Request** → Déploiement Preview
- **Commentaires sur PR** → URL de preview

## ✅ Vérifications post-déploiement

- [ ] Application accessible sur `/`
- [ ] Documentation accessible sur `/documentation/`
- [ ] Connexion MongoDB fonctionne
- [ ] GitHub OAuth fonctionne
- [ ] Pas d'erreurs dans les logs Vercel

## 🐛 En cas de problème

### Build qui échoue

1. Vérifier les logs dans Vercel Dashboard
2. Tester en local : `npm run build`
3. Vérifier les dépendances dans `package.json`

### Documentation non accessible

1. Vérifier que `documentation/build/` existe après le build
2. Vérifier les rewrites dans `vercel.json`

### Variables d'environnement manquantes

1. Vérifier Settings > Environment Variables
2. Redéployer après ajout de variables

## 📚 Documentation complète

Pour plus de détails, consultez :
- [Configuration Vercel complète](./documentation/docs/vercel-configuration.md)
- [Guide de développement](./documentation/docs/development-guide.md)

---

**Support** : [GitHub Issues](https://github.com/RiusmaX/tamagotcho/issues)

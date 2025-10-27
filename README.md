# 🎮 Tamagotcho

Application web moderne inspirée des célèbres Tamagotchi, développée avec Next.js 15, TypeScript et MongoDB.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Fonctionnalités

- 🎨 **Génération aléatoire de monstres** - Près de 200 000 combinaisons uniques
- 😊 **Système d'états émotionnels** - 5 états différents (heureux, triste, en colère, affamé, endormi)
- 🔐 **Authentification sécurisée** - Email/Password + GitHub OAuth via Better Auth
- 📊 **Dashboard personnel** - Gestion de vos créatures et statistiques
- 🎯 **Système de quêtes** - Missions et récompenses
- 📱 **Design responsive** - Interface optimisée mobile et desktop
- 🌙 **Mode sombre** - Support du mode sombre/clair

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20.0 ou supérieur
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/RiusmaX/tamagotcho.git
cd tamagotcho

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📚 Documentation

La documentation complète du projet est disponible dans le dossier `/documentation` et accessible en ligne :

- **Production** : [https://tamagotcho.vercel.app/documentation](https://tamagotcho.vercel.app/documentation)
- **Local** : `npm run dev:docs` puis [http://localhost:3000](http://localhost:3000)

### Sections disponibles

- 📐 **Architecture** - Principes SOLID et Clean Architecture
- 🧩 **Composants** - Documentation des composants React
- 👾 **Système de Monstres** - Génération et gestion des créatures
- 🔒 **Authentification** - Configuration et utilisation de Better Auth
- 🛠️ **Guide de développement** - Instructions pour contribuer

## 🏗️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| **Framework** | Next.js 15.5.4 (App Router + Turbopack) |
| **Langage** | TypeScript 5.x (mode strict) |
| **UI** | React 19.1.0 |
| **Styling** | Tailwind CSS 4 |
| **Base de données** | MongoDB 6.20.0 + Mongoose 8.19.1 |
| **Authentification** | Better Auth 1.3.24 |
| **Déploiement** | Vercel |
| **Documentation** | Docusaurus |

## 📁 Structure du projet

```
tamagotcho/
├── src/
│   ├── app/              # Next.js App Router (pages et layouts)
│   ├── components/       # Composants React réutilisables
│   ├── types/           # Types et interfaces TypeScript
│   ├── services/        # Logique métier (génération de monstres, etc.)
│   ├── db/              # Connexion MongoDB et modèles Mongoose
│   ├── lib/             # Utilitaires et configuration (auth, utils)
│   ├── actions/         # Server Actions Next.js
│   └── hooks/           # Custom React hooks
├── documentation/       # Documentation Docusaurus
├── public/             # Assets statiques
├── specs/              # Spécifications du projet
└── docs/               # Documentation additionnelle
```

## 🎨 Principes d'architecture

Le projet suit rigoureusement les **principes SOLID** et l'**architecture Clean** :

- ✅ **Single Responsibility** - Chaque composant a une seule responsabilité
- ✅ **Open/Closed** - Ouvert à l'extension, fermé à la modification
- ✅ **Liskov Substitution** - Les types peuvent être substitués sans casser le code
- ✅ **Interface Segregation** - Interfaces spécifiques et focalisées
- ✅ **Dependency Inversion** - Dépendance vers des abstractions

Pour plus de détails, consultez la [documentation architecture](./documentation/docs/architecture).

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev              # Démarre Next.js (port 3000)
npm run dev:docs         # Démarre la documentation (port 3000)

# Build
npm run build            # Build complet (Next.js + Documentation)
npm run build:next       # Build Next.js uniquement
npm run build:docs       # Build documentation uniquement

# Production
npm start                # Démarre le serveur en production

# Qualité de code
npm run lint             # Linter avec ts-standard (auto-fix)
```

## 🔐 Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
# MongoDB
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
MONGODB_DATABASE_NAME="tamagotcho"

# Better Auth
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="votre_secret_key_ici"

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID="votre_github_client_id"
GITHUB_CLIENT_SECRET="votre_github_client_secret"
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de développement](./documentation/docs/development-guide.md) pour :

- Installer l'environnement de développement
- Comprendre les conventions de code
- Soumettre une Pull Request

### Workflow

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit les changements (`git commit -m 'feat: ajout de ma feature'`)
4. Push vers la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **RiusmaX** - [GitHub](https://github.com/RiusmaX)

Projet réalisé dans le cadre de la formation **My Digital School**.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Better Auth](https://www.better-auth.com/) - Solution d'authentification
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Docusaurus](https://docusaurus.io/) - Générateur de documentation
- [Vercel](https://vercel.com/) - Plateforme de déploiement

---

**Développé avec ❤️ et ☕ par l'équipe Tamagotcho**

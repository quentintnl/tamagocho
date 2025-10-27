---
sidebar_position: 2
---

# Guide de Développement

Guide complet pour contribuer au projet Tamagotcho.

## 🚀 Installation

### Prérequis

- **Node.js** : Version 20.0 ou supérieure
- **npm** : Inclus avec Node.js
- **MongoDB** : Base de données (locale ou Atlas)
- **Git** : Pour le contrôle de version

### Cloner le projet

```bash
git clone https://github.com/RiusmaX/tamagotcho.git
cd tamagotcho
```

### Installer les dépendances

```bash
# Dépendances du projet principal
npm install

# Dépendances de la documentation
cd documentation
npm install
cd ..
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
# MongoDB
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
MONGODB_DATABASE_NAME="tamagotcho"

# Better Auth
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your_secret_key_here"

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

### Lancer le projet

```bash
# Serveur Next.js de développement
npm run dev

# Documentation (dans un terminal séparé)
npm run dev:docs
```

**URLs :**
- Application : [http://localhost:3000](http://localhost:3000)
- Documentation : [http://localhost:3000](http://localhost:3000) (port 3000 par défaut pour Docusaurus)

## 🏗️ Structure du projet

```
tamagotcho/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── layout.tsx         # Layout racine
│   │   ├── dashboard/         # Page dashboard
│   │   ├── creature/          # Pages créatures
│   │   └── api/               # Routes API
│   ├── components/            # Composants React
│   │   ├── button.tsx
│   │   ├── header.tsx
│   │   ├── monsters/          # Composants monstres
│   │   ├── dashboard/         # Composants dashboard
│   │   └── forms/             # Formulaires
│   ├── types/                 # Types TypeScript
│   │   ├── monster.ts
│   │   ├── components.ts
│   │   └── forms/
│   ├── services/              # Logique métier
│   │   └── monsters/
│   ├── db/                    # Base de données
│   │   ├── index.ts           # Connexion MongoDB
│   │   └── models/            # Modèles Mongoose
│   ├── lib/                   # Utilitaires
│   │   ├── auth.ts            # Configuration Better Auth
│   │   └── utils/
│   ├── actions/               # Server Actions
│   │   ├── monsters.actions.ts
│   │   └── navigation.actions.ts
│   └── hooks/                 # Custom hooks
│       ├── dashboard/
│       └── monsters/
├── documentation/             # Documentation Docusaurus
├── public/                    # Assets statiques
├── specs/                     # Spécifications PDF
├── docs/                      # Documentation guides
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.ts
└── vercel.json               # Configuration Vercel
```

## 🛠️ Stack technique

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 15.5.4 |
| Langage | TypeScript | 5.x |
| UI | React | 19.1.0 |
| Styling | Tailwind CSS | 4.x |
| Base de données | MongoDB | 6.20.0 |
| ORM | Mongoose | 8.19.1 |
| Auth | Better Auth | 1.3.24 |
| Build | Turbopack | (Next.js) |
| Lint | ts-standard | 12.0.2 |
| Doc | Docusaurus | Latest |

## 📝 Conventions de code

### TypeScript

```typescript
// ✅ BON : Typage explicite
function createMonster(name: string): Promise<DBMonster> {
  // ...
}

// ❌ ÉVITER : any ou types implicites
function createMonster(name) {
  // ...
}
```

### Composants React

```typescript
// ✅ BON : Props typées avec destructuration
function MonsterCard({
  name,
  level,
  traits
}: {
  name: string
  level: number
  traits: MonsterTraits
}): React.ReactNode {
  return <div>...</div>
}

// ✅ BON : Valeurs par défaut explicites
function Button({
  children = 'Click me',
  size = 'md',
  variant = 'primary'
}: ButtonProps): React.ReactNode {
  // ...
}
```

### Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase | `MonsterCard.tsx` |
| Fonctions | camelCase | `generateRandomTraits()` |
| Constantes | UPPER_SNAKE_CASE | `DEFAULT_MONSTER_LEVEL` |
| Types/Interfaces | PascalCase | `MonsterTraits` |
| Fichiers utils | kebab-case | `monster.utils.ts` |

### Imports

```typescript
// ✅ BON : Ordre des imports
// 1. Bibliothèques externes
import { useState } from 'react'
import mongoose from 'mongoose'

// 2. Alias @ (src)
import { Button } from '@/components'
import type { MonsterTraits } from '@/types/monster'

// 3. Imports relatifs
import { generateRandomTraits } from './monster-generator'
```

## 🎨 Styling

### Tailwind CSS

```typescript
// ✅ BON : Classes utilitaires Tailwind
<div className="px-4 py-2 bg-moccaccino-500 rounded-md">
  Content
</div>

// ✅ BON : Classes conditionnelles
<button
  className={`
    px-4 py-2 rounded-md
    ${disabled ? 'bg-gray-300' : 'bg-moccaccino-500 hover:bg-moccaccino-700'}
  `}
>
  Click
</button>
```

### Palette de couleurs personnalisée

```css
/* globals.css */
--color-moccaccino-500: #f7533c;
--color-lochinvar-500: #469086;
--color-fuchsia-blue-500: #8f72e0;
```

Utilisation :

```tsx
<div className="bg-moccaccino-500 text-white">
  Tamagotcho
</div>
```

## 🔄 Workflow Git

### Branches

```bash
# Créer une branche feature
git checkout -b feature/nom-de-la-feature

# Créer une branche fix
git checkout -b fix/nom-du-bug

# Créer une branche docs
git checkout -b docs/nom-de-la-doc
```

### Commits

Utiliser le format **Conventional Commits** :

```bash
# Features
git commit -m "feat: ajout du système de quêtes"

# Fixes
git commit -m "fix: correction du bug de génération de monstre"

# Documentation
git commit -m "docs: mise à jour du guide d'installation"

# Style
git commit -m "style: formatage du code avec ts-standard"

# Refactor
git commit -m "refactor: extraction du service de génération"

# Tests
git commit -m "test: ajout des tests pour monster-generator"
```

### Pull Requests

1. **Créer une branche** depuis `master`
2. **Développer** la fonctionnalité
3. **Linter** : `npm run lint`
4. **Tester** localement
5. **Commit** avec messages conventionnels
6. **Push** : `git push origin feature/ma-feature`
7. **Créer une PR** sur GitHub
8. **Review** et merge

## 🧪 Tests

### Structure recommandée

```
src/
├── services/
│   └── monsters/
│       ├── monster-generator.ts
│       └── monster-generator.test.ts
```

### Exemple de test

```typescript
// monster-generator.test.ts
import { generateRandomTraits } from './monster-generator'

describe('generateRandomTraits', () => {
  it('devrait générer des traits valides', () => {
    const traits = generateRandomTraits()
    
    expect(traits.bodyColor).toMatch(/^#[0-9A-F]{6}$/i)
    expect(['round', 'square', 'tall', 'wide']).toContain(traits.bodyStyle)
  })

  it('devrait générer des monstres uniques', () => {
    const traits1 = generateRandomTraits()
    const traits2 = generateRandomTraits()
    
    expect(JSON.stringify(traits1)).not.toBe(JSON.stringify(traits2))
  })
})
```

## 🚢 Déploiement

### Vercel (Recommandé)

Le projet est configuré pour Vercel avec déploiement automatique :

1. **Push sur master** → Déploiement en production
2. **PR** → Preview deployment automatique

### Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build && cd documentation && npm run build",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/documentation/:path*",
      "destination": "/documentation/build/:path*"
    }
  ]
}
```

### Variables d'environnement

Ajouter dans **Vercel Dashboard > Settings > Environment Variables** :

- `MONGODB_URI`
- `MONGODB_DATABASE_NAME`
- `BETTER_AUTH_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL`

## 📋 Checklist avant commit

- [ ] Code formaté avec `npm run lint`
- [ ] Pas d'erreurs TypeScript
- [ ] Composants testés en local
- [ ] Documentation mise à jour si nécessaire
- [ ] Variables sensibles dans `.env.local` (pas dans le code)
- [ ] Imports organisés correctement
- [ ] Messages de commit conventionnels

## 🐛 Debugging

### Next.js

```typescript
// Logs serveur
console.log('[SERVER]', data)

// Logs client
console.log('[CLIENT]', data)
```

### MongoDB

```typescript
// Activer les logs Mongoose
mongoose.set('debug', true)
```

### Better Auth

```typescript
// Vérifier la session
const session = await auth()
console.log('Session:', session)
```

## 📚 Ressources utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [React Documentation](https://react.dev)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](https://github.com/RiusmaX/tamagotcho/blob/master/CONTRIBUTING.md).

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/RiusmaX/tamagotcho/issues)
- **Discussions** : [GitHub Discussions](https://github.com/RiusmaX/tamagotcho/discussions)

---

**Bon développement ! 🎮**

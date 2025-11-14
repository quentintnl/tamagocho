# Notes d'Implementation - Tomatgotchi

## Vue d'ensemble

Tomatgotchi est une application web de type Tamagotchi realisee pour My Digital School. Jeu interactif ou les utilisateurs elevent des creatures virtuelles inspirees des tomates.

**Stack**: Next.js 15.5.4 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS 4, Better Auth, Stripe, MongoDB/Mongoose.

## Architecture - Clean Architecture & SOLID

### Separation des couches
- **Presentation** (`src/components/`): Composants React purs, UI uniquement, SRP respecte
- **Application** (`src/app/`): Routing Next.js, orchestration sans logique metier
- **Domaine** (`src/services/`): Logique metier (generation monstres, actions, XP, accessoires, wallet, quetes)
- **Infrastructure** (`src/db/`, `src/repositories/`): Persistance MongoDB/Mongoose

### Principes appliques
- **Open/Closed**: Composants extensibles via props (variants, tailles)
- **Dependency Inversion**: Couches superieures dependent d'abstractions TypeScript
- Server Components par defaut pour reduction JavaScript client

## Systemes cles

### Generation de monstres
- **Procedurale deterministe** avec seed (meme nom = meme design)
- **Traits**: couleurs tomates, formes (round/square/tall/wide), yeux, antennes, accessoires
- **Rendu SVG**: modes illustrated (vectoriel + animations CSS) et pixel (16x16)
- 80+ animations selon etat emotionnel (bounces, sways, blinks)

### Experience & Niveaux
- **Table XpLevel MongoDB**: seuils configurable sans code (Niv1: 0XP, Niv2: 50XP, Niv5: 200XP max)
- **Gain**: action appropriee +10XP, inappropriee 0XP (pas de penalite)

### Accessoires
- **Catalogue**: 30 accessoires (hat, glasses, necklace, clothing, handheld, background)
- **Rarete**: common, rare, epic, legendary
- **Achat**: Tomatokens (monnaie virtuelle)
- **Collections**: `accessories` (catalogue), `owned_accessories` (possessions utilisateur)

### Wallet & Paiement
- **Tomatokens**: acquerables via Stripe (1 EUR = 100 Tomatokens), quetes, progression
- **Stripe**: webhooks, historique transactions

### Quetes quotidiennes
- Objectifs: connexion, actions (nourrir/jouer/dormir), niveau
- Reset automatique minuit
- Recompenses: Tomatokens + XP

### Authentification
- **Better Auth**: email/password, OAuth, sessions securisees, CSRF integre
- **Middleware**: protection routes avec redirection `/sign-in`

## Difficultes resolues

### Migration systeme generation
- Remplacement `draw: String` → `traits: String` (JSON MonsterDesign)
- Scripts migration donnees + mise a jour services

### Gestion etats monstres
- 5 etats emotionnels (happy, sad, angry, hungry, sleepy)
- Centralisation logique dans `monster-action.service.ts`
- CSS variables pour animations fluides

### Performance SVG
- Lazy loading `MonsterPreview`
- `will-change` CSS, mode pixel optimise mobile

### MongoDB asynchrone
- Singleton connexion (`src/db/connection.ts`) evite fuites memoire

### TypeScript strict
- Types dedies `src/types/` separant types DB et metier

## Optimisations

### Performance
- **Turbopack**: builds rapides
- **Server Components**: requetes DB serveur, SEO ameliore
- **Index MongoDB**: `ownerId`, `userId`, `level`
- **Projection selective**: `.select()` Mongoose
- **Caching**: React `cache()`, ISR avec `revalidate`
- **Bundle**: tree shaking, imports selectifs, lazy loading

## Ameliorations futures

### Gameplay
- Reproduction monstres (hybrides)
- Mini-jeux (puzzles, memory)
- Systeme combat avec stats
- Evenements saisonniers

### Social
- Leaderboard global
- Marketplace echange accessoires/monstres
- Guildes avec quetes collaboratives

### Technique
- React Server Actions pour API routes
- WebSocket notifications temps reel
- PWA avec offline + push notifications
- Tests (Vitest, React Testing Library, Playwright)
- Redis cache, Bull queue system, CDN assets

### UX
- Accessibilite ARIA complete
- Navigation clavier totale
- Mode contraste eleve
- Analytics (Vercel/GA), error tracking (Sentry)
- i18n (next-intl), multi-devises Stripe



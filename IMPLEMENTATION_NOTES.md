# Notes d'Implementation - Tomatgotchi

## Vue d'ensemble du projet

Tomatgotchi est une application web de type Tamagotchi realisee dans le cadre d'un projet scolaire pour My Digital School. Il s'agit d'un jeu interactif ou les utilisateurs peuvent creer, elever et prendre soin de creatures virtuelles inspirees des tomates.

Le projet utilise Next.js 15.5.4 avec l'App Router, React 19, TypeScript en mode strict, et Tailwind CSS 4 pour le styling. L'authentification est geree par Better Auth, le paiement par Stripe, et les donnees sont stockees dans MongoDB via Mongoose.

---

## 1. Choix d'implementation

### 1.1 Architecture technique

#### Stack technologique
- **Framework**: Next.js 15.5.4 avec App Router et Turbopack pour des builds plus rapides
- **Langage**: TypeScript 5 avec configuration stricte pour la securite des types
- **Base de donnees**: MongoDB avec Mongoose pour la modelisation des schemas
- **Authentification**: Better Auth v1.3.24 pour une gestion moderne et securisee
- **Paiement**: Stripe pour l'integration e-commerce (achat de Tomatokens et accessoires)
- **Styling**: Tailwind CSS 4 avec palette de couleurs personnalisee (moccaccino, lochinvar, fuchsia-blue)
- **Linting**: ts-standard pour maintenir une coherence dans le code TypeScript

#### Choix de l'App Router Next.js 15
Le choix de Next.js 15 avec l'App Router permet de beneficier des Server Components par defaut, ce qui ameliore les performances en reduisant le JavaScript envoye au client. Cette architecture facilite egalement la separation entre logique serveur et client, en accord avec les principes de Clean Architecture.

#### MongoDB et Mongoose
MongoDB a ete choisi pour sa flexibilite schema-less, particulierement utile pour les systemes evolutifs comme les monstres avec leurs traits generes proceduralement. Mongoose fournit une couche de validation et de typage qui s'integre bien avec TypeScript.

### 1.2 Architecture applicative - Clean Architecture et SOLID

Le projet suit rigoureusement les principes SOLID et Clean Architecture avec une separation claire des couches :

#### Couche Presentation (src/components/)
Composants React purs sans logique metier, responsables uniquement du rendu UI. Chaque composant suit le principe de responsabilite unique (SRP).

Exemples :
- `MonsterPreview` : affiche uniquement le rendu SVG d'un monstre
- `BenefitCard` : affiche une carte d'avantage avec icon, titre et description
- `ActionsSection` : presente les actions disponibles sans logique de jeu

#### Couche Application (src/app/)
Gestion du routing Next.js et composition des pages. Cette couche orchestre les composants et services sans contenir de logique metier complexe.

#### Couche Domaine (src/services/)
Contient toute la logique metier du jeu :
- `monster-generator.ts` : generation procedurale des traits de monstres
- `monster-action.service.ts` : logique des actions (nourrir, jouer, dormir)
- `xp-level.service.ts` : calcul des niveaux et experience
- `accessory.service.ts` : gestion du catalogue d'accessoires
- `wallet.service.ts` : gestion de la monnaie virtuelle (Tomatokens)
- `daily-quest.service.ts` : systeme de quetes quotidiennes

#### Couche Infrastructure (src/db/ et src/repositories/)
Gestion de la persistance des donnees avec MongoDB via Mongoose. Les repositories abstraient l'acces aux donnees.

#### Application du principe Open/Closed
Les composants sont extensibles sans modification. Par exemple, `ActionCard` accepte differents variants (primary, ghost, outline) et tailles (sm, md, lg, xl) via props.

#### Dependency Inversion
Les couches superieures dependent d'abstractions TypeScript (interfaces et types) plutot que d'implementations concretes. Les services sont injectables et testables independamment.

### 1.3 Systeme de generation de monstres

#### Approche procedurale avec seed
Le systeme utilise une generation procedurale deterministe basee sur une seed. Cela garantit qu'un meme nom de monstre produira toujours le meme design, permettant la coherence et la reproductibilite.

#### Types MonsterTraits
Chaque monstre possede des traits generes aleatoirement :
- Couleurs inspirees des varietes de tomates (rouge, jaune, orange, vert, pourpre, noir)
- Formes de corps (round, square, tall, wide) representant differentes varietes
- Styles d'yeux (big, small, star, sleepy)
- Styles d'antennes representant tiges et feuilles (single, double, curly, none)
- Accessoires optionnels (horns, ears, tail, none)

#### Rendu SVG dynamique
Le composant `MonsterPreview` genere du SVG en temps reel avec :
- Mode illustrated : rendu vectoriel avec degrades et animations CSS complexes
- Mode pixel : rendu pixel art avec grille 16x16
- 80+ animations differentes selon l'etat emotionnel (bounces, sways, blinks)
- Badge d'etat dynamique avec emoji

### 1.4 Systeme d'experience et de niveaux

#### Table separee XpLevel
Plutot qu'une formule calculee, les seuils d'XP sont stockes dans une table MongoDB separee pour permettre un reequilibrage facile sans modification du code.

Structure des niveaux :
- Niveau 1 : 0 XP (depart)
- Niveau 2 : 50 XP
- Niveau 3 : 100 XP
- Niveau 4 : 150 XP
- Niveau 5 : 200 XP (maximum)

#### Gain d'XP par actions
Les actions correctes rapportent de l'XP :
- Action appropriee a l'etat du monstre : +10 XP
- Action inappropriee : 0 XP (pas de penalite)

Ce systeme encourage le joueur a comprendre les besoins de son monstre sans le punir severement.

### 1.5 Systeme d'accessoires et d'arriere-plans

#### Architecture du systeme
Le systeme d'accessoires suit une architecture complete avec :
- Catalogue de 30 accessoires varies (chapeaux, lunettes, bijoux, vetements, etc.)
- Systeme d'achat avec Tomatokens (monnaie virtuelle)
- Equipement/desequipement sur les monstres
- Categorisation (hat, glasses, necklace, clothing, handheld, background)
- Rarete (common, rare, epic, legendary)

#### Integration avec le wallet
Les accessoires sont achetes avec des Tomatokens, qui peuvent etre acquis via :
- Stripe pour l'achat reel (1 EUR = 100 Tomatokens)
- Recompenses de quetes quotidiennes
- Progression dans le jeu

#### Stockage et gestion
Deux collections MongoDB :
- `accessories` : catalogue global des accessoires disponibles
- `owned_accessories` : accessoires possedes par utilisateur avec quantite et equipement

### 1.6 Systeme de quetes quotidiennes

#### Objectifs et recompenses
Les quetes quotidiennes encouragent l'engagement regulier :
- Connexion quotidienne
- Actions specifiques (nourrir, jouer, dormir)
- Objectifs de niveau
- Recompenses en Tomatokens et XP

#### Reset quotidien
Un systeme de reset automatique a minuit reinitialise les quetes disponibles, encourageant les visites quotidiennes.

### 1.7 Authentification et securite

#### Better Auth
Better Auth offre une solution moderne avec :
- Support de multiples providers (email/password, OAuth)
- Gestion securisee des sessions
- Protection CSRF integree
- Hooks React pour une integration facile

#### Middleware de protection
Un middleware Next.js protege les routes necessitant une authentification, redirigeant vers `/sign-in` si necessaire.

### 1.8 Integration Stripe

#### Paiements securises
Stripe gere les paiements pour l'achat de Tomatokens :
- Interface React avec `@stripe/react-stripe-js`
- Webhooks pour la validation des paiements
- Conversion automatique EUR vers Tomatokens
- Historique des transactions dans le wallet

---

## 2. Difficultes rencontrees

### 2.1 Migration du systeme de generation

#### Contexte
Remplacement complet du systeme initial de generation de monstres par celui du repository v0-tomatgotchi, impliquant des changements majeurs dans la structure des donnees.

#### Changement de schema
Migration du champ `draw: String` vers `traits: String` (JSON stringifie de MonsterDesign). Cette migration a necessite :
- Scripts de migration pour les donnees existantes
- Mise a jour de tous les services et actions utilisant les monstres
- Tests approfondis pour eviter les regressions

#### Documentation de migration
Creation de `MIGRATION_NOTES.md` pour documenter tous les changements et faciliter la comprehension de l'equipe.

### 2.2 Gestion de l'etat des monstres

#### Complexite des etats
La gestion des 5 etats emotionnels (happy, sad, angry, hungry, sleepy) avec leurs animations et transitions a presente des defis :
- Synchronisation entre l'etat en base de donnees et l'affichage
- Animations CSS complexes necessitant une optimisation
- Coherence entre mode illustrated et pixel

#### Solution adoptee
Centralisation de la logique d'etat dans `monster-action.service.ts` avec des regles claires de transition, et utilisation de CSS variables pour faciliter les animations.

### 2.3 Performance du rendu SVG

#### Probleme initial
Le rendu de nombreux monstres en SVG avec animations causait des problemes de performance sur mobile.

#### Optimisations appliquees
- Lazy loading des composants MonsterPreview
- Reduction de la complexite des degrades en mode illustrated
- Utilisation de `will-change` CSS pour optimiser les animations
- Mode pixel plus leger pour les devices moins performants

### 2.4 Gestion asynchrone MongoDB

#### Connexions multiples
Next.js avec App Router peut creer de multiples connexions MongoDB si mal gere.

#### Solution
Implementation d'un singleton de connexion dans `src/db/connection.ts` qui reutilise la connexion existante et evite les fuites memoire.

### 2.5 Typage TypeScript strict

#### Complexite du typage
Mode strict TypeScript impose des contraintes importantes, notamment pour :
- Les objets Mongoose (types `Document` vs types metier)
- Les Server Actions retournant des donnees serialisables
- Les composants avec props optionnels complexes

#### Approche
Creation de types dedies dans `src/types/` pour chaque domaine (monster, accessory, wallet, quest) avec separation claire entre types DB et types metier.

---

## 3. Optimisations appliquees

### 3.1 Performance Next.js

#### Turbopack
Utilisation de Turbopack (`--turbopack`) pour le dev et le build, reduisant considerablement les temps de compilation.

#### Server Components
Maximisation de l'utilisation des Server Components pour :
- Reduire le JavaScript cote client
- Executer les requetes DB directement cote serveur
- Ameliorer le SEO et le temps de chargement initial

#### Route Handlers optimises
Les API routes (`/api/*`) utilisent des reponses en streaming quand possible et des caches strategiques.

### 3.2 Base de donnees

#### Index MongoDB
Ajout d'index sur les champs frequemment requetes :
- `ownerId` sur la collection monsters
- `userId` sur owned_accessories
- `level` sur xp_levels

#### Projection selective
Utilisation de `.select()` Mongoose pour ne recuperer que les champs necessaires, reduisant la taille des reponses.

#### Aggregation pipelines
Pour les requetes complexes (statistiques, leaderboards), utilisation des pipelines d'aggregation MongoDB plutot que du traitement cote application.

### 3.3 Caching

#### React Cache
Utilisation de `cache()` pour memoriser les resultats de requetes coteuses dans les Server Components.

#### Revalidation strategique
Configuration de `revalidate` sur les pages avec donnees statiques pour beneficier de l'ISR (Incremental Static Regeneration).

### 3.4 Bundle size

#### Tree shaking
Configuration Webpack/Turbopack pour eliminer le code mort.

#### Import selectifs
Import uniquement des composants necessaires depuis les bibliotheques (ex: Stripe, Better Auth).

#### Lazy loading
Chargement dynamique des composants lourds avec `next/dynamic`.

---

## 4. Ameliorations futures possibles

### 4.1 Fonctionnalites gameplay

#### Systeme de reproduction
Permettre aux utilisateurs de faire se reproduire leurs monstres pour creer des hybrides avec traits combines.

#### Mini-jeux interactifs
Ajouter des mini-jeux (puzzles, memory) pour gagner des Tomatokens et de l'XP de facon ludique.

#### Systeme de combat
Permettre des combats amicaux entre monstres avec systeme de statistiques (force, agilite, defense).

#### Evenements temporaires
Evenements saisonniers avec accessoires exclusifs et quetes speciales.

### 4.2 Aspect social

#### Classement global
Leaderboard base sur le niveau, le nombre de monstres, ou les Tomatokens possedes.

#### Echanges entre joueurs
Marketplace pour echanger accessoires et monstres entre utilisateurs.

#### Guildes ou equipes
Systeme de guildes avec quetes collaboratives et recompenses partagees.

#### Fil d'actualite
Feed social pour voir les creations et achievements des autres joueurs.

### 4.3 Optimisations techniques

#### Migration vers React Server Actions
Remplacer certaines API routes par des Server Actions pour simplifier le code et ameliorer les performances.

#### WebSocket pour temps reel
Implanter WebSocket pour des notifications en temps reel (quete terminee, monstre affame).

#### Service Worker et PWA
Transformer l'application en PWA avec support offline et notifications push.

#### Tests automatises
Ajouter une suite de tests complete :
- Tests unitaires (Vitest) pour les services
- Tests de composants (React Testing Library)
- Tests E2E (Playwright) pour les flux critiques

### 4.4 Accessibilite

#### ARIA labels complets
Ameliorer l'accessibilite avec des labels ARIA exhaustifs sur tous les composants interactifs.

#### Support clavier
Navigation complete au clavier pour tous les workflows.

#### Mode contraste eleve
Theme alternatif pour utilisateurs malvoyants.

#### Support lecteur d'ecran
Optimiser le contenu pour les lecteurs d'ecran avec regions landmark appropriees.

### 4.5 Analytics et monitoring

#### Tracking utilisateur
Integration de Vercel Analytics ou Google Analytics pour comprendre l'usage.

#### Error tracking
Sentry ou similaire pour capturer et debugger les erreurs en production.

#### Performance monitoring
Core Web Vitals tracking pour optimiser l'experience utilisateur.

### 4.6 Internationalisation

#### Support multilingue
Integration de next-intl pour supporter francais, anglais, espagnol.

#### Devises multiples
Support de plusieurs devises pour Stripe (EUR, USD, GBP).

### 4.7 Backend optimizations

#### Redis pour cache
Ajout de Redis pour cacher les requetes frequentes (leaderboard, catalogue accessoires).

#### Queue system
Bull ou similaire pour gerer les taches asynchrones (reset quetes quotidiennes, calculs lourds).

#### CDN pour assets
Hebergement des images et SVG sur un CDN (Cloudinary, Vercel Edge) pour reduction de latence.

---

## Conclusion

Le projet Tomatgotchi represente une implementation solide d'un jeu web moderne avec une architecture clean, des principes SOLID respectes, et une stack technologique actuelle. Les defis rencontres lors du developpement ont permis d'affiner l'architecture et d'optimiser les performances.

Les nombreuses ameliorations futures possibles montrent le potentiel d'evolution du projet vers une experience de jeu plus riche et sociale, tout en maintenant la qualite technique et l'accessibilite.



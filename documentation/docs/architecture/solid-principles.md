---
sidebar_position: 1
---

# Principes SOLID

Le projet Tamagotcho applique rigoureusement les **principes SOLID** pour garantir une architecture maintenable et évolutive.

## Vue d'ensemble des principes

| Principe | Description | Bénéfice |
|----------|-------------|----------|
| **S** - Single Responsibility | Chaque composant a une seule responsabilité | Facilite la maintenance |
| **O** - Open/Closed | Ouvert à l'extension, fermé à la modification | Évolutivité sans risque |
| **L** - Liskov Substitution | Les sous-types remplacent leurs types de base | Cohérence et fiabilité |
| **I** - Interface Segregation | Interfaces spécifiques et focalisées | Couplage faible |
| **D** - Dependency Inversion | Dépendre d'abstractions, pas d'implémentations | Flexibilité architecturale |

## 🎯 Single Responsibility Principle (SRP)

### Définition
Chaque composant, fonction ou classe doit avoir **une seule raison de changer**.

### Application dans Tamagotcho

#### Composants UI
Chaque composant a une responsabilité unique et bien définie :

```typescript
// ✅ BON : Responsabilité unique
const Header = () => {
  // Navigation et branding uniquement
  return <nav>...</nav>
}

const HeroSection = () => {
  // Section d'accueil avec CTA uniquement
  return <section>...</section>
}

const BenefitCard = ({ title, description }: BenefitCardProps) => {
  // Affichage d'un seul avantage
  return <div>...</div>
}
```

#### Services
Séparation claire des responsabilités métier :

```typescript
// src/services/monsters/monster-generator.ts
// Responsabilité unique : générer des traits aléatoires
export function generateRandomTraits(): MonsterTraits {
  // Logique de génération uniquement
}
```

### Exemples concrets

| Composant | Responsabilité unique |
|-----------|----------------------|
| `Header` | Navigation et branding |
| `HeroSection` | Section d'accueil avec CTA |
| `BenefitCard` | Affichage d'un avantage |
| `MonsterCard` | Affichage d'une créature |
| `monster-generator.ts` | Génération de traits aléatoires |

## 🔓 Open/Closed Principle (OCP)

### Définition
Les entités logicielles doivent être **ouvertes à l'extension, fermées à la modification**.

### Application dans Tamagotcho

#### Extension via Props
Les composants acceptent de nouvelles configurations sans modification du code :

```typescript
// Composant ouvert à l'extension
function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary', // Nouvelles variantes facilement ajoutables
  disabled = false
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' // Extension facile
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
}): React.ReactNode
```

#### Ajout de nouveaux styles sans modification
```typescript
// Ajout d'une nouvelle taille sans modifier le composant
// Il suffit d'étendre le type et la fonction getSize()
size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' // Extension
```

### Bénéfices
- ✅ Nouvelles fonctionnalités sans risque de régression
- ✅ Code existant stable et testé
- ✅ Évolution progressive du projet

## 🔄 Liskov Substitution Principle (LSP)

### Définition
Les objets d'un programme doivent pouvoir être **remplacés par des instances de leurs sous-types** sans altérer le bon fonctionnement du programme.

### Application dans Tamagotcho

#### Cards interchangeables
Toutes les cards suivent des interfaces cohérentes :

```typescript
// BenefitCard peut être remplacée par MonsterCard ou ActionCard
// sans casser l'application car elles respectent les mêmes contrats

interface CardProps {
  title: string
  description?: string
  className?: string
}

// Toutes les cards peuvent être utilisées de manière cohérente
<BenefitCard {...props} />
<MonsterCard {...props} />
<ActionCard {...props} />
```

### Bénéfices
- ✅ Composants prédictibles et cohérents
- ✅ Facilite les tests unitaires
- ✅ Réduction des bugs lors des substitutions

## 🎛️ Interface Segregation Principle (ISP)

### Définition
Les clients ne doivent pas dépendre d'interfaces qu'ils n'utilisent pas.

### Application dans Tamagotcho

#### Interfaces spécialisées
Chaque type a des interfaces focalisées dans `src/types/components.ts` :

```typescript
// ✅ BON : Interfaces spécifiques et focalisées

// Simple élément de navigation
interface NavigationItem {
  label: string
  href: string
}

// Props spécifiques aux cartes d'avantages
interface BenefitCardProps {
  title: string
  description: string
  color: string
}

// Props pour les cartes de créatures
interface MonsterCardProps {
  name: string
  level: number
  traits: MonsterTraits
}

// Données du formulaire newsletter (séparées)
interface NewsletterFormData {
  email: string
}
```

#### Comparaison avec une mauvaise pratique

```typescript
// ❌ MAUVAIS : Interface trop large
interface UniversalCardProps {
  title: string
  description?: string
  color?: string
  name?: string
  level?: number
  traits?: MonsterTraits
  email?: string
  // Trop de propriétés optionnelles inutilisées
}
```

### Bénéfices
- ✅ Code plus clair et maintenable
- ✅ Pas de dépendances inutiles
- ✅ Types TypeScript plus précis

## 🔌 Dependency Inversion Principle (DIP)

### Définition
Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. Les deux doivent dépendre d'**abstractions**.

### Application dans Tamagotcho

#### Dépendances vers des interfaces TypeScript

```typescript
// ✅ BON : Dépendance vers une abstraction
import type { MonsterTraits } from '@/types/monster'

function PixelMonster({ traits }: { traits: MonsterTraits }) {
  // Le composant dépend de l'interface MonsterTraits
  // pas d'une implémentation concrète
}
```

#### Architecture en couches
```
┌─────────────────────────────────┐
│   Presentation Layer            │
│   (Components)                  │
│   Dépend de ↓                   │
├─────────────────────────────────┤
│   Application Layer             │
│   (Pages Next.js)               │
│   Dépend de ↓                   │
├─────────────────────────────────┤
│   Domain Layer                  │
│   (Types, Interfaces)           │
│   Dépend de ↓                   │
├─────────────────────────────────┤
│   Infrastructure Layer          │
│   (DB, Auth, Services)          │
└─────────────────────────────────┘
```

#### Injection de dépendances

```typescript
// Service injectable facilement
interface MonsterService {
  generateTraits(): MonsterTraits
  createMonster(name: string): Promise<Monster>
}

// Le composant dépend de l'abstraction
function CreateMonster({ service }: { service: MonsterService }) {
  // Facile à tester avec un mock du service
}
```

### Bénéfices
- ✅ Testabilité maximale (mocks faciles)
- ✅ Flexibilité pour changer d'implémentation
- ✅ Découplage des couches

## Checklist d'implémentation

Avant d'ajouter du nouveau code, vérifiez :

- [ ] **SRP** : Le composant/fonction a-t-il une seule responsabilité ?
- [ ] **OCP** : Peut-on étendre sans modifier le code existant ?
- [ ] **LSP** : Les types peuvent-ils être substitués sans casser le code ?
- [ ] **ISP** : L'interface est-elle focalisée et spécifique ?
- [ ] **DIP** : Dépend-on d'abstractions plutôt que d'implémentations ?

## Ressources

- [SOLID Principles Explained](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Architecture SOLID du projet](./clean-architecture)

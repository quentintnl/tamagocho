---
sidebar_position: 1
---

# Vue d'Ensemble du Système d'Accessoires

Le système d'accessoires permet aux utilisateurs de personnaliser leurs monstres Tomatgotchi avec des objets cosmétiques achetables.

## 🎯 Fonctionnalités Principales

- **Catalogue de 30 accessoires** répartis en 5 catégories
- **Système de rareté** à 4 niveaux (Common, Rare, Epic, Legendary)
- **Achat avec gochoCoins** et vérification automatique du solde
- **Équipement automatique** au monstre lors de l'achat
- **Intégration avec les quêtes** quotidiennes
- **Prévention des doublons** pour éviter les achats multiples

## 📦 Catégories d'Accessoires

| Catégorie | Emoji | Nombre | Exemples |
|-----------|-------|--------|----------|
| Chapeaux | 🎩 | 6 | Couronne, Haut-de-forme, Chapeau de sorcier |
| Lunettes | 😎 | 6 | Lunettes de soleil, Monocle, Lunettes laser |
| Chaussures | 👟 | 6 | Baskets, Bottes fusées, Rollers turbo |
| Arrière-plans | 🌌 | 6 | Galaxie, Arc-en-ciel, Aurore boréale |
| Effets | ✨ | 6 | Paillettes, Aura de feu, Aura divine |

## 💰 Système de Prix

```
Prix de Base : 50 gochoCoins

Multiplicateurs de Rareté :
├─ Common     : ×1 = 50 coins
├─ Rare       : ×2 = 100 coins
├─ Epic       : ×4 = 200 coins
└─ Legendary  : ×8 = 400 coins
```

## 🏗️ Architecture

Le système suit **Clean Architecture** avec 4 couches distinctes :

```
┌─────────────────────────────────────┐
│   Presentation (Components UI)      │
│   UniversalAccessoryCard            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application (Server Actions)      │
│   purchaseAccessory()               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain (Business Logic)           │
│   accessory.service.ts              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure (Database)         │
│   OwnedAccessoryModel               │
└─────────────────────────────────────┘
```

## 🔑 Concepts Clés

### Accessory (Catalogue)
Définition d'un accessoire disponible à l'achat :
```typescript
interface Accessory {
  id: string              // ex: 'hat-party'
  name: string            // ex: 'Chapeau de Fête'
  category: AccessoryCategory
  rarity: AccessoryRarity
  price: number           // en gochoCoins
  icon: string            // emoji
}
```

### OwnedAccessory (Possession)
Enregistrement d'un accessoire acheté :
```typescript
interface OwnedAccessory {
  _id: string
  ownerId: string         // utilisateur propriétaire
  accessoryId: string     // référence au catalogue
  monsterId?: string      // monstre équipé
  isEquipped: boolean     // état d'équipement
}
```

## 🔄 Flux d'Achat

1. **Authentification** - Vérification de la session utilisateur
2. **Validation** - Vérification de l'accessoire et non-possession
3. **Solde** - Comparaison prix vs coins disponibles
4. **Transaction** - Déduction du wallet
5. **Création** - Enregistrement en base de données
6. **Équipement** - Association au monstre
7. **Quêtes** - Mise à jour de la progression
8. **Cache** - Revalidation Next.js

## 📚 Navigation Documentation

- [Architecture Détaillée](./architecture.md) - Structure complète du système
- [API Reference](./api-reference.md) - Toutes les fonctions disponibles
- [Guide d'Utilisation](./usage-guide.md) - Exemples d'implémentation
- [Types TypeScript](./types.md) - Définitions de types

## 🚀 Démarrage Rapide

### Afficher tous les accessoires

```tsx
import { getAvailableAccessories } from '@/services/accessory.service'

const accessories = getAvailableAccessories()
```

### Acheter un accessoire

```tsx
import { purchaseAccessory } from '@/actions/accessory.actions'

const result = await purchaseAccessory('hat-party', 'monster-id-123')
if (result.success) {
  console.log('Acheté !', result.remainingCoins)
}
```

### Afficher une carte d'accessoire

```tsx
import { UniversalAccessoryCard } from '@/components/accessories'

<UniversalAccessoryCard
  accessory={accessory}
  onPurchase={(id) => handlePurchase(id)}
  isOwned={false}
/>
```


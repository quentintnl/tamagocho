---
sidebar_position: 2
---

# Architecture du Système

Cette page détaille l'architecture technique du système d'accessoires selon les principes Clean Architecture et SOLID.

## 🏛️ Couches Architecturales

### 1. Domain Layer (Services)

**Responsabilité** : Logique métier pure, sans dépendances externes.

#### accessory.service.ts

Gestion du catalogue d'accessoires.

```typescript
/**
 * Récupère tous les accessoires disponibles
 * @returns 30 accessoires organisés par catégorie
 */
export function getAvailableAccessories(): Accessory[]

/**
 * Récupère un accessoire par ID
 * @param id - Identifiant unique (ex: 'hat-party')
 */
export function getAccessoryById(id: string): Accessory | null

/**
 * Filtre par catégorie
 */
export function getAccessoriesByCategory(category: string): Accessory[]

/**
 * Filtre par rareté
 */
export function getAccessoriesByRarity(rarity: AccessoryRarity): Accessory[]
```

**Fichier** : `src/services/accessory.service.ts`

#### owned-accessory.service.ts

Gestion de la propriété et de l'équipement.

```typescript
/**
 * Crée un enregistrement d'accessoire possédé
 */
export async function createOwnedAccessory(
  ownerId: string,
  accessoryId: string,
  monsterId?: string
): Promise<OwnedAccessory>

/**
 * Vérifie la possession
 */
export async function userOwnsAccessory(
  ownerId: string,
  accessoryId: string
): Promise<boolean>

/**
 * Récupère les accessoires d'un utilisateur
 */
export async function getOwnedAccessoriesByUser(
  ownerId: string
): Promise<OwnedAccessory[]>

/**
 * Récupère les accessoires d'un monstre
 */
export async function getOwnedAccessoriesByMonster(
  monsterId: string
): Promise<OwnedAccessory[]>

/**
 * Équipe un accessoire
 */
export async function equipAccessoryToMonster(
  ownedAccessoryId: string,
  monsterId: string
): Promise<OwnedAccessory | null>

/**
 * Déséquipe un accessoire
 */
export async function unequipAccessory(
  ownedAccessoryId: string
): Promise<OwnedAccessory | null>
```

**Fichier** : `src/services/owned-accessory.service.ts`

---

### 2. Application Layer (Actions)

**Responsabilité** : Orchestration, authentification, validation.

#### accessory.actions.ts

```typescript
/**
 * Achète et équipe un accessoire
 * 
 * Flux complet :
 * 1. auth() - Vérifie la session
 * 2. getAccessoryById() - Valide l'accessoire
 * 3. userOwnsAccessory() - Évite les doublons
 * 4. getOrCreateWallet() - Vérifie le solde
 * 5. subtractCoins() - Déduit le prix
 * 6. createOwnedAccessory() - Enregistre
 * 7. trackQuestProgress() - Met à jour les quêtes
 * 8. revalidatePath() - Rafraîchit le cache
 */
export async function purchaseAccessory(
  accessoryId: string,
  monsterId: string
): Promise<{
  success: boolean
  message: string
  remainingCoins?: number
  ownedAccessoryId?: string
}>

/**
 * Achète sans équiper (inventaire uniquement)
 */
export async function purchaseAccessoryOnly(
  accessoryId: string
): Promise<{...}>

/**
 * Équipe un accessoire déjà possédé
 */
export async function equipAccessory(
  ownedAccessoryId: string,
  monsterId: string
): Promise<{...}>

/**
 * Déséquipe un accessoire
 */
export async function unequipAccessoryAction(
  ownedAccessoryId: string
): Promise<{...}>

/**
 * Récupère les accessoires de l'utilisateur connecté
 */
export async function getUserAccessories(): Promise<OwnedAccessory[]>

/**
 * Récupère les IDs possédés (pour détection doublons)
 */
export async function getUserAccessoryIds(): Promise<string[]>
```

**Fichier** : `src/actions/accessory.actions.ts`

---

### 3. Infrastructure Layer (Database)

**Responsabilité** : Persistance MongoDB.

#### OwnedAccessoryModel

```typescript
const ownedAccessorySchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  accessoryId: {
    type: String,
    required: true
  },
  monsterId: {
    type: String,
    required: false,
    default: null
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  isEquipped: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index composé pour éviter les doublons
ownedAccessorySchema.index({ ownerId: 1, accessoryId: 1 })

// Index pour recherche rapide par monstre
ownedAccessorySchema.index({ monsterId: 1, isEquipped: 1 })
```

**Fichier** : `src/db/models/owned-accessory.model.ts`

---

### 4. Presentation Layer (Components)

**Responsabilité** : Affichage UI et interactions utilisateur.

#### UniversalAccessoryCard

Carte d'affichage d'accessoire avec support SVG.

```tsx
interface UniversalAccessoryCardProps {
  accessory: Accessory
  onPurchase?: (accessoryId: string) => void
  isOwned?: boolean
}

export function UniversalAccessoryCard(props: UniversalAccessoryCardProps)
```

**Caractéristiques** :
- Détection automatique du support SVG
- Fallback sur emoji si pas de SVG
- Thème nature avec couleurs selon rareté
- Animations hover fluides
- Accessibilité ARIA

**Fichier** : `src/components/accessories/universal-accessory-card.tsx`

#### PurchaseConfirmationModal

Modal de confirmation d'achat.

```tsx
interface PurchaseConfirmationModalProps {
  accessory: Accessory | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  userCoins: number
}

export function PurchaseConfirmationModal(props: PurchaseConfirmationModalProps)
```

**Fichier** : `src/components/accessories/purchase-confirmation-modal.tsx`

---

## 🔗 Flux de Dépendances

```
Components (UI)
    │
    ├─ import actions from '@/actions/accessory.actions'
    └─ import services from '@/services/accessory.service'
         │
Actions (Orchestration)
    │
    ├─ import services from '@/services/accessory.service'
    ├─ import services from '@/services/owned-accessory.service'
    ├─ import services from '@/services/wallet.service'
    └─ import auth from '@/lib/auth'
         │
Services (Business Logic)
    │
    └─ import models from '@/db/models/owned-accessory.model'
         │
Models (Database)
    │
    └─ Mongoose + MongoDB
```

**Règle importante** : Les dépendances pointent toujours **vers l'intérieur** (UI → Actions → Services → Models).

---

## 🎯 Application des Principes SOLID

### 1. Single Responsibility Principle (SRP)

Chaque module a une seule raison de changer :

- **accessory.service.ts** : Catalogue uniquement
- **owned-accessory.service.ts** : Propriété uniquement
- **accessory.actions.ts** : Orchestration uniquement
- **UniversalAccessoryCard** : Affichage uniquement

### 2. Open/Closed Principle (OCP)

Le système est ouvert à l'extension, fermé à la modification :

```typescript
// Ajout d'un nouvel accessoire = simple ajout au tableau
export function getAvailableAccessories(): Accessory[] {
  return [
    // ...accessoires existants...
    { id: 'new-item', ... }  // Pas de modification du code existant
  ]
}
```

### 3. Liskov Substitution Principle (LSP)

Les interfaces sont substituables :

```typescript
// Toutes les fonctions de récupération retournent le même type
async function getOwnedAccessoriesByUser(): Promise<OwnedAccessory[]>
async function getOwnedAccessoriesByMonster(): Promise<OwnedAccessory[]>
```

### 4. Interface Segregation Principle (ISP)

Interfaces petites et ciblées :

```typescript
// Séparation des préoccupations
interface Accessory { ... }           // Catalogue
interface OwnedAccessory { ... }      // Possession
interface PurchaseAccessoryDTO { ... } // Achat
```

### 5. Dependency Inversion Principle (DIP)

Dépendances sur abstractions, pas sur implémentations :

```typescript
// Actions dépendent des services (abstractions)
import { getAccessoryById } from '@/services/accessory.service'
// Pas de dépendance directe sur Mongoose dans les actions
```

---

## 📊 Diagramme de Séquence (Achat)

```
User → UI Component → Server Action → Services → Database
 │         │               │              │          │
 │ Click   │               │              │          │
 ├────────>│               │              │          │
 │         │ purchaseAccessory()          │          │
 │         ├──────────────>│              │          │
 │         │               │ auth()       │          │
 │         │               ├─────────────>│          │
 │         │               │<─────────────┤          │
 │         │               │ getAccessoryById()     │
 │         │               ├─────────────>│          │
 │         │               │<─────────────┤          │
 │         │               │ userOwnsAccessory()    │
 │         │               ├─────────────>│          │
 │         │               │<─────────────┤          │
 │         │               │ getWallet()  │          │
 │         │               ├─────────────>│          │
 │         │               │              │ find()   │
 │         │               │              ├─────────>│
 │         │               │              │<─────────┤
 │         │               │<─────────────┤          │
 │         │               │ subtractCoins()        │
 │         │               ├─────────────>│          │
 │         │               │              │ update() │
 │         │               │              ├─────────>│
 │         │               │              │<─────────┤
 │         │               │<─────────────┤          │
 │         │               │ createOwnedAccessory() │
 │         │               ├─────────────>│          │
 │         │               │              │ create() │
 │         │               │              ├─────────>│
 │         │               │              │<─────────┤
 │         │               │<─────────────┤          │
 │         │               │ trackQuestProgress()   │
 │         │               ├─────────────>│          │
 │         │<──────────────┤              │          │
 │<────────┤ (revalidate)  │              │          │
```

---

## 🗂️ Structure de Fichiers

```
src/
├── types/
│   └── accessory.ts                    # Types Domain Layer
├── services/
│   ├── accessory.service.ts            # Catalogue
│   └── owned-accessory.service.ts      # Propriété
├── actions/
│   └── accessory.actions.ts            # Orchestration
├── db/
│   └── models/
│       └── owned-accessory.model.ts    # MongoDB
└── components/
    └── accessories/
        ├── universal-accessory-card.tsx
        ├── purchase-confirmation-modal.tsx
        └── index.ts
```

---

## 🔐 Gestion des Erreurs

### Validation en Cascade

```typescript
// 1. Authentification
if (!session) return { success: false, message: 'Non authentifié' }

// 2. Accessoire existe
if (!accessory) return { success: false, message: 'Accessoire introuvable' }

// 3. Pas déjà possédé
if (alreadyOwned) return { success: false, message: 'Déjà possédé' }

// 4. Solde suffisant
if (wallet.coin < accessory.price) {
  return { 
    success: false, 
    message: `Solde insuffisant. Vous avez ${wallet.coin}, il faut ${accessory.price}` 
  }
}

// 5. Transaction réussie
try {
  // ... achat
  return { success: true, message: 'Acheté !', remainingCoins }
} catch (error) {
  return { success: false, message: 'Erreur serveur' }
}
```

### Erreurs Silencieuses (Quêtes)

```typescript
// Les erreurs de tracking de quêtes ne bloquent pas l'achat
try {
  await trackQuestProgress(userId, 'buy_accessory', 1)
} catch (questError) {
  console.warn('Quest tracking failed:', questError)
  // Continue l'exécution
}
```

---

## 🔄 Revalidation du Cache Next.js

```typescript
// Après chaque mutation, revalider les chemins concernés
revalidatePath('/creature')    // Page du monstre
revalidatePath('/dashboard')   // Tableau de bord
revalidatePath('/wallet')      // Wallet
revalidatePath('/monster')     // Liste des monstres
```

Cela assure que les données affichées sont toujours à jour sans rechargement manuel.


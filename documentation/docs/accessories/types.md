---
sidebar_position: 5
---

# Définitions de Types

Référence complète de tous les types TypeScript utilisés dans le système d'accessoires.

## 📦 Types de Base

### `AccessoryCategory`

Énumération des catégories d'accessoires disponibles.

```typescript
type AccessoryCategory = 
  | 'hat'          // Chapeaux et couvre-chefs
  | 'glasses'      // Lunettes et accessoires visuels
  | 'shoes'        // Chaussures et équipement de pieds
  | 'background'   // Arrière-plans décoratifs
  | 'effect'       // Effets visuels spéciaux
```

**Fichier** : `src/types/accessory.ts`

**Usage** :
```typescript
const category: AccessoryCategory = 'hat'
```

---

### `AccessoryRarity`

Énumération des niveaux de rareté (affecte le prix).

```typescript
type AccessoryRarity = 
  | 'common'       // Commun - Prix ×1
  | 'rare'         // Rare - Prix ×2
  | 'epic'         // Épique - Prix ×4
  | 'legendary'    // Légendaire - Prix ×8
```

**Fichier** : `src/types/accessory.ts`

**Usage** :
```typescript
const rarity: AccessoryRarity = 'legendary'
const multiplier = getRarityMultiplier(rarity) // 8
```

---

## 🏪 Interfaces d'Entités

### `Accessory`

Représente un accessoire disponible dans le catalogue de la boutique.

```typescript
interface Accessory {
  /** Identifiant unique de l'accessoire (ex: 'hat-party') */
  id: string
  
  /** Nom affiché à l'utilisateur (ex: 'Chapeau de Fête') */
  name: string
  
  /** Description pour l'utilisateur */
  description: string
  
  /** Catégorie de l'accessoire */
  category: AccessoryCategory
  
  /** Niveau de rareté (affecte le prix) */
  rarity: AccessoryRarity
  
  /** Prix en gochoCoins */
  price: number
  
  /** Emoji ou identifiant d'icône */
  icon: string
  
  /** Description de l'effet (optionnel) */
  effect?: string
}
```

**Fichier** : `src/types/accessory.ts`

**Exemple** :
```typescript
const accessory: Accessory = {
  id: 'hat-party',
  name: 'Chapeau de Fête',
  description: 'Un chapeau festif pour célébrer !',
  category: 'hat',
  rarity: 'common',
  price: 50,
  icon: '🎉',
  effect: undefined
}
```

**Propriétés** :

| Propriété | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | `string` | ✅ | Identifiant unique (kebab-case) |
| `name` | `string` | ✅ | Nom d'affichage en français |
| `description` | `string` | ✅ | Description courte |
| `category` | `AccessoryCategory` | ✅ | Catégorie de l'accessoire |
| `rarity` | `AccessoryRarity` | ✅ | Niveau de rareté |
| `price` | `number` | ✅ | Prix en gochoCoins |
| `icon` | `string` | ✅ | Emoji Unicode |
| `effect` | `string` | ❌ | Description d'effet (futur) |

---

### `OwnedAccessory`

Représente un accessoire acheté et possédé par un utilisateur.

```typescript
interface OwnedAccessory {
  /** ID MongoDB de l'enregistrement */
  _id: string
  
  /** ID de l'utilisateur propriétaire */
  ownerId: string
  
  /** ID de l'accessoire (référence au catalogue) */
  accessoryId: string
  
  /** ID du monstre équipé (optionnel) */
  monsterId?: string
  
  /** Date d'achat */
  purchasedAt: Date | string
  
  /** État d'équipement */
  isEquipped: boolean
}
```

**Fichier** : `src/types/accessory.ts`

**Exemple** :
```typescript
const ownedAccessory: OwnedAccessory = {
  _id: '507f1f77bcf86cd799439011',
  ownerId: 'user123',
  accessoryId: 'hat-party',
  monsterId: 'monster456',
  purchasedAt: new Date('2025-01-12'),
  isEquipped: true
}
```

**Propriétés** :

| Propriété | Type | Requis | Description |
|-----------|------|--------|-------------|
| `_id` | `string` | ✅ | ID MongoDB |
| `ownerId` | `string` | ✅ | ID utilisateur |
| `accessoryId` | `string` | ✅ | Référence à `Accessory.id` |
| `monsterId` | `string` | ❌ | Monstre équipé |
| `purchasedAt` | `Date \| string` | ✅ | Date d'achat |
| `isEquipped` | `boolean` | ✅ | État d'équipement |

**Relations** :
```
OwnedAccessory.accessoryId ──> Accessory.id (catalogue)
OwnedAccessory.ownerId ──> User.id
OwnedAccessory.monsterId ──> Monster.id
```

---

## 📨 DTOs (Data Transfer Objects)

### `PurchaseAccessoryDTO`

Objet de transfert pour l'achat d'un accessoire.

```typescript
interface PurchaseAccessoryDTO {
  /** ID de l'accessoire à acheter */
  accessoryId: string
  
  /** ID du monstre à équiper */
  monsterId: string
}
```

**Fichier** : `src/types/accessory.ts`

**Usage** :
```typescript
const purchaseData: PurchaseAccessoryDTO = {
  accessoryId: 'hat-party',
  monsterId: 'monster456'
}

const result = await purchaseAccessory(
  purchaseData.accessoryId,
  purchaseData.monsterId
)
```

---

## 🔄 Types de Réponses API

### `PurchaseResult`

Type de réponse pour les actions d'achat.

```typescript
type PurchaseResult = {
  /** Succès de l'opération */
  success: boolean
  
  /** Message pour l'utilisateur */
  message: string
  
  /** Solde restant après achat (si succès) */
  remainingCoins?: number
  
  /** ID de l'accessoire possédé créé (si succès) */
  ownedAccessoryId?: string
}
```

**Exemples** :

Succès :
```typescript
const result: PurchaseResult = {
  success: true,
  message: "Chapeau de Fête acheté et équipé avec succès !",
  remainingCoins: 150,
  ownedAccessoryId: "507f1f77bcf86cd799439011"
}
```

Échec :
```typescript
const result: PurchaseResult = {
  success: false,
  message: "Solde insuffisant. Vous avez 30 gochoCoins, il en faut 50"
}
```

---

### `EquipResult`

Type de réponse pour les actions d'équipement.

```typescript
type EquipResult = {
  /** Succès de l'opération */
  success: boolean
  
  /** Message pour l'utilisateur */
  message: string
}
```

**Exemple** :
```typescript
const result: EquipResult = {
  success: true,
  message: "Accessoire équipé avec succès"
}
```

---

## 🎨 Types de Composants

### `UniversalAccessoryCardProps`

Props du composant UniversalAccessoryCard.

```typescript
interface UniversalAccessoryCardProps {
  /** Accessoire à afficher */
  accessory: Accessory
  
  /** Callback lors de l'achat (optionnel) */
  onPurchase?: (accessoryId: string) => void
  
  /** Indique si l'accessoire est déjà possédé */
  isOwned?: boolean
}
```

**Usage** :
```tsx
<UniversalAccessoryCard
  accessory={accessory}
  onPurchase={(id) => console.log('Achat:', id)}
  isOwned={false}
/>
```

---

### `PurchaseConfirmationModalProps`

Props du composant PurchaseConfirmationModal.

```typescript
interface PurchaseConfirmationModalProps {
  /** Accessoire sélectionné (null si modal fermé) */
  accessory: Accessory | null
  
  /** État d'ouverture du modal */
  isOpen: boolean
  
  /** Callback de fermeture */
  onClose: () => void
  
  /** Callback de confirmation (async) */
  onConfirm: () => Promise<void>
  
  /** Solde actuel de l'utilisateur */
  userCoins: number
}
```

**Usage** :
```tsx
<PurchaseConfirmationModal
  accessory={selectedAccessory}
  isOpen={selectedAccessory !== null}
  onClose={() => setSelectedAccessory(null)}
  onConfirm={handlePurchase}
  userCoins={wallet.coin}
/>
```

---

## 🗄️ Types MongoDB

### `OwnedAccessoryDocument`

Type du document Mongoose (avec méthodes).

```typescript
type OwnedAccessoryDocument = Document & OwnedAccessory & {
  createdAt: Date
  updatedAt: Date
}
```

**Note** : Automatiquement généré par Mongoose avec `timestamps: true`

---

### `OwnedAccessoryModel`

Type du modèle Mongoose.

```typescript
type OwnedAccessoryModel = Model<OwnedAccessory>
```

**Usage** :
```typescript
const owned = await OwnedAccessoryModel.findById(id)
```

---

## 🎯 Types Utilitaires

### `AccessoryCategoryLabel`

Mapping des catégories vers leurs labels français.

```typescript
type AccessoryCategoryLabel = {
  [K in AccessoryCategory]: string
}

const categoryLabels: AccessoryCategoryLabel = {
  hat: 'Chapeau',
  glasses: 'Lunettes',
  shoes: 'Chaussures',
  background: 'Arrière-plan',
  effect: 'Effet'
}
```

---

### `AccessoryRarityLabel`

Mapping des raretés vers leurs labels français.

```typescript
type AccessoryRarityLabel = {
  [K in AccessoryRarity]: string
}

const rarityLabels: AccessoryRarityLabel = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
}
```

---

### `AccessoryRarityColor`

Mapping des raretés vers leurs classes CSS Tailwind.

```typescript
type AccessoryRarityColor = {
  [K in AccessoryRarity]: string
}

const rarityColors: AccessoryRarityColor = {
  common: 'bg-earth-100/80 text-earth-700',
  rare: 'bg-sky-100/80 text-sky-700',
  epic: 'bg-lavender-100/80 text-lavender-700',
  legendary: 'bg-sunset-100/80 text-sunset-700'
}
```

---

## 🔢 Types Numériques

### `AccessoryPrice`

Type pour les prix d'accessoires (nombre positif).

```typescript
type AccessoryPrice = number // >= 0
```

**Contraintes** :
- Doit être un nombre entier positif
- Multiples de 50 (BASE_PRICE)
- Range : 50 (common) à 400 (legendary)

---

### `RarityMultiplier`

Type pour les multiplicateurs de rareté.

```typescript
type RarityMultiplier = 1 | 2 | 4 | 8
```

**Mapping** :
```typescript
const multipliers: Record<AccessoryRarity, RarityMultiplier> = {
  common: 1,
  rare: 2,
  epic: 4,
  legendary: 8
}
```

---

## 📋 Types d'Agrégation

### `AccessoryWithOwnership`

Type composite pour afficher accessoires avec état de possession.

```typescript
type AccessoryWithOwnership = {
  accessory: Accessory
  owned: OwnedAccessory | null
  isOwned: boolean
}
```

**Usage** :
```typescript
const items: AccessoryWithOwnership[] = accessories.map(acc => ({
  accessory: acc,
  owned: ownedAccessories.find(o => o.accessoryId === acc.id) || null,
  isOwned: ownedAccessoryIds.includes(acc.id)
}))
```

---

### `AccessoryStats`

Type pour les statistiques d'accessoires.

```typescript
type AccessoryStats = {
  byCategory: Record<AccessoryCategory, number>
  byRarity: Record<AccessoryRarity, number>
  totalOwned: number
  totalEquipped: number
  totalValue: number
}
```

**Exemple** :
```typescript
const stats: AccessoryStats = {
  byCategory: {
    hat: 3,
    glasses: 2,
    shoes: 1,
    background: 4,
    effect: 2
  },
  byRarity: {
    common: 5,
    rare: 4,
    epic: 2,
    legendary: 1
  },
  totalOwned: 12,
  totalEquipped: 5,
  totalValue: 1200
}
```

---

## 🔍 Type Guards

### `isAccessory()`

Vérifie si un objet est de type Accessory.

```typescript
function isAccessory(obj: unknown): obj is Accessory {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'category' in obj &&
    'rarity' in obj &&
    'price' in obj
  )
}
```

---

### `isOwnedAccessory()`

Vérifie si un objet est de type OwnedAccessory.

```typescript
function isOwnedAccessory(obj: unknown): obj is OwnedAccessory {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    'ownerId' in obj &&
    'accessoryId' in obj &&
    'isEquipped' in obj
  )
}
```

---

## 📚 Exemples Complets

### Type Complet d'une Page de Boutique

```typescript
type ShopPageState = {
  // Données
  accessories: Accessory[]
  ownedAccessories: OwnedAccessory[]
  ownedAccessoryIds: string[]
  
  // UI State
  selectedAccessory: Accessory | null
  isModalOpen: boolean
  isLoading: boolean
  
  // User Data
  userId: string
  monsterId: string
  userCoins: number
  
  // Filtres
  categoryFilter: AccessoryCategory | 'all'
  rarityFilter: AccessoryRarity | 'all'
  searchQuery: string
}
```

---

### Type Complet d'Inventaire

```typescript
type InventoryPageState = {
  // Données
  ownedAccessories: OwnedAccessory[]
  enrichedAccessories: Array<{
    owned: OwnedAccessory
    accessory: Accessory
  }>
  
  // Stats
  stats: AccessoryStats
  
  // UI State
  selectedCategory: AccessoryCategory | 'all'
  selectedAccessoryId: string | null
  
  // Actions
  onEquip: (ownedAccessoryId: string, monsterId: string) => Promise<void>
  onUnequip: (ownedAccessoryId: string) => Promise<void>
}
```

---

## 🎓 Bonnes Pratiques

### ✅ Recommandations

1. **Typage Strict** : Toujours utiliser les types définis plutôt que `any`
2. **Type Guards** : Utiliser des type guards pour la validation runtime
3. **Props Explicites** : Définir des interfaces pour les props de composants
4. **Constantes Typées** : Utiliser `as const` pour les constantes

```typescript
// ✅ Bon
const CATEGORIES = ['hat', 'glasses', 'shoes'] as const
type Category = typeof CATEGORIES[number]

// ❌ Éviter
const CATEGORIES = ['hat', 'glasses', 'shoes']
```

### ❌ Anti-patterns

```typescript
// ❌ Éviter any
function process(data: any) { ... }

// ✅ Utiliser les types
function process(data: Accessory) { ... }

// ❌ Éviter les types trop larges
function getId(item: object): string { ... }

// ✅ Être spécifique
function getId(item: Accessory | OwnedAccessory): string { ... }
```

---

## 📖 Ressources Complémentaires

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Mongoose TypeScript](https://mongoosejs.com/docs/typescript.html)
- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)


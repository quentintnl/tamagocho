---
sidebar_position: 4
---

# Référence API

Documentation complète de toutes les fonctions disponibles dans le système d'accessoires.

## 📦 Services

### accessory.service.ts

Service de catalogue d'accessoires (Domain Layer).

---

#### `getAvailableAccessories()`

Récupère tous les accessoires disponibles dans le catalogue.

```typescript
function getAvailableAccessories(): Accessory[]
```

**Retour** : Tableau de 30 accessoires

**Exemple** :
```typescript
const accessories = getAvailableAccessories()
console.log(accessories.length) // 30
```

---

#### `getAccessoryById()`

Récupère un accessoire spécifique par son ID.

```typescript
function getAccessoryById(id: string): Accessory | null
```

**Paramètres** :
- `id` : Identifiant unique de l'accessoire (ex: `'hat-party'`)

**Retour** : Accessoire trouvé ou `null`

**Exemple** :
```typescript
const hat = getAccessoryById('hat-party')
if (hat) {
  console.log(hat.name) // "Chapeau de Fête"
  console.log(hat.price) // 50
}
```

---

#### `getAccessoriesByCategory()`

Filtre les accessoires par catégorie.

```typescript
function getAccessoriesByCategory(category: string): Accessory[]
```

**Paramètres** :
- `category` : Catégorie à filtrer (`'hat'`, `'glasses'`, `'shoes'`, `'background'`, `'effect'`)

**Retour** : Tableau d'accessoires de la catégorie

**Exemple** :
```typescript
const hats = getAccessoriesByCategory('hat')
console.log(hats.length) // 6
```

---

#### `getAccessoriesByRarity()`

Filtre les accessoires par niveau de rareté.

```typescript
function getAccessoriesByRarity(rarity: AccessoryRarity): Accessory[]
```

**Paramètres** :
- `rarity` : Niveau de rareté (`'common'`, `'rare'`, `'epic'`, `'legendary'`)

**Retour** : Tableau d'accessoires de la rareté spécifiée

**Exemple** :
```typescript
const legendaries = getAccessoriesByRarity('legendary')
legendaries.forEach(item => {
  console.log(`${item.name}: ${item.price} coins`)
})
```

---

### owned-accessory.service.ts

Service de gestion de propriété (Domain Layer).

---

#### `createOwnedAccessory()`

Crée un enregistrement d'accessoire possédé.

```typescript
async function createOwnedAccessory(
  ownerId: string,
  accessoryId: string,
  monsterId?: string
): Promise<OwnedAccessory>
```

**Paramètres** :
- `ownerId` : ID de l'utilisateur propriétaire
- `accessoryId` : ID de l'accessoire acheté
- `monsterId` (optionnel) : ID du monstre pour équipement automatique

**Retour** : Promise de l'accessoire possédé créé

**Exemple** :
```typescript
const owned = await createOwnedAccessory(
  'user123',
  'hat-party',
  'monster456'
)
console.log(owned.isEquipped) // true (car monsterId fourni)
```

---

#### `getOwnedAccessoriesByUser()`

Récupère tous les accessoires possédés par un utilisateur.

```typescript
async function getOwnedAccessoriesByUser(
  ownerId: string
): Promise<OwnedAccessory[]>
```

**Paramètres** :
- `ownerId` : ID de l'utilisateur

**Retour** : Promise du tableau d'accessoires possédés

**Exemple** :
```typescript
const owned = await getOwnedAccessoriesByUser('user123')
console.log(`L'utilisateur possède ${owned.length} accessoires`)
```

---

#### `getOwnedAccessoriesByMonster()`

Récupère les accessoires équipés sur un monstre.

```typescript
async function getOwnedAccessoriesByMonster(
  monsterId: string
): Promise<OwnedAccessory[]>
```

**Paramètres** :
- `monsterId` : ID du monstre

**Retour** : Promise du tableau d'accessoires équipés

**Exemple** :
```typescript
const equipped = await getOwnedAccessoriesByMonster('monster456')
equipped.forEach(item => {
  console.log(`Équipé: ${item.accessoryId}`)
})
```

---

#### `getOwnedAccessoryIds()`

Récupère uniquement les IDs des accessoires possédés (optimisé).

```typescript
async function getOwnedAccessoryIds(
  ownerId: string
): Promise<string[]>
```

**Paramètres** :
- `ownerId` : ID de l'utilisateur

**Retour** : Promise du tableau d'IDs

**Exemple** :
```typescript
const ids = await getOwnedAccessoryIds('user123')
const isOwned = ids.includes('hat-party')
```

---

#### `userOwnsAccessory()`

Vérifie si un utilisateur possède un accessoire spécifique.

```typescript
async function userOwnsAccessory(
  ownerId: string,
  accessoryId: string
): Promise<boolean>
```

**Paramètres** :
- `ownerId` : ID de l'utilisateur
- `accessoryId` : ID de l'accessoire à vérifier

**Retour** : Promise de booléen

**Exemple** :
```typescript
const owns = await userOwnsAccessory('user123', 'hat-party')
if (owns) {
  console.log('Déjà possédé !')
}
```

---

#### `equipAccessoryToMonster()`

Équipe un accessoire possédé sur un monstre.

```typescript
async function equipAccessoryToMonster(
  ownedAccessoryId: string,
  monsterId: string
): Promise<OwnedAccessory | null>
```

**Paramètres** :
- `ownedAccessoryId` : ID de l'accessoire possédé (MongoDB _id)
- `monsterId` : ID du monstre

**Retour** : Promise de l'accessoire mis à jour ou `null` si non trouvé

**Exemple** :
```typescript
const updated = await equipAccessoryToMonster(
  '507f1f77bcf86cd799439011',
  'monster456'
)
if (updated) {
  console.log('Équipé avec succès')
}
```

---

#### `unequipAccessory()`

Déséquipe un accessoire.

```typescript
async function unequipAccessory(
  ownedAccessoryId: string
): Promise<OwnedAccessory | null>
```

**Paramètres** :
- `ownedAccessoryId` : ID de l'accessoire possédé (MongoDB _id)

**Retour** : Promise de l'accessoire mis à jour ou `null`

**Exemple** :
```typescript
const unequipped = await unequipAccessory('507f1f77bcf86cd799439011')
if (unequipped) {
  console.log('Déséquipé avec succès')
}
```

---

## 🎬 Actions

### accessory.actions.ts

Actions serveur pour l'orchestration (Application Layer).

---

#### `purchaseAccessory()`

Achète un accessoire et l'équipe automatiquement au monstre.

```typescript
async function purchaseAccessory(
  accessoryId: string,
  monsterId: string
): Promise<{
  success: boolean
  message: string
  remainingCoins?: number
  ownedAccessoryId?: string
}>
```

**Paramètres** :
- `accessoryId` : ID de l'accessoire à acheter
- `monsterId` : ID du monstre à équiper

**Retour** : Promise du résultat de l'opération

**Flux complet** :
1. Vérifie l'authentification
2. Valide l'accessoire
3. Vérifie la non-possession
4. Vérifie le solde
5. Déduit les coins
6. Crée l'OwnedAccessory
7. Met à jour les quêtes
8. Revalide le cache

**Exemples de retour** :

Succès :
```typescript
{
  success: true,
  message: "Chapeau de Fête acheté et équipé avec succès !",
  remainingCoins: 150,
  ownedAccessoryId: "507f1f77bcf86cd799439011"
}
```

Échec - Solde insuffisant :
```typescript
{
  success: false,
  message: "Solde insuffisant. Vous avez 30 gochoCoins, il en faut 50"
}
```

Échec - Déjà possédé :
```typescript
{
  success: false,
  message: "Vous possédez déjà cet accessoire"
}
```

**Exemple d'utilisation** :
```typescript
const result = await purchaseAccessory('hat-party', 'monster123')
if (result.success) {
  console.log('Achat réussi !', result.remainingCoins)
} else {
  console.error(result.message)
}
```

---

#### `purchaseAccessoryOnly()`

Achète un accessoire sans l'équiper (ajout à l'inventaire uniquement).

```typescript
async function purchaseAccessoryOnly(
  accessoryId: string
): Promise<{
  success: boolean
  message: string
  remainingCoins?: number
  ownedAccessoryId?: string
}>
```

**Paramètres** :
- `accessoryId` : ID de l'accessoire à acheter

**Retour** : Promise du résultat (même structure que `purchaseAccessory`)

**Exemple** :
```typescript
const result = await purchaseAccessoryOnly('glasses-cool')
// Accessoire acheté mais pas équipé
```

---

#### `equipAccessory()`

Équipe un accessoire déjà possédé sur un monstre.

```typescript
async function equipAccessory(
  ownedAccessoryId: string,
  monsterId: string
): Promise<{
  success: boolean
  message: string
}>
```

**Paramètres** :
- `ownedAccessoryId` : ID de l'accessoire possédé (MongoDB _id)
- `monsterId` : ID du monstre

**Retour** : Promise du résultat

**Exemple** :
```typescript
const result = await equipAccessory(
  '507f1f77bcf86cd799439011',
  'monster456'
)
```

---

#### `unequipAccessoryAction()`

Déséquipe un accessoire d'un monstre.

```typescript
async function unequipAccessoryAction(
  ownedAccessoryId: string
): Promise<{
  success: boolean
  message: string
}>
```

**Paramètres** :
- `ownedAccessoryId` : ID de l'accessoire possédé (MongoDB _id)

**Retour** : Promise du résultat

**Exemple** :
```typescript
const result = await unequipAccessoryAction('507f1f77bcf86cd799439011')
```

---

#### `getUserAccessories()`

Récupère tous les accessoires de l'utilisateur connecté.

```typescript
async function getUserAccessories(): Promise<OwnedAccessory[]>
```

**Retour** : Promise du tableau d'accessoires possédés

**Authentification** : Requiert une session active

**Exemple** :
```typescript
const myAccessories = await getUserAccessories()
console.log(`Vous possédez ${myAccessories.length} accessoires`)
```

---

#### `getMonsterAccessories()`

Récupère les accessoires équipés sur un monstre.

```typescript
async function getMonsterAccessories(
  monsterId: string
): Promise<OwnedAccessory[]>
```

**Paramètres** :
- `monsterId` : ID du monstre

**Retour** : Promise du tableau d'accessoires équipés

**Exemple** :
```typescript
const equipped = await getMonsterAccessories('monster456')
```

---

#### `getUserAccessoryIds()`

Récupère uniquement les IDs des accessoires possédés (optimisé pour UI).

```typescript
async function getUserAccessoryIds(): Promise<string[]>
```

**Retour** : Promise du tableau d'IDs d'accessoires

**Cas d'usage** : Détection rapide de possession dans l'UI

**Exemple** :
```typescript
const ownedIds = await getUserAccessoryIds()
const isOwned = ownedIds.includes('hat-party')

// Utilisation dans composant
<UniversalAccessoryCard
  accessory={accessory}
  isOwned={ownedIds.includes(accessory.id)}
/>
```

---

## 🎨 Composants

### UniversalAccessoryCard

Carte d'affichage universelle d'accessoire avec support SVG.

```tsx
function UniversalAccessoryCard(props: {
  accessory: Accessory
  onPurchase?: (accessoryId: string) => void
  isOwned?: boolean
}): React.ReactNode
```

**Props** :

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `accessory` | `Accessory` | Required | Accessoire à afficher |
| `onPurchase` | `(id: string) => void` | `undefined` | Callback lors du clic d'achat |
| `isOwned` | `boolean` | `false` | État de possession (désactive l'achat) |

**Caractéristiques** :
- Détection automatique du support SVG via `hasAccessorySVGSupport()`
- Fallback sur emoji si pas de SVG
- Animations hover fluides
- Couleurs thème nature selon rareté
- Accessibilité ARIA

**Exemple** :
```tsx
<UniversalAccessoryCard
  accessory={accessory}
  onPurchase={(id) => handlePurchase(id)}
  isOwned={ownedIds.includes(accessory.id)}
/>
```

---

### PurchaseConfirmationModal

Modal de confirmation d'achat avec validation du solde.

```tsx
function PurchaseConfirmationModal(props: {
  accessory: Accessory | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  userCoins: number
}): React.ReactNode
```

**Props** :

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `accessory` | `Accessory \| null` | Required | Accessoire sélectionné (null si fermé) |
| `isOpen` | `boolean` | Required | État d'ouverture du modal |
| `onClose` | `() => void` | Required | Callback de fermeture |
| `onConfirm` | `() => Promise<void>` | Required | Callback de confirmation (async) |
| `userCoins` | `number` | Required | Solde actuel de l'utilisateur |

**Validation** :
- Désactive le bouton si `userCoins < accessory.price`
- Affiche un message d'erreur si fonds insuffisants

**Exemple** :
```tsx
const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)

<PurchaseConfirmationModal
  accessory={selectedAccessory}
  isOpen={selectedAccessory !== null}
  onClose={() => setSelectedAccessory(null)}
  onConfirm={async () => {
    const result = await purchaseAccessory(selectedAccessory.id, monsterId)
    if (result.success) {
      setSelectedAccessory(null)
      toast.success(result.message)
    }
  }}
  userCoins={wallet.coin}
/>
```

---

## 📊 Types TypeScript

### `Accessory`

Définition d'un accessoire du catalogue.

```typescript
interface Accessory {
  id: string              // Identifiant unique (ex: 'hat-party')
  name: string            // Nom affiché (ex: 'Chapeau de Fête')
  description: string     // Description pour l'utilisateur
  category: AccessoryCategory
  rarity: AccessoryRarity
  price: number           // Prix en gochoCoins
  icon: string            // Emoji ou identifiant d'icône
  effect?: string         // Description de l'effet (optionnel)
}
```

---

### `OwnedAccessory`

Accessoire acheté et possédé par un utilisateur.

```typescript
interface OwnedAccessory {
  _id: string             // ID MongoDB
  ownerId: string         // ID de l'utilisateur propriétaire
  accessoryId: string     // Référence à Accessory.id
  monsterId?: string      // Monstre équipé (optionnel)
  purchasedAt: Date | string  // Date d'achat
  isEquipped: boolean     // État d'équipement
}
```

---

### `AccessoryCategory`

Type énuméré des catégories.

```typescript
type AccessoryCategory = 
  | 'hat'          // Chapeaux
  | 'glasses'      // Lunettes
  | 'shoes'        // Chaussures
  | 'background'   // Arrière-plans
  | 'effect'       // Effets spéciaux
```

---

### `AccessoryRarity`

Type énuméré des raretés.

```typescript
type AccessoryRarity = 
  | 'common'       // Commun (×1 = 50 coins)
  | 'rare'         // Rare (×2 = 100 coins)
  | 'epic'         // Épique (×4 = 200 coins)
  | 'legendary'    // Légendaire (×8 = 400 coins)
```

---

### `PurchaseAccessoryDTO`

Data Transfer Object pour l'achat.

```typescript
interface PurchaseAccessoryDTO {
  accessoryId: string     // Accessoire à acheter
  monsterId: string       // Monstre à équiper
}
```

---

## 🔍 Fonctions Utilitaires

### Fonctions de Label

```typescript
/**
 * Obtient le label de rareté en français
 */
function getRarityLabel(rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common': return 'Commun'
    case 'rare': return 'Rare'
    case 'epic': return 'Épique'
    case 'legendary': return 'Légendaire'
  }
}

/**
 * Obtient le label de catégorie en français
 */
function getCategoryLabel(category: string): string {
  switch (category) {
    case 'hat': return 'Chapeau'
    case 'glasses': return 'Lunettes'
    case 'shoes': return 'Chaussures'
    case 'background': return 'Arrière-plan'
    case 'effect': return 'Effet'
    default: return category
  }
}
```

### Fonctions de Style

```typescript
/**
 * Obtient la couleur de badge selon la rareté (thème nature)
 */
function getRarityColor(rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common': return 'bg-earth-100/80 text-earth-700'
    case 'rare': return 'bg-sky-100/80 text-sky-700'
    case 'epic': return 'bg-lavender-100/80 text-lavender-700'
    case 'legendary': return 'bg-sunset-100/80 text-sunset-700'
  }
}
```

---

## 🔄 Constantes

### Prix de Base

```typescript
const BASE_PRICE = 50  // gochoCoins
```

### Multiplicateurs de Rareté

```typescript
function getRarityMultiplier(rarity: AccessoryRarity): number {
  switch (rarity) {
    case 'common': return 1
    case 'rare': return 2
    case 'epic': return 4
    case 'legendary': return 8
  }
}
```

### Catalogue

Le catalogue complet contient **30 accessoires** :
- 6 chapeaux (hat)
- 6 lunettes (glasses)
- 6 chaussures (shoes)
- 6 arrière-plans (background)
- 6 effets spéciaux (effect)

Chaque catégorie contient au moins un item de chaque rareté.

---

## 📝 Exemples de Réponses API

### Succès d'Achat

```json
{
  "success": true,
  "message": "Chapeau de Fête acheté et équipé avec succès !",
  "remainingCoins": 150,
  "ownedAccessoryId": "507f1f77bcf86cd799439011"
}
```

### Erreur - Solde Insuffisant

```json
{
  "success": false,
  "message": "Solde insuffisant. Vous avez 30 gochoCoins, il en faut 50"
}
```

### Erreur - Déjà Possédé

```json
{
  "success": false,
  "message": "Vous possédez déjà cet accessoire"
}
```

### Erreur - Non Authentifié

```json
{
  "success": false,
  "message": "Vous devez être connecté pour acheter un accessoire"
}
```

### Erreur - Accessoire Introuvable

```json
{
  "success": false,
  "message": "Accessoire introuvable"
}
```


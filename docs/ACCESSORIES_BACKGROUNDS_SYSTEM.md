# Système d'Accessoires et d'Arrière-plans

> Documentation complète du système d'achat, de gestion et d'équipement d'accessoires pour les monstres Tomatgotchi.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Structure de Base de Données](#structure-de-base-de-données)
4. [Types TypeScript](#types-typescript)
5. [Services Domain Layer](#services-domain-layer)
6. [Actions Server-Side](#actions-server-side)
7. [Composants UI](#composants-ui)
8. [Configuration du Catalogue](#configuration-du-catalogue)
9. [Flux d'Achat](#flux-dachat)
10. [Intégration avec les Quêtes](#intégration-avec-les-quêtes)
11. [Exemples d'Utilisation](#exemples-dutilisation)

---

## 🎯 Vue d'ensemble

Le système d'accessoires permet aux utilisateurs de :
- **Parcourir** un catalogue de 30 accessoires répartis en 5 catégories
- **Acheter** des accessoires avec leurs gochoCoins
- **Équiper** automatiquement les accessoires à leurs monstres
- **Gérer** leur inventaire d'accessoires possédés
- **Personnaliser** l'apparence de leurs monstres

### Catégories d'Accessoires

| Catégorie | Description | Exemples |
|-----------|-------------|----------|
| `hat` | Chapeaux et couvre-chefs | 🎩 Haut-de-forme, 👑 Couronne |
| `glasses` | Lunettes et accessoires visuels | 😎 Lunettes de soleil, 🤓 Lunettes de génie |
| `shoes` | Chaussures et équipement de pieds | 👟 Baskets, 🚀 Bottes fusées |
| `background` | Arrière-plans décoratifs | 🌈 Arc-en-ciel, 🌌 Galaxie |
| `effect` | Effets visuels spéciaux | ✨ Paillettes, 🔥 Aura de feu |

### Niveaux de Rareté

| Rareté | Multiplicateur | Prix Base | Couleur Thème |
|--------|----------------|-----------|---------------|
| `common` | ×1 | 50 coins | Terre (earth) |
| `rare` | ×2 | 100 coins | Ciel (sky) |
| `epic` | ×4 | 200 coins | Lavande (lavender) |
| `legendary` | ×8 | 400 coins | Coucher de soleil (sunset) |

---

## 🏗️ Architecture

Le système suit les principes de **Clean Architecture** avec une séparation stricte des responsabilités.

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│  (Components UI - React/Next.js)                        │
│  - UniversalAccessoryCard                               │
│  - PurchaseConfirmationModal                            │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Application Layer                       │
│  (Server Actions - Orchestration)                       │
│  - purchaseAccessory()                                  │
│  - purchaseAccessoryOnly()                              │
│  - equipAccessory()                                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Domain Layer                           │
│  (Business Logic - Pure TypeScript)                     │
│  - accessory.service.ts                                 │
│  - owned-accessory.service.ts                           │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Infrastructure Layer                       │
│  (Database - MongoDB/Mongoose)                          │
│  - OwnedAccessoryModel                                  │
└─────────────────────────────────────────────────────────┘
```

### Principes SOLID Appliqués

#### 1. **Single Responsibility Principle (SRP)**
- `accessory.service.ts` : Gère uniquement le catalogue d'accessoires
- `owned-accessory.service.ts` : Gère uniquement la propriété et l'équipement
- `accessory.actions.ts` : Orchestre uniquement les achats et équipements

#### 2. **Open/Closed Principle (OCP)**
- Ajout de nouveaux accessoires sans modification du code existant
- Extension du catalogue via configuration déclarative

#### 3. **Dependency Inversion Principle (DIP)**
- Les actions dépendent des abstractions (services)
- Les services ne dépendent pas des modèles Mongoose directement

---

## 🗄️ Structure de Base de Données

### Modèle MongoDB : `OwnedAccessory`

```typescript
{
  _id: ObjectId,
  ownerId: string,        // ID de l'utilisateur propriétaire
  accessoryId: string,    // ID de l'accessoire (référence catalogue)
  monsterId?: string,     // ID du monstre équipé (optionnel)
  purchasedAt: Date,      // Date d'achat
  isEquipped: boolean,    // État d'équipement
  createdAt: Date,        // Auto-généré par Mongoose
  updatedAt: Date         // Auto-généré par Mongoose
}
```

### Index MongoDB

```typescript
// Index pour éviter les doublons
{ ownerId: 1, accessoryId: 1 }

// Index pour recherche rapide par monstre
{ monsterId: 1, isEquipped: 1 }

// Index pour recherche par propriétaire
{ ownerId: 1 }
```

**Fichier** : `src/db/models/owned-accessory.model.ts`

---

## 📐 Types TypeScript

### Types Fondamentaux

```typescript
/**
 * Catégories d'accessoires disponibles
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes' | 'background' | 'effect'

/**
 * Niveaux de rareté (affecte le prix)
 */
export type AccessoryRarity = 'common' | 'rare' | 'epic' | 'legendary'
```

### Interface `Accessory`

```typescript
/**
 * Entité représentant un accessoire du catalogue
 */
export interface Accessory {
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

### Interface `OwnedAccessory`

```typescript
/**
 * Accessoire acheté et possédé par un utilisateur
 */
export interface OwnedAccessory {
  _id: string             // ID MongoDB
  ownerId: string         // ID utilisateur
  accessoryId: string     // Référence à Accessory.id
  monsterId?: string      // Monstre équipé (si applicable)
  purchasedAt: Date | string
  isEquipped: boolean
}
```

### DTO de Purchase

```typescript
/**
 * Data Transfer Object pour l'achat
 */
export interface PurchaseAccessoryDTO {
  accessoryId: string
  monsterId: string
}
```

**Fichier** : `src/types/accessory.ts`

---

## ⚙️ Services Domain Layer

### 1. Accessory Service (`accessory.service.ts`)

Service de catalogue - fournit la liste des accessoires disponibles.

#### Fonctions Principales

```typescript
/**
 * Récupère tous les accessoires disponibles
 * @returns Tableau de 30 accessoires
 */
export function getAvailableAccessories(): Accessory[]

/**
 * Récupère un accessoire par son ID
 * @param id - Identifiant de l'accessoire
 * @returns Accessoire ou null
 */
export function getAccessoryById(id: string): Accessory | null

/**
 * Filtre les accessoires par catégorie
 * @param category - Catégorie à filtrer
 * @returns Accessoires de la catégorie
 */
export function getAccessoriesByCategory(category: string): Accessory[]

/**
 * Filtre les accessoires par rareté
 * @param rarity - Niveau de rareté
 * @returns Accessoires de la rareté spécifiée
 */
export function getAccessoriesByRarity(rarity: AccessoryRarity): Accessory[]
```

#### Calcul des Prix

```typescript
/**
 * Prix de base : 50 gochoCoins
 * Multiplicateurs de rareté :
 * - common: ×1 = 50 coins
 * - rare: ×2 = 100 coins
 * - epic: ×4 = 200 coins
 * - legendary: ×8 = 400 coins
 */
const BASE_PRICE = 50

function getRarityMultiplier(rarity: AccessoryRarity): number {
  switch (rarity) {
    case 'common': return 1
    case 'rare': return 2
    case 'epic': return 4
    case 'legendary': return 8
  }
}
```

#### Catalogue Complet

Le service contient **30 accessoires** répartis comme suit :
- 6 chapeaux (hat)
- 6 lunettes (glasses)
- 6 chaussures (shoes)
- 6 arrière-plans (background)
- 6 effets spéciaux (effect)

Chaque catégorie contient des items de toutes les raretés.

---

### 2. Owned Accessory Service (`owned-accessory.service.ts`)

Service de gestion de la propriété et de l'équipement.

#### Fonctions de Création

```typescript
/**
 * Crée un nouvel enregistrement d'accessoire possédé
 * @param ownerId - ID de l'utilisateur
 * @param accessoryId - ID de l'accessoire acheté
 * @param monsterId - ID du monstre (optionnel, pour équipement automatique)
 * @returns OwnedAccessory créé
 */
export async function createOwnedAccessory(
  ownerId: string,
  accessoryId: string,
  monsterId?: string
): Promise<OwnedAccessory>
```

#### Fonctions de Récupération

```typescript
/**
 * Récupère tous les accessoires d'un utilisateur
 * @param ownerId - ID de l'utilisateur
 * @returns Tableau d'accessoires possédés
 */
export async function getOwnedAccessoriesByUser(ownerId: string): Promise<OwnedAccessory[]>

/**
 * Récupère les accessoires équipés sur un monstre
 * @param monsterId - ID du monstre
 * @returns Accessoires équipés
 */
export async function getOwnedAccessoriesByMonster(monsterId: string): Promise<OwnedAccessory[]>

/**
 * Récupère uniquement les IDs des accessoires possédés
 * @param ownerId - ID de l'utilisateur
 * @returns Tableau d'IDs
 */
export async function getOwnedAccessoryIds(ownerId: string): Promise<string[]>
```

#### Fonctions de Validation

```typescript
/**
 * Vérifie si un utilisateur possède un accessoire
 * @param ownerId - ID de l'utilisateur
 * @param accessoryId - ID de l'accessoire à vérifier
 * @returns true si possédé
 */
export async function userOwnsAccessory(
  ownerId: string,
  accessoryId: string
): Promise<boolean>
```

#### Fonctions d'Équipement

```typescript
/**
 * Équipe un accessoire sur un monstre
 * @param ownedAccessoryId - ID de l'accessoire possédé
 * @param monsterId - ID du monstre
 * @returns OwnedAccessory mis à jour ou null
 */
export async function equipAccessoryToMonster(
  ownedAccessoryId: string,
  monsterId: string
): Promise<OwnedAccessory | null>

/**
 * Déséquipe un accessoire
 * @param ownedAccessoryId - ID de l'accessoire possédé
 * @returns OwnedAccessory mis à jour ou null
 */
export async function unequipAccessory(
  ownedAccessoryId: string
): Promise<OwnedAccessory | null>
```

---

## 🔧 Actions Server-Side

### Fichier : `src/actions/accessory.actions.ts`

Les actions orchestrent la logique métier avec authentification et validation.

### 1. Achat avec Équipement Automatique

```typescript
/**
 * Achète un accessoire et l'équipe automatiquement au monstre
 * 
 * Flux complet :
 * 1. Vérifie l'authentification
 * 2. Valide l'existence de l'accessoire
 * 3. Vérifie que l'utilisateur ne le possède pas déjà
 * 4. Vérifie le solde de gochoCoins
 * 5. Déduit le prix du wallet
 * 6. Crée l'OwnedAccessory
 * 7. Équipe automatiquement au monstre
 * 8. Suit la progression des quêtes
 * 9. Revalide le cache Next.js
 * 
 * @param accessoryId - ID de l'accessoire
 * @param monsterId - ID du monstre
 * @returns Résultat de l'opération
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
```

#### Exemple de Réponse

```typescript
// Succès
{
  success: true,
  message: "Chapeau de Fête acheté et équipé avec succès !",
  remainingCoins: 150,
  ownedAccessoryId: "507f1f77bcf86cd799439011"
}

// Échec - Solde insuffisant
{
  success: false,
  message: "Solde insuffisant. Vous avez 30 gochoCoins, il en faut 50"
}

// Échec - Déjà possédé
{
  success: false,
  message: "Vous possédez déjà cet accessoire"
}
```

### 2. Achat sans Équipement

```typescript
/**
 * Achète un accessoire sans l'équiper (ajout à l'inventaire uniquement)
 * 
 * @param accessoryId - ID de l'accessoire
 * @returns Résultat de l'opération
 */
export async function purchaseAccessoryOnly(
  accessoryId: string
): Promise<{
  success: boolean
  message: string
  remainingCoins?: number
  ownedAccessoryId?: string
}>
```

### 3. Équipement/Déséquipement

```typescript
/**
 * Équipe un accessoire déjà possédé sur un monstre
 */
export async function equipAccessory(
  ownedAccessoryId: string,
  monsterId: string
): Promise<{
  success: boolean
  message: string
}>

/**
 * Déséquipe un accessoire
 */
export async function unequipAccessoryAction(
  ownedAccessoryId: string
): Promise<{
  success: boolean
  message: string
}>
```

### 4. Récupération des Accessoires

```typescript
/**
 * Récupère tous les accessoires possédés par l'utilisateur connecté
 */
export async function getUserAccessories(): Promise<OwnedAccessory[]>

/**
 * Récupère les accessoires équipés sur un monstre
 */
export async function getMonsterAccessories(monsterId: string): Promise<OwnedAccessory[]>

/**
 * Récupère les IDs des accessoires possédés (pour détection de doublons)
 */
export async function getUserAccessoryIds(): Promise<string[]>
```

---

## 🎨 Composants UI

### 1. UniversalAccessoryCard

Composant universel d'affichage d'accessoire avec support SVG optionnel.

**Fichier** : `src/components/accessories/universal-accessory-card.tsx`

#### Props

```typescript
interface UniversalAccessoryCardProps {
  accessory: Accessory        // Accessoire à afficher
  onPurchase?: (accessoryId: string) => void  // Callback d'achat
  isOwned?: boolean          // État de possession
}
```

#### Caractéristiques

- **Affichage SVG dynamique** : Utilise `accessory-generator` si support disponible
- **Fallback sur icône** : Affiche l'emoji si pas de SVG
- **Thème nature** : Couleurs adaptées selon la rareté
- **Animations** : Hover effects et transitions fluides
- **Accessibilité** : Attributs ARIA et structure sémantique

#### Fonctions Utilitaires

```typescript
/**
 * Couleur de badge selon la rareté (thème nature)
 */
function getRarityColor(rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common': return 'bg-earth-100/80 text-earth-700'
    case 'rare': return 'bg-sky-100/80 text-sky-700'
    case 'epic': return 'bg-lavender-100/80 text-lavender-700'
    case 'legendary': return 'bg-sunset-100/80 text-sunset-700'
  }
}

/**
 * Label de rareté en français
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
 * Label de catégorie en français
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

#### Exemple d'Utilisation

```tsx
<UniversalAccessoryCard
  accessory={accessory}
  onPurchase={(id) => handlePurchase(id)}
  isOwned={ownedAccessoryIds.includes(accessory.id)}
/>
```

---

### 2. PurchaseConfirmationModal

Modal de confirmation d'achat avec détails de l'accessoire.

**Fichier** : `src/components/accessories/purchase-confirmation-modal.tsx`

#### Props

```typescript
interface PurchaseConfirmationModalProps {
  accessory: Accessory | null     // Accessoire sélectionné
  isOpen: boolean                 // État d'ouverture
  onClose: () => void             // Fermeture du modal
  onConfirm: () => Promise<void>  // Confirmation d'achat
  userCoins: number               // Solde utilisateur
}
```

#### Fonctionnalités

- **Validation du solde** : Désactive le bouton si fonds insuffisants
- **Affichage du prix** : Avec icône TomatokenIcon
- **Gestion du loading** : État de chargement pendant l'achat
- **Accessibilité** : Focus trap et fermeture au clavier (ESC)

---

## 📦 Configuration du Catalogue

### Ajout d'un Nouvel Accessoire

Pour ajouter un accessoire au catalogue, modifiez `src/services/accessory.service.ts` :

```typescript
export function getAvailableAccessories(): Accessory[] {
  return [
    // ...accessoires existants...
    
    // Nouvel accessoire
    {
      id: 'hat-pirate',              // ID unique
      name: 'Chapeau de Pirate',     // Nom affiché
      description: 'Arr matey !',    // Description
      category: 'hat',               // Catégorie
      rarity: 'rare',                // Rareté
      price: BASE_PRICE * getRarityMultiplier('rare'),  // Prix calculé
      icon: '🏴‍☠️',                   // Emoji
      effect: 'Chance de trouver des trésors'  // Effet (optionnel)
    }
  ]
}
```

### Conventions de Nommage

- **ID** : `{category}-{name}` en kebab-case (ex: `hat-party`, `glasses-cyber`)
- **Nom** : En français, capitalisé (ex: "Chapeau de Fête")
- **Description** : Courte et engageante
- **Icon** : Emoji Unicode unique et visible

---

## 🔄 Flux d'Achat

### Diagramme de Séquence

```
Utilisateur → Composant UI → Server Action → Services → Base de Données
    │              │               │              │            │
    │──Click───────>│               │              │            │
    │              │──purchase──────>│              │            │
    │              │     Accessory  │              │            │
    │              │               │──auth()──────>│            │
    │              │               │<──session─────│            │
    │              │               │              │            │
    │              │               │──getAccessory>│            │
    │              │               │<──accessory───│            │
    │              │               │              │            │
    │              │               │──checkOwned──>│            │
    │              │               │<──false───────│            │
    │              │               │              │            │
    │              │               │──getWallet───>│──find()──>│
    │              │               │<──wallet──────│<──────────│
    │              │               │              │            │
    │              │               │──subtract────>│──update()─>│
    │              │               │   Coins       │            │
    │              │               │<──updated─────│<──────────│
    │              │               │   Wallet      │            │
    │              │               │              │            │
    │              │               │──create──────>│──create()─>│
    │              │               │   Owned       │            │
    │              │               │<──owned───────│<──────────│
    │              │               │   Accessory   │            │
    │              │               │              │            │
    │              │               │──track────────>│            │
    │              │               │   Quest       │            │
    │              │<──result──────│              │            │
    │<──update─────│ (revalidate)  │              │            │
```

### Étapes Détaillées

1. **Authentification** : Vérification de la session utilisateur
2. **Validation** : Vérification de l'existence de l'accessoire et de la non-possession
3. **Vérification du Solde** : Comparaison prix vs solde disponible
4. **Transaction** : Déduction des coins du wallet
5. **Création** : Enregistrement de l'OwnedAccessory en base
6. **Équipement** : Association automatique au monstre (si monsterId fourni)
7. **Quêtes** : Mise à jour de la progression des quêtes quotidiennes
8. **Revalidation** : Invalidation du cache Next.js pour rafraîchir l'UI

### Gestion des Erreurs

```typescript
// Erreurs possibles
- "Vous devez être connecté pour acheter un accessoire"
- "Accessoire introuvable"
- "Vous possédez déjà cet accessoire"
- "Solde insuffisant. Vous avez X gochoCoins, il en faut Y"
- "Erreur lors de l'achat de l'accessoire" (erreur générique)
```

---

## 🎯 Intégration avec les Quêtes

Le système d'accessoires s'intègre automatiquement avec le système de quêtes quotidiennes.

### Quêtes Trackées Automatiquement

```typescript
// Lors de l'achat avec équipement (purchaseAccessory)
await trackQuestProgress(userId, 'buy_accessory', 1)
await trackQuestProgress(userId, 'equip_accessory', 1)

// Lors de l'équipement manuel (equipAccessory)
await trackQuestProgress(userId, 'equip_accessory', 1)
```

### Types de Quêtes Concernées

- **buy_accessory** : "Acheter X accessoires"
- **equip_accessory** : "Équiper X accessoires sur vos monstres"

### Gestion des Erreurs de Quêtes

```typescript
try {
  await trackQuestProgress(userId, 'buy_accessory', 1)
} catch (questError) {
  // Erreur silencieuse - ne bloque pas l'achat
  console.warn('Failed to track quest progress:', questError)
}
```

**Important** : Les erreurs de tracking de quêtes ne doivent jamais bloquer le flux d'achat principal.

---

## 💡 Exemples d'Utilisation

### 1. Page de Boutique d'Accessoires

```tsx
'use client'

import { useState } from 'react'
import { getAvailableAccessories } from '@/services/accessory.service'
import { getUserAccessoryIds } from '@/actions/accessory.actions'
import { UniversalAccessoryCard } from '@/components/accessories/universal-accessory-card'
import { PurchaseConfirmationModal } from '@/components/accessories/purchase-confirmation-modal'

export default function AccessoryShop() {
  const [accessories] = useState(getAvailableAccessories())
  const [ownedIds, setOwnedIds] = useState<string[]>([])
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const [userCoins, setUserCoins] = useState(200)

  // Charger les accessoires possédés
  useEffect(() => {
    getUserAccessoryIds().then(setOwnedIds)
  }, [])

  const handlePurchase = async () => {
    if (!selectedAccessory) return
    
    const result = await purchaseAccessory(
      selectedAccessory.id,
      currentMonsterId
    )
    
    if (result.success) {
      setUserCoins(result.remainingCoins ?? userCoins)
      setOwnedIds([...ownedIds, selectedAccessory.id])
      setSelectedAccessory(null)
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {accessories.map((accessory) => (
        <UniversalAccessoryCard
          key={accessory.id}
          accessory={accessory}
          onPurchase={() => setSelectedAccessory(accessory)}
          isOwned={ownedIds.includes(accessory.id)}
        />
      ))}
      
      <PurchaseConfirmationModal
        accessory={selectedAccessory}
        isOpen={selectedAccessory !== null}
        onClose={() => setSelectedAccessory(null)}
        onConfirm={handlePurchase}
        userCoins={userCoins}
      />
    </div>
  )
}
```

### 2. Filtrage par Catégorie

```tsx
import { getAccessoriesByCategory } from '@/services/accessory.service'

function HatShop() {
  const hats = getAccessoriesByCategory('hat')
  
  return (
    <div>
      <h2>Chapeaux ({hats.length})</h2>
      {hats.map(hat => (
        <UniversalAccessoryCard
          key={hat.id}
          accessory={hat}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  )
}
```

### 3. Filtrage par Rareté

```tsx
import { getAccessoriesByRarity } from '@/services/accessory.service'

function LegendaryAccessories() {
  const legendaries = getAccessoriesByRarity('legendary')
  
  return (
    <div className="bg-gradient-to-br from-gold-50 to-sunset-50 p-8 rounded-3xl">
      <h2 className="text-2xl font-bold text-sunset-700">
        Accessoires Légendaires ✨
      </h2>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {legendaries.map(item => (
          <UniversalAccessoryCard
            key={item.id}
            accessory={item}
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  )
}
```

### 4. Affichage des Accessoires Équipés

```tsx
import { getMonsterAccessories } from '@/actions/accessory.actions'
import { getAccessoryById } from '@/services/accessory.service'

async function MonsterAccessoriesDisplay({ monsterId }: { monsterId: string }) {
  const ownedAccessories = await getMonsterAccessories(monsterId)
  
  const accessories = ownedAccessories
    .map(owned => getAccessoryById(owned.accessoryId))
    .filter(Boolean)
  
  return (
    <div>
      <h3>Accessoires Équipés</h3>
      {accessories.length === 0 ? (
        <p>Aucun accessoire équipé</p>
      ) : (
        <ul>
          {accessories.map(accessory => (
            <li key={accessory.id}>
              {accessory.icon} {accessory.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### 5. Inventaire Utilisateur

```tsx
import { getUserAccessories } from '@/actions/accessory.actions'

async function UserInventory() {
  const ownedAccessories = await getUserAccessories()
  
  // Grouper par catégorie
  const byCategory = ownedAccessories.reduce((acc, owned) => {
    const accessory = getAccessoryById(owned.accessoryId)
    if (!accessory) return acc
    
    if (!acc[accessory.category]) {
      acc[accessory.category] = []
    }
    acc[accessory.category].push({ owned, accessory })
    return acc
  }, {} as Record<string, Array<{ owned: OwnedAccessory, accessory: Accessory }>>)
  
  return (
    <div>
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category}>
          <h3>{getCategoryLabel(category)} ({items.length})</h3>
          <div className="grid grid-cols-3 gap-4">
            {items.map(({ owned, accessory }) => (
              <div key={owned._id}>
                <UniversalAccessoryCard
                  accessory={accessory}
                  isOwned={true}
                />
                {owned.isEquipped && (
                  <span className="badge">Équipé</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
```

---

## 🔍 Debugging et Logs

### Logs Utiles

```typescript
// Dans les actions
console.log('Purchasing accessory:', { accessoryId, monsterId, userId })
console.log('Wallet balance:', wallet.coin, 'Required:', accessory.price)
console.log('Accessory purchased:', ownedAccessory._id)

// Dans les services
console.log('Creating owned accessory:', { ownerId, accessoryId, monsterId })
console.log('Found owned accessories:', ownedAccessories.length)
```

### Vérifications de Santé

```typescript
// Vérifier les doublons
const duplicates = await OwnedAccessoryModel.aggregate([
  { $group: { _id: { ownerId: '$ownerId', accessoryId: '$accessoryId' }, count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])

// Compter les accessoires par catégorie
const byCategory = getAvailableAccessories().reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1
  return acc
}, {})
console.log('Accessories by category:', byCategory)
```

---

## 🚀 Évolutions Futures

### Fonctionnalités Prévues

1. **Système de Craft** : Combiner des accessoires communs pour créer des rares
2. **Accessoires à Durée Limitée** : Items saisonniers ou événementiels
3. **Effets Réels** : Bonus de stats ou capacités spéciales pour certains accessoires
4. **Système de Sets** : Bonus pour équiper plusieurs accessoires d'un même set
5. **Échange entre Joueurs** : Marketplace communautaire
6. **Génération Procédurale** : SVG dynamiques pour certains accessoires

### Optimisations Possibles

- **Cache Redis** : Pour le catalogue d'accessoires
- **Pagination** : Pour les grandes collections d'accessoires possédés
- **Lazy Loading** : Pour les images SVG lourdes
- **Indexation Elasticsearch** : Pour recherche avancée dans le catalogue

---

## 📚 Références

### Fichiers Principaux

| Fichier | Responsabilité |
|---------|----------------|
| `src/types/accessory.ts` | Définitions de types |
| `src/services/accessory.service.ts` | Catalogue et prix |
| `src/services/owned-accessory.service.ts` | Gestion de propriété |
| `src/actions/accessory.actions.ts` | Orchestration d'achat |
| `src/db/models/owned-accessory.model.ts` | Modèle MongoDB |
| `src/components/accessories/universal-accessory-card.tsx` | Carte UI |
| `src/components/accessories/purchase-confirmation-modal.tsx` | Modal d'achat |

### Services Dépendants

- **Wallet Service** : `src/services/wallet.service.ts`
- **Quest Service** : `src/services/daily-quest.service.ts`
- **Auth Service** : `src/lib/auth.ts`
- **Accessory Generator** : `src/services/accessories/accessory-generator.ts`

### Routes Concernées

- `/shop` : Boutique d'accessoires
- `/creature` : Affichage du monstre avec accessoires
- `/dashboard` : Récapitulatif avec accessoires
- `/wallet` : Solde et historique d'achats

---

## 🧪 Tests Recommandés

### Tests Unitaires (Services)

```typescript
describe('accessory.service', () => {
  test('getAvailableAccessories returns 30 items', () => {
    expect(getAvailableAccessories()).toHaveLength(30)
  })
  
  test('getAccessoryById returns correct accessory', () => {
    const hat = getAccessoryById('hat-party')
    expect(hat?.name).toBe('Chapeau de Fête')
  })
  
  test('getRarityMultiplier calculates correctly', () => {
    expect(getRarityMultiplier('legendary')).toBe(8)
  })
})

describe('owned-accessory.service', () => {
  test('createOwnedAccessory creates record', async () => {
    const owned = await createOwnedAccessory('user123', 'hat-party', 'monster456')
    expect(owned.isEquipped).toBe(true)
  })
  
  test('userOwnsAccessory detects ownership', async () => {
    await createOwnedAccessory('user123', 'hat-party')
    const owns = await userOwnsAccessory('user123', 'hat-party')
    expect(owns).toBe(true)
  })
})
```

### Tests d'Intégration (Actions)

```typescript
describe('accessory.actions', () => {
  test('purchaseAccessory deducts coins', async () => {
    const result = await purchaseAccessory('hat-party', 'monster123')
    expect(result.success).toBe(true)
    expect(result.remainingCoins).toBeLessThan(initialCoins)
  })
  
  test('purchaseAccessory prevents duplicates', async () => {
    await purchaseAccessory('hat-party', 'monster123')
    const result = await purchaseAccessory('hat-party', 'monster123')
    expect(result.success).toBe(false)
    expect(result.message).toContain('possédez déjà')
  })
})
```

### Tests E2E (Cypress/Playwright)

```typescript
test('user can purchase and equip accessory', async ({ page }) => {
  await page.goto('/shop')
  await page.click('[data-testid="accessory-hat-party"]')
  await page.click('[data-testid="confirm-purchase"]')
  await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
  await page.goto('/creature')
  await expect(page.locator('[data-testid="equipped-hat-party"]')).toBeVisible()
})
```

---

## 📝 Notes de Maintenance

### Version du Système

- **Version actuelle** : 1.0.0
- **Date de création** : 2025-01-12
- **Dernière mise à jour** : 2025-01-12

### Contributions

Pour contribuer au système d'accessoires :

1. Respecter les principes SOLID et Clean Architecture
2. Documenter les nouvelles fonctions avec JSDoc
3. Ajouter des tests pour toute nouvelle feature
4. Mettre à jour cette documentation

### Support

Pour toute question ou problème :
- Consulter les logs de la console
- Vérifier les erreurs MongoDB dans les logs serveur
- Utiliser les outils de debugging Next.js DevTools

---

**Fin de la documentation**

*Cette documentation est maintenue par l'équipe de développement Tomatgotchi.*


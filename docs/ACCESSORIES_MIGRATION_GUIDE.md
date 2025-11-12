# 🔄 Guide de Migration - Système d'Accessoires

Ce document explique comment intégrer ou migrer vers le nouveau système d'accessoires.

## 📅 Informations de Version

- **Date de Mise en Production** : 2025-01-12
- **Version** : 1.0.0
- **Breaking Changes** : Aucun (nouveau système)
- **Migration Required** : Non (système additionnel)

---

## ✨ Nouveautés

### Nouvelles Fonctionnalités

#### 1. Système d'Achat d'Accessoires
- Boutique avec 30 accessoires uniques
- Système de rareté à 4 niveaux
- Prix dynamique basé sur la rareté
- Prévention des achats en double

#### 2. Gestion d'Inventaire
- Accessoires possédés par utilisateur
- Équipement/déséquipement de monstres
- Historique d'achats

#### 3. Intégration avec Quêtes
- Tracking automatique de `buy_accessory`
- Tracking automatique de `equip_accessory`

#### 4. Composants UI Réutilisables
- `UniversalAccessoryCard` avec support SVG
- `PurchaseConfirmationModal` avec validation de solde

---

## 🚀 Comment Intégrer dans Votre Projet

### Étape 1 : Imports

Importer les services nécessaires :

```typescript
// Services (Domain Layer)
import { 
  getAvailableAccessories,
  getAccessoryById,
  getAccessoriesByCategory,
  getAccessoriesByRarity
} from '@/services/accessory.service'

// Actions (Application Layer)
import { 
  purchaseAccessory,
  getUserAccessories,
  getUserAccessoryIds 
} from '@/actions/accessory.actions'

// Composants
import { 
  UniversalAccessoryCard,
  PurchaseConfirmationModal 
} from '@/components/accessories'

// Types
import type { 
  Accessory, 
  OwnedAccessory, 
  AccessoryCategory,
  AccessoryRarity 
} from '@/types/accessory'
```

### Étape 2 : Récupérer les Données

```typescript
'use client'

import { useState, useEffect } from 'react'

export function MyAccessoryPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [ownedIds, setOwnedIds] = useState<string[]>([])

  useEffect(() => {
    // Charger le catalogue
    const catalog = getAvailableAccessories()
    setAccessories(catalog)

    // Charger les accessoires possédés
    getUserAccessoryIds().then(setOwnedIds)
  }, [])

  // ... reste du composant
}
```

### Étape 3 : Afficher les Accessoires

```tsx
<div className="grid grid-cols-4 gap-6">
  {accessories.map((accessory) => (
    <UniversalAccessoryCard
      key={accessory.id}
      accessory={accessory}
      onPurchase={(id) => handlePurchase(id)}
      isOwned={ownedIds.includes(accessory.id)}
    />
  ))}
</div>
```

### Étape 4 : Gérer l'Achat

```typescript
const handlePurchase = async (accessoryId: string) => {
  // Vérifier que l'utilisateur a un monstre actif
  if (!currentMonsterId) {
    toast.error('Sélectionnez d\'abord un monstre')
    return
  }

  // Effectuer l'achat
  const result = await purchaseAccessory(accessoryId, currentMonsterId)

  if (result.success) {
    // Mise à jour de l'UI
    setOwnedIds([...ownedIds, accessoryId])
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
}
```

---

## 🔧 Migration depuis un Ancien Système

Si vous aviez un système d'accessoires maison, voici comment migrer :

### 1. Mapping des Données

```typescript
// Ancien format
interface OldAccessory {
  accessoryId: string
  accessoryName: string
  accessoryType: string
  cost: number
}

// Nouveau format
interface Accessory {
  id: string
  name: string
  category: AccessoryCategory
  rarity: AccessoryRarity
  price: number
  icon: string
}

// Script de migration
function migrateAccessory(old: OldAccessory): Accessory {
  return {
    id: old.accessoryId,
    name: old.accessoryName,
    category: mapOldTypeToCategory(old.accessoryType),
    rarity: calculateRarity(old.cost),
    price: old.cost,
    icon: '✨' // À définir manuellement
  }
}

function mapOldTypeToCategory(oldType: string): AccessoryCategory {
  const mapping: Record<string, AccessoryCategory> = {
    'headwear': 'hat',
    'eyewear': 'glasses',
    'footwear': 'shoes',
    'bg': 'background',
    'fx': 'effect'
  }
  return mapping[oldType] || 'effect'
}

function calculateRarity(price: number): AccessoryRarity {
  if (price >= 400) return 'legendary'
  if (price >= 200) return 'epic'
  if (price >= 100) return 'rare'
  return 'common'
}
```

### 2. Migration de la Base de Données

```typescript
// Script de migration MongoDB
async function migrateOwnedAccessories() {
  const oldRecords = await OldAccessoryModel.find({})

  for (const old of oldRecords) {
    await OwnedAccessoryModel.create({
      ownerId: old.userId,
      accessoryId: old.accessoryId,
      monsterId: old.petId || null,
      purchasedAt: old.createdAt,
      isEquipped: old.equipped || false
    })
  }

  console.log(`Migrated ${oldRecords.length} accessories`)
}
```

### 3. Mise à Jour des Composants

```tsx
// Ancien composant
<OldAccessoryCard 
  accessory={accessory}
  onClick={handleClick}
  owned={isOwned}
/>

// Nouveau composant
<UniversalAccessoryCard
  accessory={accessory}
  onPurchase={handleClick}
  isOwned={isOwned}
/>
```

---

## 🔄 Changements d'API

### Actions qui Remplacent d'Anciennes Fonctions

| Ancienne Fonction | Nouvelle Fonction | Notes |
|-------------------|-------------------|-------|
| `buyAccessory()` | `purchaseAccessory()` | Plus de validation, tracking de quêtes |
| `getMyAccessories()` | `getUserAccessories()` | Utilise auth automatiquement |
| `attachAccessory()` | `equipAccessory()` | Distinction équipement/possession |
| N/A | `getUserAccessoryIds()` | Optimisation pour UI |

### Changements de Signature

```typescript
// Ancien
async function buyAccessory(userId: string, itemId: string) {
  // ...
}

// Nouveau (authentification automatique)
async function purchaseAccessory(
  accessoryId: string,
  monsterId: string
): Promise<PurchaseResult>
```

---

## 📦 Nouvelles Dépendances

Aucune nouvelle dépendance externe n'est requise. Le système utilise uniquement :
- Next.js (déjà installé)
- Mongoose (déjà installé)
- React (déjà installé)
- TypeScript (déjà installé)

---

## 🗄️ Changements de Base de Données

### Nouvelle Collection : `ownedaccessories`

```javascript
// Index créés automatiquement
db.ownedaccessories.createIndex({ ownerId: 1 })
db.ownedaccessories.createIndex({ ownerId: 1, accessoryId: 1 })
db.ownedaccessories.createIndex({ monsterId: 1, isEquipped: 1 })
```

### Schéma

```javascript
{
  _id: ObjectId,
  ownerId: String,
  accessoryId: String,
  monsterId: String | null,
  purchasedAt: Date,
  isEquipped: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Changements UI/UX

### Nouveaux Composants Disponibles

1. **UniversalAccessoryCard**
   - Remplace tout composant de carte d'accessoire précédent
   - Support SVG automatique
   - Animations fluides

2. **PurchaseConfirmationModal**
   - Modal standard pour confirmation d'achat
   - Validation de solde intégrée

### Thème de Couleurs (Tailwind)

Le système utilise le thème "nature" du projet :
- `earth-*` pour common
- `sky-*` pour rare
- `lavender-*` pour epic
- `sunset-*` pour legendary

Si votre projet n'a pas ces couleurs, adaptez dans `universal-accessory-card.tsx` :

```typescript
function getRarityColor(rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-700'
    case 'rare': return 'bg-blue-100 text-blue-700'
    case 'epic': return 'bg-purple-100 text-purple-700'
    case 'legendary': return 'bg-yellow-100 text-yellow-700'
  }
}
```

---

## 🔍 Compatibilité

### Versions Supportées

- **Next.js** : 15.5.4+
- **React** : 19+
- **TypeScript** : 5+
- **Mongoose** : 8+
- **Node.js** : 18+

### Navigateurs

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## ⚠️ Points d'Attention

### 1. Authentification

Le système utilise `auth.api.getSession()`. Assurez-vous que votre système d'authentification est compatible.

```typescript
const session = await auth.api.getSession({ headers: await headers() })
if (!session) {
  // Non authentifié
}
```

### 2. Wallet Integration

Le système déduit des coins du wallet. Vérifiez que votre wallet service expose :

```typescript
export async function getOrCreateWallet(ownerId: string): Promise<Wallet>
export async function subtractCoins(params: {
  ownerId: string
  amount: number
}): Promise<Wallet>
```

### 3. Quest Integration

Si vous n'avez pas de système de quêtes, commentez ces lignes dans `accessory.actions.ts` :

```typescript
// Commentez si pas de système de quêtes
try {
  await trackQuestProgress(userId, 'buy_accessory', 1)
  await trackQuestProgress(userId, 'equip_accessory', 1)
} catch (questError) {
  console.warn('Quest tracking failed:', questError)
}
```

### 4. Cache Revalidation

Le système utilise `revalidatePath()` de Next.js. Vérifiez les chemins :

```typescript
revalidatePath('/creature')    // Page de votre créature
revalidatePath('/dashboard')   // Dashboard principal
revalidatePath('/wallet')      // Page wallet
revalidatePath('/monster')     // Liste des monstres
```

Adaptez selon vos routes.

---

## 🧪 Tests de Validation

Après intégration, tester :

### Tests Manuels

1. **Achat d'accessoire**
   - [ ] Achat avec solde suffisant
   - [ ] Erreur si solde insuffisant
   - [ ] Erreur si déjà possédé
   - [ ] Déduction correcte du wallet

2. **Équipement**
   - [ ] Équipement automatique lors de l'achat
   - [ ] Équipement manuel depuis inventaire
   - [ ] Déséquipement

3. **Affichage**
   - [ ] Carte affiche correctement l'accessoire
   - [ ] Badge de rareté correct
   - [ ] État "Possédé" correct

### Tests Automatisés

```bash
# Lancer les tests
npm test

# Tests spécifiques
npm test -- accessory.service.test.ts
npm test -- owned-accessory.service.test.ts
npm test -- accessory.actions.test.ts
```

---

## 📊 Monitoring

### Métriques à Surveiller

1. **Performance**
   - Temps de chargement du catalogue : < 100ms
   - Temps d'achat : < 500ms

2. **Base de Données**
   - Index utilisés correctement
   - Pas de full table scan

3. **Erreurs**
   - Taux d'erreur d'achat : < 1%
   - Erreurs de validation : loggées

### Logs Utiles

```typescript
// Activez les logs de debug dans development
if (process.env.NODE_ENV === 'development') {
  console.log('Purchasing:', { accessoryId, monsterId, userId })
}
```

---

## 🆘 Troubleshooting

### Problème : "Accessoire introuvable"

**Cause** : L'ID ne correspond à aucun accessoire du catalogue

**Solution** :
```typescript
const accessory = getAccessoryById('hat-party')
if (!accessory) {
  console.error('ID invalide')
}
```

### Problème : "Vous possédez déjà cet accessoire"

**Cause** : Tentative d'achat en double

**Solution** : Vérifier `isOwned` avant d'afficher le bouton d'achat

### Problème : "Solde insuffisant"

**Cause** : Pas assez de gochoCoins

**Solution** : Afficher le solde et le prix clairement dans l'UI

### Problème : Index MongoDB non créés

**Solution** :
```bash
# Créer manuellement les index
mongosh
use tamagocho_db
db.ownedaccessories.createIndex({ ownerId: 1, accessoryId: 1 })
```

---

## 📚 Ressources

### Documentation Complète

- `docs/ACCESSORIES_BACKGROUNDS_SYSTEM.md` - Spécification complète
- `documentation/docs/accessories/` - Documentation Docusaurus

### Support

- **Issues** : Créer une issue GitHub
- **Questions** : Consulter la FAQ dans la doc
- **Slack** : Canal #tomatgotchi-dev

---

## ✅ Checklist d'Intégration

Avant de considérer l'intégration terminée :

- [ ] Imports des services configurés
- [ ] Actions importées et utilisées
- [ ] Composants UI intégrés
- [ ] Types TypeScript importés
- [ ] Base de données configurée
- [ ] Index MongoDB créés
- [ ] Authentification compatible
- [ ] Wallet service intégré
- [ ] Système de quêtes compatible (ou désactivé)
- [ ] Routes revalidatePath adaptées
- [ ] Tests manuels passés
- [ ] Tests automatisés passés
- [ ] Monitoring en place
- [ ] Documentation lue et comprise

---

**Date de dernière mise à jour** : 2025-01-12
**Version du guide** : 1.0.0


---
sidebar_position: 3
---

# Guide d'Utilisation

Ce guide vous montre comment utiliser le système d'accessoires dans votre application.

## 🛒 Page de Boutique Complète

### Exemple Complet avec État

```tsx
'use client'

import { useState, useEffect } from 'react'
import { getAvailableAccessories } from '@/services/accessory.service'
import { 
  purchaseAccessory, 
  getUserAccessoryIds 
} from '@/actions/accessory.actions'
import { UniversalAccessoryCard } from '@/components/accessories'
import { PurchaseConfirmationModal } from '@/components/accessories'
import { toast } from 'sonner'

export default function AccessoryShopPage() {
  // État local
  const [accessories] = useState(getAvailableAccessories())
  const [ownedIds, setOwnedIds] = useState<string[]>([])
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const [userCoins, setUserCoins] = useState(0)
  const [monsterId, setMonsterId] = useState<string>('')

  // Chargement initial
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    // Charger les IDs possédés
    const ids = await getUserAccessoryIds()
    setOwnedIds(ids)
    
    // Charger le wallet et le monstre actif
    // ... votre logique
  }

  const handleSelectAccessory = (accessory: Accessory) => {
    // Vérifier si déjà possédé
    if (ownedIds.includes(accessory.id)) {
      toast.error('Vous possédez déjà cet accessoire')
      return
    }
    setSelectedAccessory(accessory)
  }

  const handleConfirmPurchase = async () => {
    if (!selectedAccessory || !monsterId) return

    const result = await purchaseAccessory(
      selectedAccessory.id,
      monsterId
    )

    if (result.success) {
      // Mise à jour de l'UI
      setUserCoins(result.remainingCoins ?? userCoins)
      setOwnedIds([...ownedIds, selectedAccessory.id])
      setSelectedAccessory(null)
      
      // Notification
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Boutique d'Accessoires</h1>
        <p className="text-lg text-gray-600">
          Personnalisez votre monstre avec {accessories.length} accessoires uniques
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <span className="text-xl font-semibold">{userCoins} gochoCoins</span>
        </div>
      </header>

      {/* Grille d'accessoires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {accessories.map((accessory) => (
          <UniversalAccessoryCard
            key={accessory.id}
            accessory={accessory}
            onPurchase={() => handleSelectAccessory(accessory)}
            isOwned={ownedIds.includes(accessory.id)}
          />
        ))}
      </div>

      {/* Modal de confirmation */}
      <PurchaseConfirmationModal
        accessory={selectedAccessory}
        isOpen={selectedAccessory !== null}
        onClose={() => setSelectedAccessory(null)}
        onConfirm={handleConfirmPurchase}
        userCoins={userCoins}
      />
    </div>
  )
}
```

---

## 🎨 Filtrage par Catégorie

### Onglets de Catégories

```tsx
'use client'

import { useState } from 'react'
import { 
  getAvailableAccessories,
  getAccessoriesByCategory 
} from '@/services/accessory.service'
import type { AccessoryCategory } from '@/types/accessory'

const CATEGORIES: Array<{ id: AccessoryCategory, label: string, icon: string }> = [
  { id: 'hat', label: 'Chapeaux', icon: '🎩' },
  { id: 'glasses', label: 'Lunettes', icon: '😎' },
  { id: 'shoes', label: 'Chaussures', icon: '👟' },
  { id: 'background', label: 'Arrière-plans', icon: '🌌' },
  { id: 'effect', label: 'Effets', icon: '✨' }
]

export function CategorizedShop() {
  const [activeCategory, setActiveCategory] = useState<AccessoryCategory>('hat')
  const accessories = getAccessoriesByCategory(activeCategory)

  return (
    <div>
      {/* Onglets */}
      <nav className="flex gap-4 mb-8 border-b">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 flex items-center gap-2 transition-all
              ${activeCategory === cat.id 
                ? 'border-b-4 border-meadow-500 text-meadow-700 font-bold' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="text-sm text-gray-500">({accessories.length})</span>
          </button>
        ))}
      </nav>

      {/* Contenu */}
      <div className="grid grid-cols-3 gap-6">
        {accessories.map((accessory) => (
          <UniversalAccessoryCard
            key={accessory.id}
            accessory={accessory}
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 💎 Filtrage par Rareté

### Sections par Rareté

```tsx
import { getAccessoriesByRarity } from '@/services/accessory.service'
import type { AccessoryRarity } from '@/types/accessory'

const RARITIES: Array<{
  id: AccessoryRarity
  label: string
  color: string
  bgColor: string
}> = [
  { 
    id: 'legendary', 
    label: 'Légendaire', 
    color: 'text-sunset-700', 
    bgColor: 'bg-sunset-50' 
  },
  { 
    id: 'epic', 
    label: 'Épique', 
    color: 'text-lavender-700', 
    bgColor: 'bg-lavender-50' 
  },
  { 
    id: 'rare', 
    label: 'Rare', 
    color: 'text-sky-700', 
    bgColor: 'bg-sky-50' 
  },
  { 
    id: 'common', 
    label: 'Commun', 
    color: 'text-earth-700', 
    bgColor: 'bg-earth-50' 
  }
]

export function RarityBasedShop() {
  return (
    <div className="space-y-12">
      {RARITIES.map((rarity) => {
        const accessories = getAccessoriesByRarity(rarity.id)
        
        return (
          <section key={rarity.id} className={`p-8 rounded-3xl ${rarity.bgColor}`}>
            <h2 className={`text-3xl font-bold mb-6 ${rarity.color}`}>
              {rarity.label} ({accessories.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {accessories.map((accessory) => (
                <UniversalAccessoryCard
                  key={accessory.id}
                  accessory={accessory}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

---

## 🎒 Inventaire Utilisateur

### Affichage des Accessoires Possédés

```tsx
import { getUserAccessories } from '@/actions/accessory.actions'
import { getAccessoryById } from '@/services/accessory.service'

export async function UserInventory() {
  const ownedAccessories = await getUserAccessories()

  // Enrichir avec les données du catalogue
  const enrichedAccessories = ownedAccessories
    .map((owned) => ({
      owned,
      accessory: getAccessoryById(owned.accessoryId)
    }))
    .filter(({ accessory }) => accessory !== null)

  // Grouper par catégorie
  const byCategory = enrichedAccessories.reduce((acc, item) => {
    const category = item.accessory.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof enrichedAccessories>)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Mon Inventaire</h1>
      
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {getCategoryLabel(category)} ({items.length})
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {items.map(({ owned, accessory }) => (
              <div key={owned._id} className="relative">
                <UniversalAccessoryCard
                  accessory={accessory}
                  isOwned={true}
                />
                {owned.isEquipped && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Équipé ✓
                  </div>
                )}
                <button
                  onClick={() => handleEquip(owned._id)}
                  className="mt-2 w-full btn-secondary"
                >
                  {owned.isEquipped ? 'Déséquiper' : 'Équiper'}
                </button>
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

## 🐾 Accessoires du Monstre

### Affichage sur la Page Créature

```tsx
import { getMonsterAccessories } from '@/actions/accessory.actions'
import { getAccessoryById } from '@/services/accessory.service'

export async function MonsterAccessoriesDisplay({ 
  monsterId 
}: { 
  monsterId: string 
}) {
  const ownedAccessories = await getMonsterAccessories(monsterId)
  
  const accessories = ownedAccessories
    .map((owned) => getAccessoryById(owned.accessoryId))
    .filter(Boolean)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>✨</span>
        <span>Accessoires Équipés</span>
      </h3>
      
      {accessories.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Aucun accessoire équipé
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className="flex items-center gap-2 bg-meadow-50 px-4 py-2 rounded-full"
            >
              <span className="text-2xl">{accessory.icon}</span>
              <span className="font-medium">{accessory.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 🔀 Recherche d'Accessoires

### Barre de Recherche avec Filtre

```tsx
'use client'

import { useState, useMemo } from 'react'
import { getAvailableAccessories } from '@/services/accessory.service'

export function SearchableShop() {
  const [searchQuery, setSearchQuery] = useState('')
  const allAccessories = getAvailableAccessories()

  // Filtrage en temps réel
  const filteredAccessories = useMemo(() => {
    if (!searchQuery) return allAccessories

    const query = searchQuery.toLowerCase()
    return allAccessories.filter((acc) =>
      acc.name.toLowerCase().includes(query) ||
      acc.description.toLowerCase().includes(query) ||
      acc.category.includes(query)
    )
  }, [searchQuery, allAccessories])

  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un accessoire..."
          className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-meadow-500 outline-none text-lg"
        />
        <p className="mt-2 text-sm text-gray-600">
          {filteredAccessories.length} résultat(s) trouvé(s)
        </p>
      </div>

      {/* Résultats */}
      <div className="grid grid-cols-4 gap-6">
        {filteredAccessories.map((accessory) => (
          <UniversalAccessoryCard
            key={accessory.id}
            accessory={accessory}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      {/* Aucun résultat */}
      {filteredAccessories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            Aucun accessoire trouvé pour "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  )
}
```

---

## 📊 Statistiques d'Accessoires

### Dashboard Personnel

```tsx
import { getUserAccessories } from '@/actions/accessory.actions'
import { getAccessoryById } from '@/services/accessory.service'

export async function AccessoryStats() {
  const ownedAccessories = await getUserAccessories()
  
  // Calculer les statistiques
  const stats = ownedAccessories.reduce((acc, owned) => {
    const accessory = getAccessoryById(owned.accessoryId)
    if (!accessory) return acc

    // Par catégorie
    acc.byCategory[accessory.category] = (acc.byCategory[accessory.category] || 0) + 1
    
    // Par rareté
    acc.byRarity[accessory.rarity] = (acc.byRarity[accessory.rarity] || 0) + 1
    
    // Équipés
    if (owned.isEquipped) {
      acc.equipped++
    }
    
    // Valeur totale
    acc.totalValue += accessory.price

    return acc
  }, {
    byCategory: {} as Record<string, number>,
    byRarity: {} as Record<string, number>,
    equipped: 0,
    totalValue: 0
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {/* Total possédé */}
      <StatCard
        icon="🎒"
        label="Total Possédé"
        value={ownedAccessories.length}
        color="bg-blue-50"
      />
      
      {/* Équipés */}
      <StatCard
        icon="✓"
        label="Équipés"
        value={stats.equipped}
        color="bg-green-50"
      />
      
      {/* Valeur totale */}
      <StatCard
        icon="🪙"
        label="Valeur Totale"
        value={`${stats.totalValue} coins`}
        color="bg-gold-50"
      />
      
      {/* Rareté dominante */}
      <StatCard
        icon="💎"
        label="Plus Rare"
        value={Object.keys(stats.byRarity).sort((a, b) => 
          stats.byRarity[b] - stats.byRarity[a]
        )[0] || 'Aucun'}
        color="bg-purple-50"
      />
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: string
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className={`${color} p-6 rounded-2xl`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  )
}
```

---

## 🎁 Boutique avec Recommandations

### Suggestions Intelligentes

```tsx
import { getAvailableAccessories, getAccessoriesByRarity } from '@/services/accessory.service'
import { getUserAccessoryIds } from '@/actions/accessory.actions'

export async function SmartShop({ userCoins }: { userCoins: number }) {
  const allAccessories = getAvailableAccessories()
  const ownedIds = await getUserAccessoryIds()

  // Filtrer ce qui n'est pas possédé
  const available = allAccessories.filter((acc) => 
    !ownedIds.includes(acc.id)
  )

  // Accessoires abordables
  const affordable = available.filter((acc) => 
    acc.price <= userCoins
  )

  // Recommandations (rare abordables)
  const recommended = affordable.filter((acc) => 
    acc.rarity === 'rare' || acc.rarity === 'epic'
  )

  // Nouveautés (derniers ajoutés)
  const newest = available.slice(-6)

  return (
    <div className="space-y-12">
      {/* Recommandations */}
      {recommended.length > 0 && (
        <Section title="🎯 Recommandé pour vous" accessories={recommended} />
      )}

      {/* Abordables */}
      {affordable.length > 0 && (
        <Section 
          title="💰 À votre portée" 
          subtitle={`Vous pouvez acheter ${affordable.length} accessoires`}
          accessories={affordable} 
        />
      )}

      {/* Nouveautés */}
      <Section title="✨ Nouveautés" accessories={newest} />
    </div>
  )
}

function Section({ 
  title, 
  subtitle, 
  accessories 
}: { 
  title: string
  subtitle?: string
  accessories: Accessory[] 
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-6 gap-4">
        {accessories.map((acc) => (
          <UniversalAccessoryCard key={acc.id} accessory={acc} />
        ))}
      </div>
    </section>
  )
}
```

---

## 🔔 Notifications d'Achat

### Toast Personnalisés

```tsx
import { toast } from 'sonner'

async function handlePurchase(accessoryId: string, monsterId: string) {
  const result = await purchaseAccessory(accessoryId, monsterId)

  if (result.success) {
    // Toast de succès avec détails
    toast.success(result.message, {
      description: `Il vous reste ${result.remainingCoins} gochoCoins`,
      icon: '🎉',
      action: {
        label: 'Voir mon monstre',
        onClick: () => router.push('/creature')
      }
    })
  } else {
    // Toast d'erreur
    toast.error(result.message, {
      icon: '❌'
    })
  }
}
```

---

## 💡 Bonnes Pratiques

### ✅ À Faire

- Toujours vérifier `isOwned` avant d'afficher le bouton d'achat
- Utiliser `getUserAccessoryIds()` pour optimiser les vérifications (moins de données)
- Revalider les données après chaque achat avec `revalidatePath()`
- Gérer les états de chargement pendant les achats
- Afficher le solde restant après achat

### ❌ À Éviter

- Ne pas appeler `getAvailableAccessories()` en boucle (mettre en cache)
- Ne pas faire d'achats côté client sans Server Action
- Ne pas oublier de vérifier l'authentification
- Ne pas ignorer les erreurs de transaction
- Ne pas faire de mutations directes en base de données depuis les composants

---

## 🎯 Checklist d'Intégration

Avant de déployer une nouvelle page d'accessoires :

- [ ] Import des services nécessaires
- [ ] Gestion de l'état local (useState)
- [ ] Chargement des données au montage (useEffect)
- [ ] Gestion des erreurs avec try/catch
- [ ] Notifications toast pour le feedback utilisateur
- [ ] Vérification du solde avant achat
- [ ] Revalidation du cache Next.js
- [ ] Accessibilité (ARIA labels, keyboard navigation)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states et spinners


/**
 * AccessoryShop Component
 *
 * Presentation Layer: Affichage de la boutique d'accessoires avec filtrage
 *
 * Responsabilités:
 * - Orchestrer l'affichage de la boutique d'accessoires
 * - Gérer le filtrage par catégorie
 * - Coordonner les achats via le hook usePurchaseAccessory
 *
 * Single Responsibility Principle: Orchestre uniquement l'UI de la boutique
 * Open/Closed Principle: Extensible via les composants enfants
 * Dependency Inversion: Dépend des hooks (abstractions) pour la logique métier
 *
 * @module components/creature/accessory-shop
 */

'use client'

import { useState } from 'react'
import type { Accessory, AccessoryCategory } from '@/types/accessory'
import { AccessoryCard } from './accessory-card'
import { CategoryFilter } from './category-filter'
import { FeedbackMessage } from './feedback-message'
import { usePurchaseAccessory } from '@/hooks/accessories'
import { useWallet } from '@/hooks/useWallet'

/**
 * Props pour le composant AccessoryShop
 */
interface AccessoryShopProps {
  /** Liste des accessoires disponibles à l'achat */
  accessories: Accessory[]
  /** ID du monstre pour l'association d'achat */
  monsterId: string
  /** Liste des IDs d'accessoires déjà possédés */
  ownedAccessoryIds?: string[]
  /** Callback appelé après un achat réussi */
  onPurchaseSuccess?: () => void
}

/**
 * Options de filtrage par catégorie
 */
const CATEGORIES: Array<{ value: AccessoryCategory | 'all', label: string, icon: string }> = [
  { value: 'all', label: 'Tout', icon: '🎯' },
  { value: 'hat', label: 'Chapeaux', icon: '🎩' },
  { value: 'glasses', label: 'Lunettes', icon: '👓' },
  { value: 'shoes', label: 'Chaussures', icon: '👟' },
  { value: 'background', label: 'Fonds', icon: '🖼️' },
  { value: 'effect', label: 'Effets', icon: '✨' }
]

/**
 * Composant de boutique d'accessoires
 *
 * Orchestre l'affichage de la boutique avec filtrage et achat d'accessoires.
 * Délègue la logique d'achat au hook usePurchaseAccessory et l'affichage
 * du filtre au composant CategoryFilter.
 *
 * @param {AccessoryShopProps} props - Props du composant
 * @returns {React.ReactNode} Interface complète de la boutique
 *
 * @example
 * <AccessoryShop
 *   accessories={availableAccessories}
 *   monsterId="monster-123"
 *   ownedAccessoryIds={ownedIds}
 *   onPurchaseSuccess={handleRefresh}
 * />
 */
export function AccessoryShop ({ accessories, monsterId, ownedAccessoryIds = [], onPurchaseSuccess }: AccessoryShopProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')

  // Hooks pour la gestion de l'état
  const { wallet, refresh: refreshWallet } = useWallet()
  const { purchasingId, message, handlePurchase } = usePurchaseAccessory()

  /**
   * Filtre les accessoires selon la catégorie sélectionnée
   */
  const filteredAccessories = selectedCategory === 'all'
    ? accessories
    : accessories.filter(acc => acc.category === selectedCategory)

  /**
   * Gère l'achat d'un accessoire
   *
   * @param {string} accessoryId - ID de l'accessoire à acheter
   */
  const handleAccessoryPurchase = async (accessoryId: string): Promise<void> => {
    const success = await handlePurchase(accessoryId, monsterId)

    if (success) {
      // Rafraîchir le wallet pour afficher le solde mis à jour
      await refreshWallet()
      // Notifier le parent pour rafraîchir les accessoires possédés
      if (onPurchaseSuccess !== undefined) {
        onPurchaseSuccess()
      }
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 border-2 border-lochinvar-200'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-3xl font-bold text-foreground mb-2 flex items-center gap-2'>
          🏪 Boutique d'Accessoires
        </h2>
        <p className='text-foreground/70'>
          Équipez votre monstre avec des accessoires uniques !
        </p>
      </div>

      {/* Message de feedback */}
      {message !== null && (
        <FeedbackMessage type={message.type} text={message.text} />
      )}

      {/* Filtre de catégories */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
      />

      {/* Grille d'accessoires */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredAccessories.map(accessory => (
          <AccessoryCard
            key={accessory.id}
            accessory={accessory}
            userCoins={wallet?.coin ?? 0}
            onPurchase={handleAccessoryPurchase}
            isPurchasing={purchasingId === accessory.id}
            isOwned={ownedAccessoryIds.includes(accessory.id)}
          />
        ))}
      </div>

      {/* État vide */}
      {filteredAccessories.length === 0 && (
        <div className='text-center py-12 text-foreground/50'>
          <p className='text-xl'>Aucun accessoire dans cette catégorie</p>
        </div>
      )}

      {/* Info Footer */}
      <div className='mt-6 p-4 bg-fuchsia-blue-50 rounded-lg border border-fuchsia-blue-200'>
        <p className='text-sm text-fuchsia-blue-800'>
          💡 <strong>Astuce :</strong> Les accessoires plus rares donnent de meilleurs bonus à votre monstre !
        </p>
      </div>
    </div>
  )
}


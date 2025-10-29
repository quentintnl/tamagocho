/**
 * AccessoryShop Component
 *
 * Presentation Layer: Displays the accessory shop with filtering options
 *
 * Responsibilities:
 * - Display all available accessories
 * - Allow filtering by category
 * - Handle accessory purchases
 * - Show purchase feedback
 *
 * Single Responsibility Principle: Orchestrates the shop UI
 */

'use client'

import { useState } from 'react'
import type { Accessory, AccessoryCategory } from '@/types/accessory'
import { AccessoryCard } from './accessory-card'
import { purchaseAccessory } from '@/actions/accessory.actions'
import { useWallet } from '@/hooks/useWallet'

/**
 * Props for AccessoryShop component
 */
interface AccessoryShopProps {
  /** List of available accessories */
  accessories: Accessory[]
  /** Monster ID for purchase association */
  monsterId: string
  /** List of owned accessory IDs */
  ownedAccessoryIds?: string[]
  /** Callback appelé après un achat réussi */
  onPurchaseSuccess?: () => void
}

/**
 * Category filter options
 */
const CATEGORIES: Array<{ value: AccessoryCategory | 'all', label: string, icon: string }> = [
  { value: 'all', label: 'Tout', icon: '🎯' },
  { value: 'hat', label: 'Chapeaux', icon: '🎩' },
  { value: 'glasses', label: 'Lunettes', icon: '👓' },
  { value: 'necklace', label: 'Colliers', icon: '📿' },
  { value: 'background', label: 'Fonds', icon: '🖼️' },
  { value: 'effect', label: 'Effets', icon: '✨' }
]

/**
 * AccessoryShop component
 */
export function AccessoryShop ({ accessories, monsterId, ownedAccessoryIds = [], onPurchaseSuccess }: AccessoryShopProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const { wallet, refresh: refreshWallet } = useWallet()

  // Filter accessories by category
  const filteredAccessories = selectedCategory === 'all'
    ? accessories
    : accessories.filter(acc => acc.category === selectedCategory)

  /**
   * Handle accessory purchase
   */
  const handlePurchase = async (accessoryId: string): Promise<void> => {
    setPurchasingId(accessoryId)
    setMessage(null)

    const result = await purchaseAccessory(accessoryId, monsterId)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      // Refresh wallet to show updated balance
      await refreshWallet()
      // Appeler le callback pour rafraîchir les accessoires possédés
      if (onPurchaseSuccess !== undefined) {
        onPurchaseSuccess()
      }
    } else {
      setMessage({ type: 'error', text: result.message })
    }

    setPurchasingId(null)

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
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
        <div
          className={`mb-4 p-4 rounded-lg border-2 ${
            message.type === 'success'
              ? 'bg-lochinvar-50 border-lochinvar-300 text-lochinvar-800'
              : 'bg-moccaccino-50 border-moccaccino-300 text-moccaccino-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Category Filters */}
      <div className='mb-6'>
        <div className='flex flex-wrap gap-2'>
          {CATEGORIES.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-moccaccino-500 text-white shadow-md scale-105'
                  : 'bg-lochinvar-100 text-lochinvar-700 hover:bg-lochinvar-200'
              }`}
            >
              <span className='mr-1'>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accessories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredAccessories.map(accessory => (
          <AccessoryCard
            key={accessory.id}
            accessory={accessory}
            userCoins={wallet?.coin ?? 0}
            onPurchase={handlePurchase}
            isPurchasing={purchasingId === accessory.id}
            isOwned={ownedAccessoryIds.includes(accessory.id)}
          />
        ))}
      </div>

      {/* Empty State */}
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


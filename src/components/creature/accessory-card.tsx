/**
 * AccessoryCard Component
 *
 * Presentation Layer: Displays a single accessory card with purchase option
 *
 * Responsibilities:
 * - Display accessory information (name, description, price, rarity)
 * - Handle purchase button click
 * - Show visual feedback during purchase
 *
 * Single Responsibility Principle: Only handles UI rendering of one accessory
 */

'use client'

import { useState } from 'react'
import type { Accessory } from '@/types/accessory'
import Button from '@/components/button'
import { generateAccessoryById, hasAccessorySVGSupport } from '@/services/accessories/accessory-generator'

/**
 * Props for AccessoryCard component
 */
interface AccessoryCardProps {
  /** Accessory data to display */
  accessory: Accessory
  /** Current user's coin balance */
  userCoins: number
  /** Callback when purchase button is clicked */
  onPurchase: (accessoryId: string) => Promise<void>
  /** Whether a purchase is in progress */
  isPurchasing: boolean
}

/**
 * Get color class based on rarity
 */
function getRarityColor (rarity: string): string {
  switch (rarity) {
    case 'common': return 'border-lochinvar-300 bg-lochinvar-50'
    case 'rare': return 'border-fuchsia-blue-300 bg-fuchsia-blue-50'
    case 'epic': return 'border-moccaccino-300 bg-moccaccino-50'
    case 'legendary': return 'border-yellow-400 bg-yellow-50'
    default: return 'border-gray-300 bg-gray-50'
  }
}

/**
 * Get rarity label in French
 */
function getRarityLabel (rarity: string): string {
  switch (rarity) {
    case 'common': return 'Commun'
    case 'rare': return 'Rare'
    case 'epic': return 'Épique'
    case 'legendary': return 'Légendaire'
    default: return rarity
  }
}

/**
 * AccessoryCard component
 */
export function AccessoryCard ({ accessory, userCoins, onPurchase, isPurchasing }: AccessoryCardProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false)
  const canAfford = userCoins >= accessory.price
  const rarityColor = getRarityColor(accessory.rarity)

  // Vérifier si l'accessoire a un support SVG
  const hasSVGSupport = hasAccessorySVGSupport(accessory.id)
  const svgContent = hasSVGSupport ? generateAccessoryById(accessory.id) : null

  const handlePurchase = async (): Promise<void> => {
    await onPurchase(accessory.id)
  }

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all duration-300 ${rarityColor} ${isHovered ? 'scale-105 shadow-lg' : 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon et Rareté */}
      <div className='flex justify-between items-start mb-3'>
        {hasSVGSupport && svgContent !== null ? (
          <div
            className='w-16 h-16'
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className='text-4xl'>{accessory.icon}</div>
        )}
        <span className='text-xs font-bold uppercase px-2 py-1 rounded bg-white/70'>
          {getRarityLabel(accessory.rarity)}
        </span>
      </div>

      {/* Nom */}
      <h3 className='text-xl font-bold mb-2 text-foreground'>{accessory.name}</h3>

      {/* Description */}
      <p className='text-sm text-foreground/70 mb-3'>{accessory.description}</p>

      {/* Effet */}
      {accessory.effect !== undefined && (
        <div className='mb-3 p-2 bg-white/50 rounded text-xs'>
          <span className='font-semibold'>✨ Effet:</span> {accessory.effect}
        </div>
      )}

      {/* Prix et Bouton */}
      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center gap-1'>
          <span className='text-2xl font-bold text-moccaccino-600'>{accessory.price}</span>
          <span className='text-sm text-moccaccino-500'>🪙</span>
        </div>

        <Button
          size='sm'
          variant={canAfford ? 'primary' : 'outline'}
          disabled={!canAfford || isPurchasing}
          onClick={handlePurchase}
        >
          {isPurchasing ? 'Achat...' : canAfford ? 'Acheter' : 'Trop cher'}
        </Button>
      </div>

      {/* Message si pas assez de coins */}
      {!canAfford && (
        <p className='text-xs text-moccaccino-600 mt-2 text-center'>
          Besoin de {accessory.price - userCoins} 🪙 de plus
        </p>
      )}
    </div>
  )
}


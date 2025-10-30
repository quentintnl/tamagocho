/**
 * Accessory Service
 *
 * Domain Layer: Business logic for accessory management
 *
 * Responsibilities:
 * - Provide list of available accessories
 * - Calculate accessory prices based on rarity
 * - Validate accessory purchases
 *
 * Clean Architecture: This service contains pure business logic
 */

import type { Accessory, AccessoryRarity } from '@/types/accessory'

/**
 * Get price multiplier based on rarity
 *
 * @param rarity - Accessory rarity level
 * @returns Price multiplier
 */
function getRarityMultiplier (rarity: AccessoryRarity): number {
  switch (rarity) {
    case 'common': return 1
    case 'rare': return 2
    case 'epic': return 4
    case 'legendary': return 8
  }
}

/**
 * Base price for accessories
 */
const BASE_PRICE = 50

/**
 * Available accessories in the shop
 * Single Responsibility: Provide catalog of accessories
 */
export function getAvailableAccessories (): Accessory[] {
  return [
    // Chapeaux
    {
      id: 'hat-party',
      name: 'Chapeau de Fête',
      description: 'Un chapeau festif pour célébrer !',
      category: 'hat',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '🎉'
    },
    {
      id: 'hat-crown',
      name: 'Couronne Royale',
      description: 'Pour un monstre digne d\'un roi',
      category: 'hat',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '👑'
    },
    {
      id: 'hat-wizard',
      name: 'Chapeau de Sorcier',
      description: 'Pouvoirs magiques inclus !',
      category: 'hat',
      rarity: 'legendary',
      price: BASE_PRICE * getRarityMultiplier('legendary'),
      icon: '🧙'
    },
    // Lunettes
    {
      id: 'glasses-cool',
      name: 'Lunettes de Soleil',
      description: 'Pour avoir du style',
      category: 'glasses',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '😎'
    },
    {
      id: 'glasses-nerd',
      name: 'Lunettes de Génie',
      description: 'Intelligence maximale',
      category: 'glasses',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '🤓'
    },
    // Chaussures
    {
      id: 'shoes-sneakers',
      name: 'Baskets Cool',
      description: 'Pour être à la mode',
      category: 'shoes',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '👟'
    },
    {
      id: 'shoes-boots',
      name: 'Bottes de Cuir',
      description: 'Style aventurier',
      category: 'shoes',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🥾'
    },
    // Arrière-plans
    {
      id: 'bg-stars',
      name: 'Fond Étoilé',
      description: 'Un ciel plein d\'étoiles',
      category: 'background',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '✨'
    },
    {
      id: 'bg-rainbow',
      name: 'Arc-en-ciel',
      description: 'Toutes les couleurs !',
      category: 'background',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🌈'
    },
    // Effets spéciaux
    {
      id: 'effect-sparkles',
      name: 'Paillettes Magiques',
      description: 'Brille de mille feux !',
      category: 'effect',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '✨'
    },
    {
      id: 'effect-fire',
      name: 'Aura de Feu',
      description: 'Une aura enflammée',
      category: 'effect',
      rarity: 'legendary',
      price: BASE_PRICE * getRarityMultiplier('legendary'),
      icon: '🔥'
    }
  ]
}

/**
 * Get accessory by ID
 *
 * @param id - Accessory identifier
 * @returns Accessory or null if not found
 */
export function getAccessoryById (id: string): Accessory | null {
  const accessories = getAvailableAccessories()
  return accessories.find(acc => acc.id === id) ?? null
}

/**
 * Get accessories by category
 *
 * @param category - Category filter
 * @returns Filtered accessories
 */
export function getAccessoriesByCategory (category: string): Accessory[] {
  const accessories = getAvailableAccessories()
  return accessories.filter(acc => acc.category === category)
}

/**
 * Get accessories by rarity
 *
 * @param rarity - Rarity filter
 * @returns Filtered accessories
 */
export function getAccessoriesByRarity (rarity: AccessoryRarity): Accessory[] {
  const accessories = getAvailableAccessories()
  return accessories.filter(acc => acc.rarity === rarity)
}


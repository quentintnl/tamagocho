/**
 * Type definitions for Accessory domain
 *
 * Domain Layer: Pure TypeScript types representing accessories for monsters
 * No dependencies on external libraries or frameworks
 */

/**
 * Categories of accessories available in the shop
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes' | 'background' | 'effect'

/**
 * Rarity levels for accessories (affects price)
 */
export type AccessoryRarity = 'common' | 'rare' | 'epic' | 'legendary'

/**
 * Accessory entity representing purchasable items
 */
export interface Accessory {
  id: string
  name: string
  description: string
  category: AccessoryCategory
  rarity: AccessoryRarity
  price: number
  icon: string
  effect?: string
}

/**
 * Purchased accessory owned by a user
 */
export interface OwnedAccessory {
  _id: string
  ownerId: string
  accessoryId: string
  monsterId?: string
  purchasedAt: Date | string
  isEquipped: boolean
}

/**
 * DTO for purchasing an accessory
 */
export interface PurchaseAccessoryDTO {
  accessoryId: string
  monsterId: string
}


/**
 * Universal Accessory Generator
 *
 * Domain Layer: Unified interface for generating any accessory type
 *
 * Responsibilities:
 * - Route accessory generation to appropriate generator
 * - Provide unified API for all accessory types
 *
 * Clean Architecture: Abstraction layer over specific generators
 */

import { generateHat, type HatType } from './hat-generator'
import { generateGlasses, type GlassesType } from './glasses-generator'
import { generateShoes, type ShoesType } from './shoes-generator'
import { generateEffect, type EffectType } from './effect-generator'
import { generateBackground, type BackgroundType } from './background-generator'
import type { AccessoryCategory } from '@/types/accessory'

/**
 * Mapping d'ID d'accessoire vers son type spécifique
 */
const ACCESSORY_TYPE_MAP: Record<string, { category: AccessoryCategory, type: string }> = {
  // Hats
  'hat-party': { category: 'hat', type: 'party' },
  'hat-crown': { category: 'hat', type: 'crown' },
  'hat-wizard': { category: 'hat', type: 'wizard' },

  // Glasses
  'glasses-cool': { category: 'glasses', type: 'sunglasses' },
  'glasses-nerd': { category: 'glasses', type: 'nerd' },

  // Shoes
  'shoes-sneakers': { category: 'shoes', type: 'sneakers' },
  'shoes-boots': { category: 'shoes', type: 'boots' },

  // Backgrounds
  'bg-stars': { category: 'background', type: 'stars' },
  'bg-rainbow': { category: 'background', type: 'rainbow' },

  // Effects
  'effect-sparkles': { category: 'effect', type: 'sparkles' },
  'effect-fire': { category: 'effect', type: 'fire' }
}

/**
 * Generate accessory SVG by ID
 *
 * @param accessoryId - Unique identifier of the accessory
 * @returns SVG string or null if not found
 */
export function generateAccessoryById (accessoryId: string): string | null {
  const mapping = ACCESSORY_TYPE_MAP[accessoryId]

  if (mapping === undefined) {
    return null
  }

  return generateAccessoryByCategory(mapping.category, mapping.type)
}

/**
 * Generate accessory SVG by category and type
 *
 * @param category - Category of accessory
 * @param type - Specific type within category
 * @returns SVG string
 */
export function generateAccessoryByCategory (category: AccessoryCategory, type: string): string {
  switch (category) {
    case 'hat':
      return generateHat(type as HatType)

    case 'glasses':
      return generateGlasses(type as GlassesType)

    case 'shoes':
      return generateShoes(type as ShoesType)

    case 'effect':
      return generateEffect(type as EffectType)

    case 'background':
      return generateBackground(type as BackgroundType)

    default:
      // Fallback: return a placeholder SVG
      return generatePlaceholderSVG(category)
  }
}

/**
 * Generate a placeholder SVG for unsupported accessories
 *
 * @param category - Category name for display
 * @returns Placeholder SVG string
 */
function generatePlaceholderSVG (category: string): string {
  return `
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: auto;"
    >
      <rect x="0" y="0" width="200" height="200" fill="#F0F0F0" />
      <text
        x="100"
        y="100"
        font-family="Arial, sans-serif"
        font-size="16"
        text-anchor="middle"
        fill="#999"
      >
        ${category}
      </text>
    </svg>
  `.trim()
}

/**
 * Check if an accessory has SVG support
 *
 * @param accessoryId - Accessory identifier
 * @returns True if SVG generation is available
 */
export function hasAccessorySVGSupport (accessoryId: string): boolean {
  return ACCESSORY_TYPE_MAP[accessoryId] !== undefined
}

/**
 * Get all supported accessory IDs
 *
 * @returns Array of accessory IDs with SVG support
 */
export function getSupportedAccessoryIds (): string[] {
  return Object.keys(ACCESSORY_TYPE_MAP)
}


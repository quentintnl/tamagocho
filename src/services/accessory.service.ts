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
    // Chapeaux (6 items - tous les niveaux de rareté)
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
      id: 'hat-baseball',
      name: 'Casquette de Base-ball',
      description: 'Style sportif décontracté',
      category: 'hat',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '🧢'
    },
    {
      id: 'hat-cowboy',
      name: 'Chapeau de Cowboy',
      description: 'Yeehaw ! Pour les aventuriers',
      category: 'hat',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '🤠'
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
      id: 'hat-top',
      name: 'Haut-de-forme',
      description: 'Élégance et distinction',
      category: 'hat',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🎩'
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

    // Lunettes (6 items - tous les niveaux de rareté)
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
      id: 'glasses-reading',
      name: 'Lunettes de Lecture',
      description: 'Pour les intellectuels',
      category: 'glasses',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '👓'
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
    {
      id: 'glasses-monocle',
      name: 'Monocle Raffiné',
      description: 'Sophistication à l\'extrême',
      category: 'glasses',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '🧐'
    },
    {
      id: 'glasses-cyber',
      name: 'Lunettes Cybernétiques',
      description: 'Vision augmentée du futur',
      category: 'glasses',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🕶️'
    },
    {
      id: 'glasses-laser',
      name: 'Lunettes Laser',
      description: 'Avec rayon laser intégré !',
      category: 'glasses',
      rarity: 'legendary',
      price: BASE_PRICE * getRarityMultiplier('legendary'),
      icon: '👁️'
    },

    // Chaussures (6 items - tous les niveaux de rareté)
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
      id: 'shoes-sandals',
      name: 'Sandales d\'Été',
      description: 'Confort et décontraction',
      category: 'shoes',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '🩴'
    },
    {
      id: 'shoes-heels',
      name: 'Talons Hauts',
      description: 'Élégance et glamour',
      category: 'shoes',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '👠'
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
    {
      id: 'shoes-rollers',
      name: 'Rollers Turbo',
      description: 'Vitesse maximale garantie',
      category: 'shoes',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🛼'
    },
    {
      id: 'shoes-rocket',
      name: 'Bottes Fusées',
      description: 'Pour voler dans les airs !',
      category: 'shoes',
      rarity: 'legendary',
      price: BASE_PRICE * getRarityMultiplier('legendary'),
      icon: '🚀'
    },

    // Arrière-plans (6 items - tous les niveaux de rareté)
    {
      id: 'bg-clouds',
      name: 'Nuages Paisibles',
      description: 'Un ciel doux et apaisant',
      category: 'background',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '☁️'
    },
    {
      id: 'bg-sunset',
      name: 'Coucher de Soleil',
      description: 'Un magnifique crépuscule',
      category: 'background',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '🌅'
    },
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
    {
      id: 'bg-galaxy',
      name: 'Galaxie Cosmique',
      description: 'L\'univers à portée de main',
      category: 'background',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🌌'
    },
    {
      id: 'bg-aurora',
      name: 'Aurore Boréale',
      description: 'Lumières magiques du nord',
      category: 'background',
      rarity: 'legendary',
      price: BASE_PRICE * getRarityMultiplier('legendary'),
      icon: '🌠'
    },

    // Effets spéciaux (6 items - tous les niveaux de rareté)
    {
      id: 'effect-hearts',
      name: 'Cœurs Flottants',
      description: 'Amour et tendresse',
      category: 'effect',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '💕'
    },
    {
      id: 'effect-bubbles',
      name: 'Bulles Magiques',
      description: 'Des bulles qui ne se cassent jamais',
      category: 'effect',
      rarity: 'common',
      price: BASE_PRICE * getRarityMultiplier('common'),
      icon: '🫧'
    },
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
      id: 'effect-lightning',
      name: 'Éclairs Électriques',
      description: 'Pouvoir de la foudre',
      category: 'effect',
      rarity: 'rare',
      price: BASE_PRICE * getRarityMultiplier('rare'),
      icon: '⚡'
    },
    {
      id: 'effect-fire',
      name: 'Aura de Feu',
      description: 'Une aura enflammée',
      category: 'effect',
      rarity: 'epic',
      price: BASE_PRICE * getRarityMultiplier('epic'),
      icon: '🔥'
    },
    {
      id: 'effect-divine',
      name: 'Aura Divine',
      description: 'Le pouvoir des dieux !',
      category: 'effect',
      rarity: 'legendary',
      price: BASE_PRICE * getRarityMultiplier('legendary'),
      icon: '✨'
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


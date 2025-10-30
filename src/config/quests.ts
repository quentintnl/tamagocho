/**
 * Quest Templates Configuration
 *
 * Domain Layer: Quest templates defining available daily quests
 *
 * Responsibilities:
 * - Define all possible quest types
 * - Set difficulty-based rewards
 * - Provide quest descriptions and requirements
 *
 * Clean Architecture: Pure configuration data with no dependencies
 */

import type { QuestTemplate } from '@/types/quest'
import { getCoinReward, getXpReward } from './quests.config'

/**
 * All available quest templates
 * Each quest can be generated with different difficulties
 * Rewards are calculated automatically from quests.config.ts
 */
export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Feed Monster Quests
  {
    type: 'feed_monster',
    difficulty: 'easy',
    title: 'Petit déjeuner',
    description: 'Nourrir votre monstre 3 fois',
    targetCount: 3,
    coinReward: getCoinReward('easy'),
    xpReward: getXpReward('easy')
  },
  {
    type: 'feed_monster',
    difficulty: 'medium',
    title: 'Chef cuisinier',
    description: 'Nourrir votre monstre 5 fois',
    targetCount: 5,
    coinReward: getCoinReward('medium'),
    xpReward: getXpReward('medium')
  },
  {
    type: 'feed_monster',
    difficulty: 'hard',
    title: 'Festin royal',
    description: 'Nourrir votre monstre 10 fois',
    targetCount: 10,
    coinReward: getCoinReward('hard'),
    xpReward: getXpReward('hard')
  },

  // Play with Monster Quests
  {
    type: 'play_with_monster',
    difficulty: 'easy',
    title: 'Temps de jeu',
    description: 'Jouer avec votre monstre 3 fois',
    targetCount: 3,
    coinReward: getCoinReward('easy'),
    xpReward: getXpReward('easy')
  },
  {
    type: 'play_with_monster',
    difficulty: 'medium',
    title: 'Compagnon de jeu',
    description: 'Jouer avec votre monstre 5 fois',
    targetCount: 5,
    coinReward: getCoinReward('medium'),
    xpReward: getXpReward('medium')
  },
  {
    type: 'play_with_monster',
    difficulty: 'hard',
    title: 'Marathonien ludique',
    description: 'Jouer avec votre monstre 10 fois',
    targetCount: 10,
    coinReward: getCoinReward('hard'),
    xpReward: getXpReward('hard')
  },

  // Level Up Quests
  {
    type: 'level_up_monster',
    difficulty: 'easy',
    title: 'Première évolution',
    description: 'Faire monter votre monstre de 1 niveau',
    targetCount: 1,
    coinReward: getCoinReward('easy'),
    xpReward: getXpReward('easy')
  },

  // Buy Accessory Quests
  {
    type: 'buy_accessory',
    difficulty: 'easy',
    title: 'Shopping débutant',
    description: 'Acheter 1 accessoire',
    targetCount: 1,
    coinReward: getCoinReward('easy'),
    xpReward: getXpReward('easy')
  },
  {
    type: 'buy_accessory',
    difficulty: 'medium',
    title: 'Collectionneur',
    description: 'Acheter 3 accessoires',
    targetCount: 3,
    coinReward: getCoinReward('medium'),
    xpReward: getXpReward('medium')
  },

  // Equip Accessory Quests
  {
    type: 'equip_accessory',
    difficulty: 'easy',
    title: 'Fashionista',
    description: 'Équiper 1 accessoire sur votre monstre',
    targetCount: 1,
    coinReward: getCoinReward('easy'),
    xpReward: getXpReward('easy')
  },
  {
    type: 'equip_accessory',
    difficulty: 'medium',
    title: 'Styliste expert',
    description: 'Équiper 3 accessoires',
    targetCount: 3,
    coinReward: getCoinReward('medium'),
    xpReward: getXpReward('medium')
  },

  // Visit Gallery Quests
  {
    type: 'visit_gallery',
    difficulty: 'easy',
    title: 'Explorateur',
    description: 'Visiter la galerie des monstres',
    targetCount: 1,
    coinReward: getCoinReward('easy'),
    xpReward: getXpReward('easy')
  },

  // Earn Coins Quests
  {
    type: 'earn_coins',
    difficulty: 'medium',
    title: 'Collecteur de Koins',
    description: 'Gagner 100 Koins',
    targetCount: 100,
    coinReward: getCoinReward('medium'),
    xpReward: getXpReward('medium')
  },
  {
    type: 'earn_coins',
    difficulty: 'hard',
    title: 'Trésorier',
    description: 'Gagner 250 Koins',
    targetCount: 250,
    coinReward: getCoinReward('hard'),
    xpReward: getXpReward('hard')
  }
]

/**
 * Get random quest templates for daily quest generation
 * Ensures variety by avoiding duplicates
 *
 * @param count - Number of quests to generate (default: from config)
 * @returns Array of random quest templates
 */
export function getRandomQuestTemplates (count: number = 5): QuestTemplate[] {
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, QUEST_TEMPLATES.length))
}

/**
 * Get quest template by type and difficulty
 *
 * @param type - Quest type
 * @param difficulty - Quest difficulty
 * @returns Quest template or undefined
 */
export function getQuestTemplate (type: string, difficulty: string): QuestTemplate | undefined {
  return QUEST_TEMPLATES.find(q => q.type === type && q.difficulty === difficulty)
}


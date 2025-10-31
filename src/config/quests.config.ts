/**
 * Quest System Configuration
 *
 * Domain Layer: Centralized configuration for quest system
 *
 * Responsibilities:
 * - Define quest generation rules
 * - Configure reward multipliers
 * - Set difficulty thresholds
 * - Manage quest refresh timing
 *
 * Clean Architecture: Pure configuration with no dependencies
 * Single Responsibility: All quest system settings in one place
 */

import type { QuestDifficulty } from '@/types/quest'

/**
 * ================================
 * QUEST GENERATION CONFIGURATION
 * ================================
 */

/**
 * Number of quests generated per day
 * Can be adjusted for events or special occasions
 */
export const QUESTS_PER_DAY = 5

/**
 * Quest refresh configuration
 */
export const QUEST_REFRESH_CONFIG = {
  /** Hour of the day when quests reset (0-23, in local time) */
  resetHour: 0,
  /** Minute of the hour when quests reset (0-59) */
  resetMinute: 0,
  /** Enable automatic expiration of old quests */
  autoExpire: true
} as const

/**
 * ================================
 * REWARD CONFIGURATION
 * ================================
 */

/**
 * Base rewards (before difficulty multiplier)
 */
export const BASE_REWARDS = {
  /** Base coin reward for quest completion */
  coins: 50,
  /** Base XP reward for quest completion */
  xp: 10
} as const

/**
 * Difficulty multipliers applied to base rewards
 * Higher difficulty = higher rewards
 */
export const DIFFICULTY_MULTIPLIERS: Record<QuestDifficulty, number> = {
  easy: 1, // 100% of base rewards
  medium: 1.5, // 150% of base rewards
  hard: 2 // 200% of base rewards
} as const

/**
 * Bonus rewards for streak completion
 * Applied when completing all daily quests X days in a row
 */
export const STREAK_BONUS = {
  /** Enable streak bonus system */
  enabled: false, // TODO: Implement streak tracking
  /** Bonus coins per streak day */
  coinsPerDay: 10,
  /** Bonus XP per streak day */
  xpPerDay: 5,
  /** Maximum streak bonus */
  maxStreakDays: 7
} as const

/**
 * ================================
 * QUEST DIFFICULTY CONFIGURATION
 * ================================
 */

/**
 * Target count ranges for each difficulty
 * Used when generating random quest targets
 */
export const DIFFICULTY_TARGET_RANGES = {
  easy: { min: 1, max: 3 },
  medium: { min: 3, max: 7 },
  hard: { min: 7, max: 15 }
} as const

/**
 * Distribution probability for difficulties
 * Higher weight = more likely to appear
 */
export const DIFFICULTY_WEIGHTS = {
  easy: 0.4, // 40% chance
  medium: 0.4, // 40% chance
  hard: 0.2 // 20% chance
} as const

/**
 * ================================
 * QUEST TYPE CONFIGURATION
 * ================================
 */

/**
 * Quest type settings
 * Enable/disable specific quest types
 */
export const QUEST_TYPE_CONFIG = {
  feed_monster: {
    enabled: true,
    weight: 1.0,
    /** Track via 'feed' action */
    trackingAction: 'feed'
  },
  play_with_monster: {
    enabled: true,
    weight: 1.0,
    /** Track via 'hug', 'wake', 'comfort' actions */
    trackingActions: ['hug', 'wake', 'comfort']
  },
  level_up_monster: {
    enabled: true,
    weight: 0.5, // Less common
    /** Requires manual tracking or level change detection */
    requiresManualTracking: true
  },
  buy_accessory: {
    enabled: true,
    weight: 0.8,
    /** Track via purchase action */
    trackingAction: 'buy_accessory'
  },
  equip_accessory: {
    enabled: true,
    weight: 0.8,
    /** Track via equip action */
    trackingAction: 'equip_accessory'
  },
  visit_gallery: {
    enabled: true,
    weight: 0.6,
    /** Track via page visit */
    trackingAction: 'visit_gallery'
  },
  earn_coins: {
    enabled: true,
    weight: 0.7,
    /** Track via wallet changes */
    trackingAction: 'earn_coins'
  }
} as const

/**
 * ================================
 * PROGRESSION CONFIGURATION
 * ================================
 */

/**
 * Progress tracking settings
 */
export const PROGRESS_CONFIG = {
  /** Enable real-time progress updates */
  realTimeTracking: true,
  /** Auto-complete quests when target is reached */
  autoComplete: true,
  /** Allow claiming rewards before midnight */
  allowEarlyClaim: true,
  /** Save progress to database immediately */
  instantPersistence: true
} as const

/**
 * ================================
 * UI CONFIGURATION
 * ================================
 */

/**
 * Display settings for quest UI
 */
export const UI_CONFIG = {
  /** Show progress percentage */
  showPercentage: true,
  /** Show time until reset */
  showTimeRemaining: true,
  /** Enable animations for progress updates */
  enableAnimations: true,
  /** Compact mode for dashboard widget */
  compactMode: {
    maxQuestsShown: 3,
    hideDescription: true,
    showOnlyActive: true
  }
} as const

/**
 * ================================
 * FEATURE FLAGS
 * ================================
 */

/**
 * Feature toggles for quest system
 * Use these to enable/disable features in production
 */
export const QUEST_FEATURES = {
  /** Enable daily quest system */
  dailyQuests: true,
  /** Enable weekly quests (future feature) */
  weeklyQuests: false,
  /** Enable achievements (future feature) */
  achievements: false,
  /** Enable quest notifications */
  notifications: true,
  /** Enable quest history/statistics */
  questHistory: false,
  /** Enable leaderboard */
  leaderboard: false
} as const

/**
 * ================================
 * HELPER FUNCTIONS
 * ================================
 */

/**
 * Calculate reward amount based on difficulty
 *
 * @param baseAmount - Base reward amount
 * @param difficulty - Quest difficulty
 * @returns Calculated reward with multiplier applied
 */
export function calculateReward (baseAmount: number, difficulty: QuestDifficulty): number {
  return Math.floor(baseAmount * DIFFICULTY_MULTIPLIERS[difficulty])
}

/**
 * Get coin reward for a quest difficulty
 *
 * @param difficulty - Quest difficulty
 * @returns Coin reward amount
 */
export function getCoinReward (difficulty: QuestDifficulty): number {
  return calculateReward(BASE_REWARDS.coins, difficulty)
}

/**
 * Get XP reward for a quest difficulty
 *
 * @param difficulty - Quest difficulty
 * @returns XP reward amount
 */
export function getXpReward (difficulty: QuestDifficulty): number {
  return calculateReward(BASE_REWARDS.xp, difficulty)
}

/**
 * Check if a quest type is enabled
 *
 * @param questType - Type of quest to check
 * @returns True if quest type is enabled
 */
export function isQuestTypeEnabled (questType: string): boolean {
  return QUEST_TYPE_CONFIG[questType as keyof typeof QUEST_TYPE_CONFIG]?.enabled ?? false
}

/**
 * Get weighted random difficulty
 * Uses configured weights to determine difficulty distribution
 *
 * @returns Random difficulty based on weights
 */
export function getRandomDifficulty (): QuestDifficulty {
  const rand = Math.random()
  let cumulative = 0

  for (const [difficulty, weight] of Object.entries(DIFFICULTY_WEIGHTS)) {
    cumulative += weight
    if (rand <= cumulative) {
      return difficulty as QuestDifficulty
    }
  }

  return 'easy' // Fallback
}

/**
 * Get next quest reset time
 *
 * @returns Date object representing next reset time
 */
export function getNextResetTime (): Date {
  const now = new Date()
  const resetTime = new Date()

  resetTime.setHours(QUEST_REFRESH_CONFIG.resetHour, QUEST_REFRESH_CONFIG.resetMinute, 0, 0)

  // If reset time has passed today, set to tomorrow
  if (resetTime <= now) {
    resetTime.setDate(resetTime.getDate() + 1)
  }

  return resetTime
}

/**
 * Get time remaining until reset in milliseconds
 *
 * @returns Milliseconds until next quest reset
 */
export function getTimeUntilReset (): number {
  return getNextResetTime().getTime() - Date.now()
}

/**
 * Format time remaining until reset
 *
 * @returns Human-readable time string (e.g., "5h 30m")
 */
export function formatTimeUntilReset (): string {
  const ms = getTimeUntilReset()
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * ================================
 * EXPORTS
 * ================================
 */

/**
 * Complete quest configuration object
 * Export for external use or documentation
 */
export const QUEST_CONFIG = {
  generation: {
    questsPerDay: QUESTS_PER_DAY,
    refresh: QUEST_REFRESH_CONFIG
  },
  rewards: {
    base: BASE_REWARDS,
    multipliers: DIFFICULTY_MULTIPLIERS,
    streak: STREAK_BONUS
  },
  difficulty: {
    targetRanges: DIFFICULTY_TARGET_RANGES,
    weights: DIFFICULTY_WEIGHTS
  },
  questTypes: QUEST_TYPE_CONFIG,
  progression: PROGRESS_CONFIG,
  ui: UI_CONFIG,
  features: QUEST_FEATURES
} as const

export type QuestConfig = typeof QUEST_CONFIG

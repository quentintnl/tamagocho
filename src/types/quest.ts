/**
 * Type definitions for Daily Quests system
 *
 * Domain Layer: Pure TypeScript types representing the Quest entities
 * No dependencies on external libraries or frameworks
 */

/**
 * Quest types available in the game
 */
export const QUEST_TYPES = [
  'feed_monster',
  'play_with_monster',
  'level_up_monster',
  'buy_accessory',
  'equip_accessory',
  'visit_gallery',
  'earn_coins'
] as const

export type QuestType = typeof QUEST_TYPES[number]

/**
 * Quest difficulty levels affecting rewards
 */
export const QUEST_DIFFICULTIES = ['easy', 'medium', 'hard'] as const

export type QuestDifficulty = typeof QUEST_DIFFICULTIES[number]

/**
 * Quest status
 */
export const QUEST_STATUSES = ['active', 'completed', 'claimed', 'expired'] as const

export type QuestStatus = typeof QUEST_STATUSES[number]

/**
 * Quest template defining the quest type and requirements
 */
export interface QuestTemplate {
  type: QuestType
  difficulty: QuestDifficulty
  title: string
  description: string
  targetCount: number
  coinReward: number
  xpReward?: number
}

/**
 * Daily Quest entity
 */
export interface DailyQuest {
  _id: string
  ownerId: string
  type: QuestType
  difficulty: QuestDifficulty
  title: string
  description: string
  targetCount: number
  currentProgress: number
  coinReward: number
  xpReward?: number
  status: QuestStatus
  expiresAt: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * Mongoose document type for Quest
 */
export interface QuestDocument {
  _id: unknown
  ownerId: string
  type: QuestType
  difficulty: QuestDifficulty
  title: string
  description: string
  targetCount: number
  currentProgress: number
  coinReward: number
  xpReward?: number
  status: QuestStatus
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  toObject: () => {
    _id: unknown
    ownerId: string
    type: QuestType
    difficulty: QuestDifficulty
    title: string
    description: string
    targetCount: number
    currentProgress: number
    coinReward: number
    xpReward?: number
    status: QuestStatus
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
  }
}

/**
 * DTO for creating daily quests
 */
export interface CreateDailyQuestDTO {
  ownerId: string
  type: QuestType
  difficulty: QuestDifficulty
  title: string
  description: string
  targetCount: number
  coinReward: number
  xpReward?: number
  expiresAt: Date
}

/**
 * DTO for updating quest progress
 */
export interface UpdateQuestProgressDTO {
  questId: string
  ownerId: string
  incrementBy?: number
}

/**
 * DTO for completing a quest
 */
export interface CompleteQuestDTO {
  questId: string
  ownerId: string
}


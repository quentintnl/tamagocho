/**
 * Daily Quest Service
 *
 * Domain Layer: Business logic for daily quest management
 *
 * Responsibilities:
 * - Generate 3 unique daily quests per user
 * - Track quest progress
 * - Complete quests and award rewards
 * - Auto-expire quests at midnight
 * - Prevent duplicate quest generation
 *
 * Clean Architecture: Pure business logic with database abstraction
 * Single Responsibility: Each function handles one aspect of quest management
 */

import DailyQuest from '@/db/models/daily-quest.model'
import type {
  DailyQuest as DailyQuestType,
  CreateDailyQuestDTO,
  UpdateQuestProgressDTO,
  CompleteQuestDTO,
  QuestDocument
} from '@/types/quest'
import { connectMongooseToDatabase } from '@/db'
import { getRandomQuestTemplates } from '@/config/quests'
import { addCoins } from './wallet.service'

const QUESTS_PER_DAY = 5

/**
 * Serializes a Mongoose quest document to a plain object
 * Converts ObjectId and Dates to appropriate types
 *
 * @param doc - Mongoose quest document
 * @returns Plain quest object
 */
function serializeQuest (doc: QuestDocument): DailyQuestType {
  const obj = doc.toObject()
  return {
    _id: String(obj._id),
    ownerId: obj.ownerId,
    type: obj.type,
    difficulty: obj.difficulty,
    title: obj.title,
    description: obj.description,
    targetCount: obj.targetCount,
    currentProgress: obj.currentProgress,
    coinReward: obj.coinReward,
    xpReward: obj.xpReward,
    status: obj.status,
    expiresAt: obj.expiresAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  }
}

/**
 * Gets the next midnight timestamp (local time)
 * Quests expire at midnight to reset daily
 *
 * @returns Date object set to next midnight
 */
function getNextMidnight (): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

/**
 * Generates 5 unique daily quests for a user
 * Single Responsibility: Create new daily quest set
 *
 * @param ownerId - User ID
 * @returns Array of 5 new daily quests
 */
export async function generateDailyQuests (ownerId: string): Promise<DailyQuestType[]> {
  await connectMongooseToDatabase()

  // Get 5 random quest templates
  const templates = getRandomQuestTemplates(QUESTS_PER_DAY)
  const expiresAt = getNextMidnight()

  // Create quests from templates
  const questsData: CreateDailyQuestDTO[] = templates.map(template => ({
    ownerId,
    type: template.type,
    difficulty: template.difficulty,
    title: template.title,
    description: template.description,
    targetCount: template.targetCount,
    coinReward: template.coinReward,
    xpReward: template.xpReward,
    expiresAt
  }))

  const createdQuests = await DailyQuest.insertMany(questsData)
  return createdQuests.map(serializeQuest)
}

/**
 * Gets active daily quests for a user
 * Automatically generates new quests if none exist or all are expired
 * Single Responsibility: Retrieve active quests
 *
 * @param ownerId - User ID
 * @returns Array of active daily quests
 */
export async function getDailyQuests (ownerId: string): Promise<DailyQuestType[]> {
  await connectMongooseToDatabase()

  const now = new Date()

  // Find active quests that haven't expired
  let quests = await DailyQuest.find({
    ownerId,
    status: { $in: ['active', 'completed', 'claimed'] },
    expiresAt: { $gt: now }
  }).sort({ createdAt: 1 })

  // If no active quests or less than required, generate new ones
  if (quests.length === 0) {
    // Mark any old quests as expired
    await DailyQuest.updateMany(
      {
        ownerId,
        status: 'active',
        expiresAt: { $lte: now }
      },
      {
        $set: { status: 'expired' }
      }
    )

    // Generate new daily quests
    return await generateDailyQuests(ownerId)
  }

  return quests.map(serializeQuest)
}

/**
 * Updates progress on a specific quest
 * Single Responsibility: Track quest advancement
 *
 * @param data - Quest progress update data
 * @returns Updated quest or null if not found/invalid
 */
export async function updateQuestProgress (data: UpdateQuestProgressDTO): Promise<DailyQuestType | null> {
  await connectMongooseToDatabase()

  const { questId, ownerId, incrementBy = 1 } = data

  const quest = await DailyQuest.findOne({
    _id: questId,
    ownerId,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })

  if (quest == null) {
    return null
  }

  // Update progress
  quest.currentProgress = Math.min(
    quest.currentProgress + incrementBy,
    quest.targetCount
  )

  // Auto-complete if target reached
  if (quest.currentProgress >= quest.targetCount) {
    quest.status = 'completed'
  }

  await quest.save()
  return serializeQuest(quest)
}

/**
 * Completes a quest and awards rewards to the user
 * Single Responsibility: Handle quest completion and reward distribution
 *
 * @param data - Quest completion data
 * @returns Completed quest with rewards
 * @throws Error if quest not found, already completed, or not at target
 */
export async function completeQuest (data: CompleteQuestDTO): Promise<DailyQuestType> {
  await connectMongooseToDatabase()

  const { questId, ownerId } = data

  const quest = await DailyQuest.findOne({
    _id: questId,
    ownerId,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })

  if (quest == null) {
    throw new Error('Quest not found or already completed')
  }

  if (quest.currentProgress < quest.targetCount) {
    throw new Error('Quest target not reached yet')
  }

  // Mark as completed
  quest.status = 'completed'
  await quest.save()

  // Award coin rewards
  if (quest.coinReward > 0) {
    await addCoins({ ownerId, amount: quest.coinReward })
  }

  // TODO: Award XP rewards when XP system is integrated
  // if (quest.xpReward > 0) {
  //   await addXP({ ownerId, amount: quest.xpReward })
  // }

  return serializeQuest(quest)
}

/**
 * Increments progress for all quests of a specific type for a user
 * Useful for automatic quest tracking
 * Single Responsibility: Batch update quest progress by type
 *
 * @param ownerId - User ID
 * @param questType - Type of quest to update
 * @param incrementBy - Amount to increment (default: 1)
 * @returns Updated quests
 */
export async function trackQuestProgress (
  ownerId: string,
  questType: string,
  incrementBy: number = 1
): Promise<DailyQuestType[]> {
  await connectMongooseToDatabase()

  const quests = await DailyQuest.find({
    ownerId,
    type: questType,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })

  const updatedQuests: DailyQuestType[] = []

  for (const quest of quests) {
    quest.currentProgress = Math.min(
      quest.currentProgress + incrementBy,
      quest.targetCount
    )

    // Auto-complete if target reached
    if (quest.currentProgress >= quest.targetCount) {
      quest.status = 'completed'
    }

    await quest.save()
    updatedQuests.push(serializeQuest(quest))
  }

  return updatedQuests
}

/**
 * Claims rewards for a completed quest
 * Single Responsibility: Award quest rewards
 *
 * @param questId - Quest ID
 * @param ownerId - User ID
 * @returns Updated quest
 * @throws Error if quest not completed or rewards already claimed
 */
export async function claimQuestReward (questId: string, ownerId: string): Promise<DailyQuestType> {
  await connectMongooseToDatabase()

  const quest = await DailyQuest.findOne({
    _id: questId,
    ownerId,
    status: 'completed'
  })

  if (quest == null) {
    throw new Error('Quest not found or not completed')
  }

  // Award rewards
  if (quest.coinReward > 0) {
    await addCoins({ ownerId, amount: quest.coinReward })
  }

  // Mark quest as claimed to prevent duplicate claims
  quest.status = 'claimed'
  await quest.save()

  return serializeQuest(quest)
}

/**
 * Expires old quests (cleanup utility)
 * Can be run as a cron job or on-demand
 * Single Responsibility: Clean up expired quests
 *
 * @returns Number of quests expired
 */
export async function expireOldQuests (): Promise<number> {
  await connectMongooseToDatabase()

  const result = await DailyQuest.updateMany(
    {
      status: 'active',
      expiresAt: { $lte: new Date() }
    },
    {
      $set: { status: 'expired' }
    }
  )

  return result.modifiedCount
}


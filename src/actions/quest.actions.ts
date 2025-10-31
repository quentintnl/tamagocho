/**
 * Daily Quest Actions
 *
 * Application Layer: Server Actions for quest operations
 *
 * Responsibilities:
 * - Expose quest operations to Client Components
 * - Handle authentication and authorization
 * - Return user-friendly responses
 *
 * Clean Architecture: Application layer coordinating between UI and Domain
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  getDailyQuests,
  updateQuestProgress,
  completeQuest,
  trackQuestProgress,
  claimQuestReward
} from '@/services/daily-quest.service'
import type { DailyQuest } from '@/types/quest'

/**
 * Gets the current user's daily quests
 * Generates new quests if none exist
 *
 * @returns Array of daily quests or error
 */
export async function getUserDailyQuests (): Promise<{
  success: boolean
  quests?: DailyQuest[]
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'Non autorisé. Veuillez vous connecter.'
      }
    }

    const quests = await getDailyQuests(session.user.id)

    return {
      success: true,
      quests
    }
  } catch (error) {
    console.error('Error getting daily quests:', error)
    return {
      success: false,
      error: 'Erreur lors de la récupération des quêtes'
    }
  }
}

/**
 * Updates progress on a specific quest
 *
 * @param questId - Quest ID
 * @param incrementBy - Amount to increment progress (default: 1)
 * @returns Updated quest or error
 */
export async function updateQuestProgressAction (
  questId: string,
  incrementBy: number = 1
): Promise<{
  success: boolean
  quest?: DailyQuest
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'Non autorisé'
      }
    }

    const quest = await updateQuestProgress({
      questId,
      ownerId: session.user.id,
      incrementBy
    })

    if (quest == null) {
      return {
        success: false,
        error: 'Quête non trouvée ou expirée'
      }
    }

    return {
      success: true,
      quest
    }
  } catch (error) {
    console.error('Error updating quest progress:', error)
    return {
      success: false,
      error: 'Erreur lors de la mise à jour de la progression'
    }
  }
}

/**
 * Completes a quest and awards rewards
 *
 * @param questId - Quest ID
 * @returns Completed quest or error
 */
export async function completeQuestAction (questId: string): Promise<{
  success: boolean
  quest?: DailyQuest
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'Non autorisé'
      }
    }

    const quest = await completeQuest({
      questId,
      ownerId: session.user.id
    })

    return {
      success: true,
      quest
    }
  } catch (error) {
    console.error('Error completing quest:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la complétion de la quête'
    }
  }
}

/**
 * Tracks quest progress by type
 * Automatically updates all matching active quests
 *
 * @param questType - Type of quest to track
 * @param incrementBy - Amount to increment (default: 1)
 * @returns Updated quests or error
 */
export async function trackQuestProgressAction (
  questType: string,
  incrementBy: number = 1
): Promise<{
  success: boolean
  quests?: DailyQuest[]
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'Non autorisé'
      }
    }

    const quests = await trackQuestProgress(session.user.id, questType, incrementBy)

    return {
      success: true,
      quests
    }
  } catch (error) {
    console.error('Error tracking quest progress:', error)
    return {
      success: false,
      error: 'Erreur lors du suivi de la quête'
    }
  }
}

/**
 * Claims reward for a completed quest
 *
 * @param questId - Quest ID
 * @returns Updated quest or error
 */
export async function claimQuestRewardAction (questId: string): Promise<{
  success: boolean
  quest?: DailyQuest
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'Non autorisé'
      }
    }

    const quest = await claimQuestReward(questId, session.user.id)
    // Revalidate paths to update wallet and quests display
    revalidatePath('/dashboard')
    revalidatePath('/quests')
    revalidatePath('/wallet')
    revalidatePath('/creature')


    return {
      success: true,
      quest
    }
  } catch (error) {
    console.error('Error claiming quest reward:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la réclamation de la récompense'
    }
  }
}


'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import { auth } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Types } from 'mongoose'
import { MonsterAction } from '@/hooks/monsters'
import { headers } from 'next/headers'
import type { MonsterActionType } from '@/config/rewards'
import { addCoins } from '@/services/wallet.service'
import { trackQuestProgress } from '@/services/daily-quest.service'
import {
  validateMonsterAction,
  executeMonsterAction,
  updateMonsterLevel
} from '@/services/monster-action.service'
import type { PopulatedMonster } from '@/types/monster'

/**
 * Résultat d'une action sur un monstre
 * Contient les informations de récompense pour afficher les notifications
 */
export interface ActionResult {
  success: boolean
  koinsEarned: number
  isCorrectAction: boolean
  action: MonsterActionType
  error?: string
}


/**
 * Effectue une action sur un monstre
 *
 * Cette server action :
 * 1. Vérifie l'authentification
 * 2. Valide l'action (délégué au service)
 * 3. Récupère le monstre
 * 4. Exécute l'action (délégué au service)
 * 5. Sauvegarde les changements
 * 6. Attribue les récompenses
 * 7. Track les quêtes
 * 8. Invalide le cache
 *
 * Responsabilité unique : Orchestrer l'action en coordonnant les services
 *
 * @param id - Identifiant du monstre
 * @param action - Action à effectuer
 * @returns Résultat de l'action avec les informations de récompense
 */
export async function doActionOnMonster (id: string, action: MonsterAction): Promise<ActionResult> {
  try {
    // 1. Validation de l'action
    validateMonsterAction(id, action)

    // 2. Connexion à la base de données
    await connectMongooseToDatabase()

    // 3. Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // 4. Récupération du monstre avec population du level
    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).populate('level_id').exec()

    if (monster === null || monster === undefined) {
      throw new Error('Monster not found')
    }

    // 5. Exécution de l'action (logique métier déléguée au service)
    const actionResult = await executeMonsterAction(
      monster as unknown as PopulatedMonster,
      action as Exclude<MonsterAction, null>
    )

    // 6. Mise à jour du niveau si nécessaire
    if (actionResult.levelUp) {
      const levelResult = await updateMonsterLevel(
        monster as unknown as PopulatedMonster,
        actionResult.xpGained
      )

      if (levelResult.levelUp && levelResult.newLevel !== undefined) {
        monster.level_id = new Types.ObjectId(String(levelResult.newLevel._id))
        monster.xp = levelResult.newXp
      } else {
        monster.xp = levelResult.newXp
      }
    } else {
      monster.xp = (monster.xp ?? 0) + actionResult.xpGained
    }

    // 7. Mise à jour de l'état du monstre
    monster.state = actionResult.newState
    monster.markModified('state')
    monster.markModified('xp')
    monster.markModified('level_id')
    await monster.save()

    // 8. Attribution des Koins
    await addCoins({
      ownerId: user.id,
      amount: actionResult.koinsEarned
    })

    // 9. Tracking automatique des quêtes
    await trackRelatedQuests(user.id, action as Exclude<MonsterAction, null>)

    // 10. Invalidation du cache
    await invalidateMonsterCache(user.id, id)

    return {
      success: true,
      koinsEarned: actionResult.koinsEarned,
      isCorrectAction: actionResult.isCorrectAction,
      action: action as MonsterActionType
    }
  } catch (error) {
    console.error('Error updating monster state:', error)
    return {
      success: false,
      koinsEarned: 0,
      isCorrectAction: false,
      action: action as MonsterActionType,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Track les quêtes liées à l'action effectuée
 * Single Responsibility: Gestion du tracking des quêtes
 *
 * @param userId - ID de l'utilisateur
 * @param action - Action effectuée
 */
async function trackRelatedQuests (
  userId: string,
  action: Exclude<MonsterAction, null>
): Promise<void> {
  try {
    // Track "feed_monster" quest
    if (action === 'feed') {
      await trackQuestProgress(userId, 'feed_monster', 1)
    }
    // Track "play_with_monster" quest (hug, wake, comfort are considered playing)
    if (action === 'hug' || action === 'wake' || action === 'comfort') {
      await trackQuestProgress(userId, 'play_with_monster', 1)
    }
  } catch (questError) {
    // Ne pas bloquer l'action si le tracking échoue
    console.warn('Failed to track quest progress:', questError)
  }
}

/**
 * Invalide le cache des monstres
 * Single Responsibility: Gestion du cache
 *
 * @param userId - ID de l'utilisateur
 * @param monsterId - ID du monstre
 */
async function invalidateMonsterCache (userId: string, monsterId: string): Promise<void> {
  revalidateTag(`monsters-${userId}`)
  revalidateTag(`monster-${monsterId}`)
  revalidatePath(`/creature/${monsterId}`)
  revalidatePath('/dashboard')
  revalidatePath('/monsters')
  revalidatePath('/wallet')
}

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { MonsterAction } from '@/hooks/monsters'
import type { MonsterActionType } from '@/config/rewards'
import { addCoins } from '@/services/wallet.service'
import { trackQuestProgress } from '@/services/daily-quest.service'
import {
  validateMonsterAction,
  executeMonsterAction,
  updateMonsterLevel
} from '@/services/monster-action.service'
import { authService, type IAuthService } from '@/services/auth.service'
import { monsterRepository, type IMonsterRepository } from '@/repositories/monster.repository'

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
 * 1. Vérifie l'authentification (délégué à authService)
 * 2. Valide l'action (délégué au service)
 * 3. Récupère le monstre (délégué au repository)
 * 4. Exécute l'action (délégué au service)
 * 5. Sauvegarde les changements (délégué au repository)
 * 6. Attribue les récompenses (délégué au service)
 * 7. Track les quêtes (délégué au service)
 * 8. Invalide le cache
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Orchestration only
 * - Dependency Inversion: Depends on abstractions (authService, repositories)
 *
 * @param id - Identifiant du monstre
 * @param action - Action à effectuer
 * @param auth - Service d'authentification (injectable for testing)
 * @param repository - Repository des monstres (injectable for testing)
 * @returns Résultat de l'action avec les informations de récompense
 */
export async function doActionOnMonster (
  id: string,
  action: MonsterAction,
  auth: IAuthService = authService,
  repository: IMonsterRepository = monsterRepository
): Promise<ActionResult> {
  try {
    // 1. Validation de l'action
    validateMonsterAction(id, action)

    // 2. Vérification de l'authentification (DIP: use abstraction)
    const user = await auth.getCurrentUser()
    if (user === null) {
      throw new Error('User not authenticated')
    }

    // 3. Récupération du monstre (DIP: use repository abstraction)
    const monster = await repository.findByIdAndOwner(id, user.id)

    if (monster === null) {
      throw new Error('Monster not found')
    }

    // 4. Exécution de l'action (logique métier déléguée au service)
    const actionResult = await executeMonsterAction(
      monster,
      action as Exclude<MonsterAction, null>
    )

    // 5. Mise à jour du niveau si nécessaire
    if (actionResult.levelUp) {
      const levelResult = await updateMonsterLevel(
        monster,
        actionResult.xpGained
      )

      if (levelResult.levelUp && levelResult.newLevel !== undefined) {
        // Update via repository method (no type casting needed)
        repository.updateMonsterData(monster, {
          levelId: levelResult.newLevel._id,
          xp: levelResult.newXp
        })
      } else {
        repository.updateMonsterData(monster, {
          xp: levelResult.newXp
        })
      }
    } else {
      repository.updateMonsterData(monster, {
        xp: (monster.xp ?? 0) + actionResult.xpGained
      })
    }

    // 6. Mise à jour de l'état du monstre (type-safe avec MonsterState)
    repository.updateMonsterData(monster, {
      state: actionResult.newState
    })

    // 7. Sauvegarde (DIP: use repository abstraction)
    await repository.save(monster)

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

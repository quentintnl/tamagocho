'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import '@/db/models/xp-level.model'
import { auth } from '@/lib/auth'
import { XP_GAIN_CORRECT_ACTION, XP_GAIN_INCORRECT_ACTION } from '@/types/monster'
import { calculateLevelFromXp } from '@/services/xp-level.service'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Types } from 'mongoose'
import { MonsterAction } from '@/hooks/monsters'
import { headers } from 'next/headers'
import { getActionReward, type MonsterActionType } from '@/config/rewards'
import { addCoins } from '@/services/wallet.service'
import { trackQuestProgress } from '@/services/daily-quest.service'

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

const actionsStatesMap: Record<Exclude<MonsterAction, null>, string> = {
  feed: 'hungry',
  comfort: 'angry',
  hug: 'sad',
  wake: 'sleepy'
}

/**
 * Effectue une action sur un monstre
 *
 * Cette server action :
 * 1. Vérifie l'authentification
 * 2. Récupère le monstre
 * 3. Met à jour l'état du monstre
 * 4. Calcule et ajoute l'XP
 * 5. Calcule et ajoute les Koins gagnés
 * 6. Retourne les informations de récompense
 *
 * Responsabilité unique : Orchestrer l'exécution d'une action sur un monstre
 * et coordonner les systèmes de récompenses (XP + Koins).
 *
 * @param id - Identifiant du monstre
 * @param action - Action à effectuer
 * @returns Résultat de l'action avec les informations de récompense
 */
export async function doActionOnMonster (id: string, action: MonsterAction): Promise<ActionResult> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid monster ID format')
    }

    // Récupération du monstre avec vérification de propriété et population du level
    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).populate('level_id').exec()

    if (monster === null || monster === undefined) {
      throw new Error('Monster not found')
    }

    // Mise à jour de l'état du monstre en fonction de l'action
    if (action !== null && action !== undefined && action in actionsStatesMap) {
      let xpGained = XP_GAIN_INCORRECT_ACTION
      let isCorrectAction = false

      // Si l'action correspond à l'état actuel, c'est une action correcte
      if (monster.state === actionsStatesMap[action]) {
        monster.state = 'happy'
        xpGained = XP_GAIN_CORRECT_ACTION
        isCorrectAction = true
      }

      // Calcul de l'XP total en additionnant l'XP de tous les niveaux précédents
      const currentLevelNumber = monster.level_id.level
      const currentXpInLevel = Number(monster.xp ?? 0)

      // Récupérer tous les niveaux pour calculer l'XP total accumulé
      const { getAllXpLevels } = await import('@/services/xp-level.service')
      const allLevels = await getAllXpLevels()

      // Calculer l'XP total = somme des xpRequired pour ATTEINDRE le niveau actuel + XP actuel du niveau
      // Note: xpRequired du niveau 1 est 0 (c'est le niveau de départ)
      // xpRequired du niveau 2 est 50 (il faut 50 XP pour passer de 1 à 2)
      // Donc pour être au niveau 2 avec 10 XP, on a : 0 + 50 + 10 = 60 XP total
      let totalXpBeforeCurrentLevel = 0
      for (const level of allLevels) {
        if (level.level <= currentLevelNumber) {
          totalXpBeforeCurrentLevel += level.xpRequired
          console.log(`  - Niveau ${level.level}: +${level.xpRequired} XP requis`)
        }
      }

      const currentTotalXp = totalXpBeforeCurrentLevel + currentXpInLevel
      const newTotalXp = currentTotalXp + xpGained

      // Calcul du nouveau niveau basé sur l'XP total
      const { level: newLevel, remainingXp } = await calculateLevelFromXp(newTotalXp)

      // Vérification si le niveau a changé
      const currentLevelId = String(monster.level_id._id ?? monster.level_id)
      const newLevelId = String(newLevel._id)

      if (currentLevelId !== newLevelId) {
        // Level up !
        monster.level_id = newLevel._id as any
        monster.xp = remainingXp
      } else {
        // Même niveau, on ajoute juste l'XP gagné
        monster.xp = currentXpInLevel + xpGained
      }

      monster.markModified('state')
      monster.markModified('xp')
      monster.markModified('level_id')
      await monster.save()

      // Calcul et attribution des Koins
      const koinsEarned = getActionReward(action as MonsterActionType, isCorrectAction)
      await addCoins({
        ownerId: user.id,
        amount: koinsEarned
      })

      // Tracking automatique des quêtes
      try {
        // Track "feed_monster" quest
        if (action === 'feed') {
          await trackQuestProgress(user.id, 'feed_monster', 1)
        }
        // Track "play_with_monster" quest (hug, wake, comfort are considered playing)
        if (action === 'hug' || action === 'wake' || action === 'comfort') {
          await trackQuestProgress(user.id, 'play_with_monster', 1)
        }
      } catch (questError) {
        // Ne pas bloquer l'action si le tracking échoue
        console.warn('Failed to track quest progress:', questError)
      }

      // Invalidation du cache des monstres pour cet utilisateur
      revalidateTag(`monsters-${user.id}`)

      // Revalidation du cache pour rafraîchir la page
      revalidatePath(`/creature/${id}`)
      revalidatePath('/dashboard')
      revalidatePath('/monsters')
      revalidatePath('/wallet')

      return {
        success: true,
        koinsEarned,
        isCorrectAction,
        action: action as MonsterActionType
      }
    }

    return {
      success: false,
      koinsEarned: 0,
      isCorrectAction: false,
      action: action as MonsterActionType,
      error: 'Invalid action'
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


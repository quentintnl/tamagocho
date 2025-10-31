/**
 * Monster Action Service
 *
 * Domain Layer: Business logic for monster actions
 *
 * Single Responsibility Principle: Ce service gère uniquement la logique métier
 * des actions sur les monstres, en la décomposant en fonctions unitaires.
 *
 * Responsibilities:
 * - Valider les actions
 * - Calculer les gains d'XP
 * - Mettre à jour les niveaux
 * - Gérer les états du monstre
 *
 * Clean Architecture: Pure business logic, pas de dépendance à l'infrastructure
 */

import { Types } from 'mongoose'
import type { MonsterAction } from '@/hooks/monsters'
import type { PopulatedMonster, XpLevel, MonsterState } from '@/types/monster'
import { isCorrectAction, getNextState, getActionConfig } from '@/config/actions.config'
import { calculateLevelFromXp, getAllXpLevels } from './xp-level.service'

/**
 * Résultat du calcul d'XP
 */
export interface XpCalculationResult {
  xpGained: number
  isCorrectAction: boolean
  nextState: MonsterState
}

/**
 * Résultat de la mise à jour du niveau
 */
export interface LevelUpdateResult {
  levelUp: boolean
  newLevel?: XpLevel
  newXp: number
}

/**
 * Résultat de l'exécution d'une action
 */
export interface ActionExecutionResult {
  xpGained: number
  koinsEarned: number
  isCorrectAction: boolean
  levelUp: boolean
  newState: MonsterState
}

/**
 * Valide qu'une action peut être effectuée sur un monstre
 * Single Responsibility: Validation
 *
 * @param monsterId - ID du monstre
 * @param action - Action à effectuer
 * @throws Error si l'action n'est pas valide
 */
export function validateMonsterAction (
  monsterId: string,
  action: MonsterAction
): void {
  if (!Types.ObjectId.isValid(monsterId)) {
    throw new Error('Invalid monster ID format')
  }

  if (action === null || action === undefined) {
    throw new Error('Invalid action')
  }
}

/**
 * Calcule le gain d'XP pour une action donnée
 * Single Responsibility: Calcul des récompenses XP
 *
 * @param monster - Le monstre concerné
 * @param action - L'action effectuée
 * @returns Le résultat du calcul d'XP
 */
export function calculateXpGain (
  monster: PopulatedMonster,
  action: Exclude<MonsterAction, null>
): XpCalculationResult {
  const isCorrect = isCorrectAction(action, monster.state)
  const config = getActionConfig(action)
  const xpGained = isCorrect ? config.xpGain.correct : config.xpGain.incorrect
  const nextState: MonsterState = isCorrect ? getNextState(action) : monster.state

  return {
    xpGained,
    isCorrectAction: isCorrect,
    nextState
  }
}

/**
 * Calcule le total d'XP accumulé par le monstre
 * Single Responsibility: Calcul de l'XP total
 *
 * @param currentLevelNumber - Niveau actuel du monstre
 * @param currentXpInLevel - XP dans le niveau actuel
 * @returns L'XP total accumulé
 */
export async function calculateTotalXp (
  currentLevelNumber: number,
  currentXpInLevel: number
): Promise<number> {
  const allLevels = await getAllXpLevels()

  let totalXpBeforeCurrentLevel = 0
  for (const level of allLevels) {
    if (level.level <= currentLevelNumber) {
      totalXpBeforeCurrentLevel += level.xpRequired
    }
  }

  return totalXpBeforeCurrentLevel + currentXpInLevel
}

/**
 * Met à jour le niveau du monstre en fonction de l'XP gagné
 * Single Responsibility: Gestion des niveaux
 *
 * @param monster - Le monstre à mettre à jour
 * @param xpGained - L'XP gagné
 * @returns Le résultat de la mise à jour
 */
export async function updateMonsterLevel (
  monster: PopulatedMonster,
  xpGained: number
): Promise<LevelUpdateResult> {
  const currentLevelNumber = monster.level_id.level
  const currentXpInLevel = Number(monster.xp ?? 0)

  // Calcul de l'XP total
  const currentTotalXp = await calculateTotalXp(currentLevelNumber, currentXpInLevel)
  const newTotalXp = currentTotalXp + xpGained

  // Calcul du nouveau niveau
  const { level: newLevel, remainingXp } = await calculateLevelFromXp(newTotalXp)

  // Vérification si le niveau a changé
  const currentLevelId = String(monster.level_id._id ?? monster.level_id)
  const newLevelId = String(newLevel._id)

  if (currentLevelId !== newLevelId) {
    // Level up!
    return {
      levelUp: true,
      newLevel,
      newXp: remainingXp
    }
  } else {
    // Même niveau, on ajoute juste l'XP gagné
    return {
      levelUp: false,
      newXp: currentXpInLevel + xpGained
    }
  }
}

/**
 * Calcule les Koins à gagner pour une action
 * Single Responsibility: Calcul des récompenses Koins
 *
 * @param action - L'action effectuée
 * @param isCorrectAction - Si l'action est correcte
 * @returns Le montant de Koins gagné
 */
export function calculateKoinReward (
  action: Exclude<MonsterAction, null>,
  isCorrectAction: boolean
): number {
  const config = getActionConfig(action)
  return isCorrectAction ? config.koinReward.correct : config.koinReward.incorrect
}

/**
 * Exécute une action sur un monstre et calcule tous les résultats
 * Single Responsibility: Orchestration de l'action
 *
 * Cette fonction coordonne les différentes étapes sans gérer la persistence
 * (qui reste la responsabilité de la couche action/infrastructure)
 *
 * @param monster - Le monstre concerné
 * @param action - L'action à effectuer
 * @returns Le résultat complet de l'action
 */
export async function executeMonsterAction (
  monster: PopulatedMonster,
  action: Exclude<MonsterAction, null>
): Promise<ActionExecutionResult> {
  // 1. Calcul de l'XP
  const xpResult = calculateXpGain(monster, action)

  // 2. Mise à jour du niveau
  const levelResult = await updateMonsterLevel(monster, xpResult.xpGained)

  // 3. Calcul des Koins
  const koinsEarned = calculateKoinReward(action, xpResult.isCorrectAction)

  // Type annotation ensures correct MonsterState inference
  return {
    xpGained: xpResult.xpGained,
    koinsEarned,
    isCorrectAction: xpResult.isCorrectAction,
    levelUp: levelResult.levelUp,
    newState: xpResult.nextState
  } satisfies ActionExecutionResult
}


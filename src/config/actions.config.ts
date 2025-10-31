/**
 * Actions Configuration
 *
 * Domain Layer: Configuration centralisée des actions sur les monstres
 *
 * Open/Closed Principle: Ce fichier est ouvert à l'extension (ajout de nouvelles actions)
 * mais fermé à la modification (le code métier n'a pas besoin d'être changé).
 *
 * Responsabilités:
 * - Définir les actions disponibles et leurs effets
 * - Mapper les actions avec les états de monstre
 * - Centraliser les règles de game design
 */

import type { MonsterAction } from '@/hooks/monsters'
import type { MonsterState } from '@/types/monster'
import { XP_GAIN_CORRECT_ACTION, XP_GAIN_INCORRECT_ACTION } from '@/types/monster'

/**
 * Configuration complète d'une action
 */
export interface ActionConfig {
  /** Action à effectuer */
  action: MonsterAction
  /** État du monstre qui rend cette action correcte */
  correctState: MonsterState
  /** État résultant après une action correcte */
  nextState: MonsterState
  /** XP gagnés selon le résultat de l'action */
  xpGain: {
    correct: number
    incorrect: number
  }
  /** Koins gagnés selon le résultat de l'action */
  koinReward: {
    correct: number
    incorrect: number
  }
}

/**
 * Configuration complète de toutes les actions
 *
 * Pour ajouter une nouvelle action :
 * 1. Ajouter le type dans MonsterAction
 * 2. Ajouter la configuration ici
 * 3. Le reste du code s'adapte automatiquement
 */
export const ACTIONS_CONFIG: Record<Exclude<MonsterAction, null>, ActionConfig> = {
  feed: {
    action: 'feed',
    correctState: 'hungry',
    nextState: 'happy',
    xpGain: { correct: XP_GAIN_CORRECT_ACTION, incorrect: XP_GAIN_INCORRECT_ACTION },
    koinReward: { correct: 1, incorrect: 0 }
  },
  comfort: {
    action: 'comfort',
    correctState: 'angry',
    nextState: 'happy',
    xpGain: { correct: XP_GAIN_CORRECT_ACTION, incorrect: XP_GAIN_INCORRECT_ACTION },
    koinReward: { correct: 1, incorrect: 0 }
  },
  hug: {
    action: 'hug',
    correctState: 'sad',
    nextState: 'happy',
    xpGain: { correct: XP_GAIN_CORRECT_ACTION, incorrect: XP_GAIN_INCORRECT_ACTION },
    koinReward: { correct: 1, incorrect: 0 }
  },
  wake: {
    action: 'wake',
    correctState: 'sleepy',
    nextState: 'happy',
    xpGain: { correct: XP_GAIN_CORRECT_ACTION, incorrect: XP_GAIN_INCORRECT_ACTION },
    koinReward: { correct: 1, incorrect: 0 }
  }
}

/**
 * Récupère la configuration d'une action
 * Single Responsibility: Accès à la configuration
 *
 * @param action - L'action à récupérer
 * @returns La configuration de l'action
 */
export function getActionConfig (action: Exclude<MonsterAction, null>): ActionConfig {
  return ACTIONS_CONFIG[action]
}

/**
 * Vérifie si une action est correcte pour l'état actuel du monstre
 * Single Responsibility: Validation de l'action
 *
 * @param action - L'action effectuée
 * @param currentState - L'état actuel du monstre
 * @returns true si l'action est correcte
 */
export function isCorrectAction (
  action: Exclude<MonsterAction, null>,
  currentState: MonsterState
): boolean {
  const config = getActionConfig(action)
  return config.correctState === currentState
}

/**
 * Récupère l'XP à gagner pour une action
 * Single Responsibility: Calcul des récompenses XP
 *
 * @param action - L'action effectuée
 * @param isCorrect - Si l'action est correcte
 * @returns Le montant d'XP à gagner
 */
export function getXpReward (action: Exclude<MonsterAction, null>, isCorrect: boolean): number {
  const config = getActionConfig(action)
  return isCorrect ? config.xpGain.correct : config.xpGain.incorrect
}

/**
 * Récupère les Koins à gagner pour une action
 * Single Responsibility: Calcul des récompenses Koins
 *
 * @param action - L'action effectuée
 * @param isCorrect - Si l'action est correcte
 * @returns Le montant de Koins à gagner
 */
export function getKoinReward (action: Exclude<MonsterAction, null>, isCorrect: boolean): number {
  const config = getActionConfig(action)
  return isCorrect ? config.koinReward.correct : config.koinReward.incorrect
}

/**
 * Récupère le prochain état après une action correcte
 * Single Responsibility: Détermination du prochain état
 *
 * @param action - L'action effectuée
 * @returns Le prochain état du monstre
 */
export function getNextState (action: Exclude<MonsterAction, null>): MonsterState {
  const config = getActionConfig(action)
  return config.nextState
}

/**
 * Définition d'une action disponible avec métadonnées UI
 * Used by UI components to display actions
 */
export interface AvailableAction {
  /** Clé de l'action */
  action: MonsterAction
  /** Emoji représentant l'action */
  emoji: string
  /** Label textuel de l'action */
  label: string
}

/**
 * Métadonnées UI pour chaque action
 * Open/Closed Principle: Add new actions here
 */
const ACTION_UI_METADATA: Record<Exclude<MonsterAction, null>, { emoji: string, label: string }> = {
  feed: { emoji: '🍎', label: 'Nourrir' },
  comfort: { emoji: '💙', label: 'Consoler' },
  hug: { emoji: '🤗', label: 'Câliner' },
  wake: { emoji: '⏰', label: 'Réveiller' }
}

/**
 * Récupère toutes les actions disponibles avec leurs métadonnées UI
 * Open/Closed Principle: Cette fonction génère automatiquement la liste
 * depuis ACTIONS_CONFIG, donc ajouter une action ne nécessite pas de modifier
 * le code des composants
 *
 * @returns Liste des actions disponibles
 */
export function getAvailableActions (): AvailableAction[] {
  return Object.keys(ACTIONS_CONFIG).map((actionKey) => {
    const action = actionKey as Exclude<MonsterAction, null>
    const metadata = ACTION_UI_METADATA[action]
    return {
      action,
      emoji: metadata.emoji,
      label: metadata.label
    }
  })
}


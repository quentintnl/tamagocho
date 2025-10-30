/**
 * Configuration des récompenses en Koins pour les actions sur les monstres
 *
 * Cette configuration définit les montants de Koins gagnés pour chaque action
 * effectuée sur un monstre. Elle est utilisée par les server actions pour
 * calculer les récompenses.
 *
 * Responsabilité unique : Centraliser la configuration des récompenses
 * pour faciliter les ajustements de game design.
 */

/**
 * Type pour les actions disponibles sur un monstre
 */
export type MonsterActionType = 'feed' | 'comfort' | 'hug' | 'wake'

/**
 * Configuration des récompenses en Koins par action
 */
export interface ActionReward {
  /** Action effectuée sur le monstre */
  action: MonsterActionType
  /** Koins gagnés pour une action correcte (qui correspond au besoin du monstre) */
  correctActionReward: number
  /** Koins gagnés pour une action incorrecte */
  incorrectActionReward: number
}

/**
 * Table de configuration des récompenses
 * Permet d'ajuster facilement le game design sans modifier le code métier
 */
export const REWARDS_CONFIG: Record<MonsterActionType, ActionReward> = {
  feed: {
    action: 'feed',
    correctActionReward: 1,
    incorrectActionReward: 0
  },
  comfort: {
    action: 'comfort',
    correctActionReward: 1,
    incorrectActionReward: 0
  },
  hug: {
    action: 'hug',
    correctActionReward: 1,
    incorrectActionReward: 0
  },
  wake: {
    action: 'wake',
    correctActionReward: 1,
    incorrectActionReward: 0
  }
}

/**
 * Récupère la récompense en Koins pour une action donnée
 *
 * @param action - L'action effectuée
 * @param isCorrectAction - Si l'action correspond au besoin du monstre
 * @returns Le montant de Koins à attribuer
 */
export function getActionReward (action: MonsterActionType, isCorrectAction: boolean): number {
  const reward = REWARDS_CONFIG[action]
  return isCorrectAction ? reward.correctActionReward : reward.incorrectActionReward
}

/**
 * Récupère le message de notification pour une récompense
 *
 * @param action - L'action effectuée
 * @param koinsEarned - Le montant de Koins gagné
 * @param isCorrectAction - Si l'action correspond au besoin du monstre
 * @returns Le message à afficher dans la notification
 */
export function getRewardMessage (
  action: MonsterActionType,
  koinsEarned: number,
  isCorrectAction: boolean
): string {
  if (koinsEarned === 0) {
    return ''
  }
  const coinText = koinsEarned === 1 ? 'Koin' : 'Koins'
  const bonus = isCorrectAction ? ' 🎯' : ''
  return `💰 +${koinsEarned} ${coinText}${bonus}`
}


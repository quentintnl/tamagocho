import { useState, useCallback } from 'react'

/**
 * Type représentant une action possible sur un monstre
 */
export type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | null

/**
 * Interface du hook useMonsterAction
 */
export interface UseMonsterActionReturn {
  /** Action actuellement active (null si aucune) */
  activeAction: MonsterAction
  /** Fonction pour déclencher une action */
  triggerAction: (action: MonsterAction, callback?: (action: MonsterAction) => void) => void
  /** Fonction pour réinitialiser l'action */
  resetAction: () => void
}

/**
 * Hook personnalisé pour gérer les actions sur un monstre
 *
 * Responsabilité unique : gérer l'état de l'action en cours
 * et son cycle de vie (déclenchement, réinitialisation).
 *
 * L'action est automatiquement réinitialisée après 2,5 secondes
 * pour permettre l'animation de se terminer.
 *
 * @param {number} [resetDelay=2500] - Délai avant réinitialisation en ms
 * @returns {UseMonsterActionReturn} État et fonctions de gestion
 *
 * @example
 * const { activeAction, triggerAction } = useMonsterAction()
 * triggerAction('feed', (action) => console.log(`Fed the monster: ${action}`))
 */
export function useMonsterAction (resetDelay: number = 2500): UseMonsterActionReturn {
  const [activeAction, setActiveAction] = useState<MonsterAction>(null)

  /**
   * Déclenche une action et la réinitialise automatiquement
   * @param {MonsterAction} action - Action à déclencher
   * @param {Function} [callback] - Callback optionnel appelé avec l'action
   */
  const triggerAction = useCallback((
    action: MonsterAction,
    callback?: (action: MonsterAction) => void
  ): void => {
    setActiveAction(action)

    // Appel du callback si fourni
    if (callback !== undefined && action !== null) {
      callback(action)
    }

    // Réinitialisation automatique après le délai
    setTimeout(() => {
      setActiveAction(null)
    }, resetDelay)
  }, [resetDelay])

  /**
   * Réinitialise manuellement l'action en cours
   */
  const resetAction = useCallback((): void => {
    setActiveAction(null)
  }, [])

  return {
    activeAction,
    triggerAction,
    resetAction
  }
}

/**
 * useAutoStateChange Hook
 *
 * Application Layer: Gestion automatique du changement d'état du monstre
 *
 * Responsabilités:
 * - Déclencher un changement d'état automatique toutes les 10 secondes
 * - Rafraîchir les données du monstre après chaque changement
 * - Nettoyer l'intervalle lors du démontage
 *
 * Single Responsibility Principle: Isoler la logique de changement d'état automatique
 * Dependency Inversion: Dépend d'abstractions (callback) plutôt que d'implémentations
 *
 * @module hooks/monsters/use-auto-state-change
 */

'use client'

import { useEffect, useRef } from 'react'

/**
 * Intervalle minimum de changement d'état en millisecondes (1 minute)
 */
const MIN_STATE_CHANGE_INTERVAL = 60000 // 1 minute

/**
 * Intervalle maximum de changement d'état en millisecondes (3 minutes)
 */
const MAX_STATE_CHANGE_INTERVAL = 180000 // 3 minutes

/**
 * Génère un intervalle aléatoire entre 1 et 3 minutes
 * @returns {number} Intervalle en millisecondes
 */
const getRandomInterval = (): number => {
  return Math.floor(
    Math.random() * (MAX_STATE_CHANGE_INTERVAL - MIN_STATE_CHANGE_INTERVAL + 1)
  ) + MIN_STATE_CHANGE_INTERVAL
}

/**
 * Hook personnalisé pour gérer le changement automatique d'état du monstre
 *
 * Ce hook configure un intervalle aléatoire entre 1 et 3 minutes qui appelle
 * l'API de changement d'état et rafraîchit les données du monstre.
 *
 * Applique les principes Clean Code:
 * - Constantes nommées (MIN_STATE_CHANGE_INTERVAL, MAX_STATE_CHANGE_INTERVAL)
 * - Nettoyage automatique des effets de bord
 * - Gestion d'erreurs appropriée
 *
 * @param {string} monsterId - ID du monstre à mettre à jour
 * @param {() => Promise<void>} onStateChanged - Callback appelé après chaque changement d'état
 *
 * @example
 * useAutoStateChange(monster._id, async () => {
 *   await refreshMonster()
 * })
 */
export function useAutoStateChange (
  monsterId: string,
  onStateChanged: () => Promise<void>
): void {
  // Utiliser une ref pour éviter les problèmes de closure dans setTimeout
  const onStateChangedRef = useRef(onStateChanged)
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  // Mettre à jour la ref à chaque render
  useEffect(() => {
    onStateChangedRef.current = onStateChanged
  }, [onStateChanged])

  useEffect(() => {
    /**
     * Fonction qui met à jour l'état du monstre via l'API
     */
    const updateState = async (): Promise<void> => {
      try {
        const nextInterval = getRandomInterval()
        const nextIntervalMinutes = (nextInterval / 60000).toFixed(2)

        console.log(`[Auto State Change] Mise à jour de l'état du monstre ${monsterId}`)

        // Appel de l'API pour changer l'état
        const response = await fetch(`/api/monster/state?id=${monsterId}`, {
          method: 'GET',
          cache: 'no-store'
        })

        if (!response.ok) {
          console.error(`[Auto State Change] Échec de la mise à jour de l'état: ${response.status}`)
        } else {
          console.log(`[Auto State Change] État du monstre ${monsterId} mis à jour avec succès`)
          // Rafraîchir les données du monstre après le changement
          await onStateChangedRef.current()
        }

        // Planifier le prochain changement avec un nouvel intervalle aléatoire
        console.log(`[Auto State Change] Prochain changement dans ${nextIntervalMinutes} minutes`)
        timeoutIdRef.current = setTimeout(() => {
          void updateState()
        }, nextInterval)
      } catch (error) {
        console.error('[Auto State Change] Erreur lors de la mise à jour de l\'état:', error)

        // En cas d'erreur, réessayer avec un nouvel intervalle
        const retryInterval = getRandomInterval()
        timeoutIdRef.current = setTimeout(() => {
          void updateState()
        }, retryInterval)
      }
    }

    // Démarrer le premier cycle avec un intervalle aléatoire
    const initialInterval = getRandomInterval()
    const initialIntervalMinutes = (initialInterval / 60000).toFixed(2)

    console.log(`[Auto State Change] Démarrage pour le monstre ${monsterId}, premier changement dans ${initialIntervalMinutes} minutes`)
    timeoutIdRef.current = setTimeout(() => {
      void updateState()
    }, initialInterval)

    // Nettoyage: arrêter le timeout lors du démontage
    return () => {
      console.log(`[Auto State Change] Arrêt du timer pour le monstre ${monsterId}`)
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [monsterId]) // Redémarrer le cycle si monsterId change
}

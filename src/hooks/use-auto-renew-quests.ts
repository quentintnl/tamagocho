/**
 * Hook pour renouveler automatiquement les quêtes quotidiennes à minuit
 *
 * Presentation Layer: Hook React pour le renouvellement automatique des quêtes
 *
 * Fonctionnalités :
 * - Calcule le temps jusqu'à minuit
 * - Déclenche le renouvellement à 00:00:00
 * - Vérifie périodiquement si c'est minuit
 * - Logs détaillés pour le debugging
 * - Support du userId pour renouveler uniquement les quêtes d'un utilisateur
 *
 * Architecture :
 * - Utilise useEffect pour la gestion du timer
 * - useRef pour éviter les boucles infinies
 * - Cleanup automatique au démontage
 *
 * @example
 * ```tsx
 * function App() {
 *   useAutoRenewQuests({
 *     userId: 'user123',
 *     enabled: true,
 *     verbose: true
 *   })
 * }
 * ```
 */

'use client'

import { useEffect, useRef } from 'react'

interface UseAutoRenewQuestsOptions {
  /** ID de l'utilisateur (optionnel, si vide renouvelle pour tous) */
  userId?: string | null
  /** Active ou désactive le renouvellement automatique */
  enabled?: boolean
  /** Active les logs détaillés dans la console */
  verbose?: boolean
  /** Callback appelé après un renouvellement réussi */
  onRenewed?: (data: RenewResult) => void
  /** Callback appelé en cas d'erreur */
  onError?: (error: Error) => void
}

interface RenewResult {
  success: boolean
  usersProcessed?: number
  totalQuestsExpired?: number
  totalQuestsCreated?: number
  nextRenewal?: string
  timestamp: string
  duration: number
}

const ONE_MINUTE = 60 * 1000 // 1 minute en millisecondes
const CHECK_INTERVAL = ONE_MINUTE // Vérifier toutes les minutes si c'est minuit

/**
 * Logger personnalisé avec timestamp
 */
function log (verbose: boolean, message: string, data?: Record<string, unknown>): void {
  if (!verbose) return

  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [AUTO-RENEW-QUESTS]`

  if (data !== undefined) {
    console.log(`${prefix} ${message}`, data)
  } else {
    console.log(`${prefix} ${message}`)
  }
}

/**
 * Calcule le temps en millisecondes jusqu'au prochain minuit
 */
function getMillisecondsUntilMidnight (): number {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow.getTime() - now.getTime()
}

/**
 * Vérifie si on est dans la fenêtre de minuit (00:00 - 00:05)
 */
function isMidnightWindow (): boolean {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return hours === 0 && minutes < 5
}

/**
 * Appelle l'API de renouvellement des quêtes
 */
async function renewQuests (userId?: string | null, verbose: boolean = false): Promise<RenewResult> {
  const url = userId !== null && userId !== undefined
    ? `/api/cron/renew-quests?userId=${userId}`
    : '/api/cron/renew-quests'

  log(verbose, `🔄 Appel API de renouvellement: ${url}`)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to renew quests')
  }

  const data = await response.json()
  log(verbose, '✅ Quêtes renouvelées avec succès', data)

  return data
}

/**
 * Hook pour renouveler automatiquement les quêtes quotidiennes à minuit
 */
export function useAutoRenewQuests (options: UseAutoRenewQuestsOptions = {}): void {
  const {
    userId = null,
    enabled = true,
    verbose = false,
    onRenewed,
    onError
  } = options

  // Refs pour éviter les boucles infinies
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)
  const lastRenewalRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      log(verbose, '⏸️ Renouvellement automatique désactivé')
      return
    }

    log(verbose, `🌙 Démarrage du système de renouvellement automatique des quêtes${userId !== null ? ` pour l'utilisateur ${userId}` : ''}`)

    /**
     * Fonction principale de renouvellement
     */
    async function handleRenewal (): Promise<void> {
      const now = new Date()
      const today = now.toISOString().split('T')[0]

      // Éviter les renouvellements multiples le même jour
      if (lastRenewalRef.current === today) {
        log(verbose, `ℹ️ Renouvellement déjà effectué aujourd'hui (${today})`)
        return
      }

      try {
        log(verbose, '🔄 Déclenchement du renouvellement des quêtes...')
        const result = await renewQuests(userId, verbose)

        lastRenewalRef.current = today
        log(verbose, '✅ Renouvellement terminé', {
          usersProcessed: result.usersProcessed,
          expired: result.totalQuestsExpired,
          created: result.totalQuestsCreated,
          nextRenewal: result.nextRenewal
        })

        onRenewed?.(result)
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error')
        log(verbose, '❌ Erreur lors du renouvellement', { error: err.message })
        onError?.(err)
      }
    }

    /**
     * Vérifie si c'est minuit et déclenche le renouvellement
     */
    function checkAndRenew (): void {
      if (isMidnightWindow()) {
        log(verbose, '🌙 Fenêtre de minuit détectée, renouvellement en cours...')
        void handleRenewal()
      }
    }

    // 1. Calculer le temps jusqu'à minuit
    const msUntilMidnight = getMillisecondsUntilMidnight()
    const hoursUntilMidnight = Math.floor(msUntilMidnight / (60 * 60 * 1000))
    const minutesUntilMidnight = Math.floor((msUntilMidnight % (60 * 60 * 1000)) / (60 * 1000))

    log(verbose, `⏰ Prochain renouvellement dans ${hoursUntilMidnight}h ${minutesUntilMidnight}min`)

    // 2. Programmer le renouvellement à minuit
    timeoutIdRef.current = setTimeout(() => {
      log(verbose, '🌙 Minuit atteint, déclenchement du renouvellement...')
      void handleRenewal()
    }, msUntilMidnight)

    // 3. Vérifier périodiquement (toutes les minutes) si c'est minuit
    // Utile en cas de mise en veille/réveil de l'ordinateur
    intervalIdRef.current = setInterval(() => {
      checkAndRenew()
    }, CHECK_INTERVAL)

    // 4. Cleanup au démontage
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      log(verbose, '🛑 Système de renouvellement automatique arrêté')
    }
  }, [enabled, userId, verbose, onRenewed, onError])
}


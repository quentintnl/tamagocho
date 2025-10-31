/**
 * Hook React pour déclencher automatiquement la mise à jour des monstres
 * depuis le frontend à intervalle régulier
 *
 * Usage:
 * ```tsx
 * const { trigger, isUpdating, lastUpdate } = useAutoUpdateMonsters({
 *   userId: 'user123',
 *   minInterval: 60000, // 1 minute
 *   maxInterval: 180000, // 3 minutes
 *   enabled: true,
 * })
 * ```
 */
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAutoUpdateMonstersOptions {
  /** ID de l'utilisateur dont les monstres doivent être mis à jour */
  userId?: string | null
  /** Intervalle minimum en millisecondes (par défaut 60000 = 1 minute) */
  minInterval?: number
  /** Intervalle maximum en millisecondes (par défaut 180000 = 3 minutes) */
  maxInterval?: number
  /** Active ou désactive les mises à jour automatiques */
  enabled?: boolean
  /** Callback appelé après chaque mise à jour */
  onUpdate?: (result: UpdateResult) => void
  /** Active les logs détaillés dans la console */
  verbose?: boolean
}

interface UpdateResult {
  success: boolean
  updated?: number
  timestamp?: string
  duration?: number
  error?: string
}

export function useAutoUpdateMonsters (options: UseAutoUpdateMonstersOptions = {}): {
  trigger: () => Promise<void>
  isUpdating: boolean
  lastUpdate: UpdateResult | null
  updateCount: number
  nextUpdateIn: number | null
} {
  const {
    userId = null,
    minInterval = 60000, // 1 minute par défaut
    maxInterval = 180000, // 3 minutes par défaut
    enabled = true,
    onUpdate,
    verbose = true
  } = options

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUpdatingRef = useRef(false)

  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<UpdateResult | null>(null)
  const [updateCount, setUpdateCount] = useState(0)
  const [nextUpdateIn, setNextUpdateIn] = useState<number | null>(null)

  /**
     * Logger conditionnel basé sur le flag verbose
     */
  const log = (level: 'log' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void => {
    if (!verbose) return

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [AUTO-UPDATE]`

    if (data !== undefined) {
      console[level](`${prefix} ${message}`, data)
    } else {
      console[level](`${prefix} ${message}`)
    }
  }

  /**
     * Génère un délai aléatoire entre minInterval et maxInterval
     */
  const getRandomInterval = (): number => {
    return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  }

  /**
     * Fonction pour mettre à jour les monstres
     */
  const updateMonsters = async (): Promise<void> => {
    // Éviter les appels concurrents
    if (isUpdatingRef.current) {
      log('log', '⏭️ Mise à jour déjà en cours, skip...')
      return
    }

    // Vérifier qu'on a un userId
    if (userId == null) {
      log('warn', '⚠️ Pas d\'utilisateur connecté, skip...')
      return
    }

    isUpdatingRef.current = true
    setIsUpdating(true)
    setNextUpdateIn(null)

    try {
      log('log', `🔄 Déclenchement mise à jour des monstres pour l'utilisateur ${userId}...`)

      const response = await fetch(`/api/cron/update-monsters?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN ?? ''}`,
          'Content-Type': 'application/json'
        }
      })

      const data: unknown = await response.json()
      const parsedData = data as Record<string, unknown>

      if (response.ok) {
        log('log', '✅ Monstres mis à jour avec succès', {
          updated: parsedData.updated,
          duration: parsedData.duration
        })

        const result: UpdateResult = {
          success: true,
          updated: parsedData.updated as number | undefined,
          timestamp: parsedData.timestamp as string | undefined,
          duration: parsedData.duration as number | undefined
        }

        setLastUpdate(result)
        setUpdateCount(prev => prev + 1)
        onUpdate?.(result)
      } else {
        log('error', '❌ Erreur lors de la mise à jour', {
          status: response.status,
          error: parsedData.error
        })

        const result: UpdateResult = {
          success: false,
          error: (parsedData.message ?? parsedData.error ?? 'Unknown error') as string
        }

        setLastUpdate(result)
        onUpdate?.(result)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      log('error', '❌ Exception lors de la mise à jour', { error: errorMessage })

      const result: UpdateResult = {
        success: false,
        error: errorMessage
      }

      setLastUpdate(result)
      onUpdate?.(result)
    } finally {
      isUpdatingRef.current = false
      setIsUpdating(false)
    }
  }

  /**
     * Planifie la prochaine mise à jour avec un délai aléatoire
     */
  const scheduleNext = (): void => {
    const delay = getRandomInterval()
    setNextUpdateIn(delay)

    log('log', `⏰ Prochaine mise à jour dans ${Math.round(delay / 1000)}s (${Math.round(delay / 60000)} min)`)

    timeoutRef.current = setTimeout(() => {
      void updateMonsters().then(() => {
        scheduleNext() // Planifier la suivante après succès
      })
    }, delay)
  }

  /**
     * Setup de l'intervalle automatique avec délais aléatoires
     */
  useEffect(() => {
    // Si disabled ou pas d'userId, ne rien faire
    if (!enabled || userId == null) {
      if (!enabled) {
        log('log', '⏸️ Mises à jour automatiques désactivées')
      } else {
        log('log', '⏸️ En attente de connexion utilisateur...')
      }
      return
    }

    log('log', `🚀 Démarrage des mises à jour automatiques pour l'utilisateur ${userId} (intervalle aléatoire: ${Math.round(minInterval / 60000)}-${Math.round(maxInterval / 60000)} min)`)

    // Première exécution immédiate puis planification
    void updateMonsters().then(() => {
      scheduleNext()
    })

    // Cleanup au démontage
    return () => {
      log('log', '⏹️ Arrêt des mises à jour automatiques')
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setNextUpdateIn(null)
    }
  }, [enabled, userId]) // Uniquement enabled et userId comme dépendances

  /**
     * Fonction pour déclencher manuellement une mise à jour
     */
  const trigger = async (): Promise<void> => {
    log('log', '🔘 Déclenchement manuel d\'une mise à jour')
    await updateMonsters()
  }

  return {
    /** Déclenche manuellement une mise à jour */
    trigger,
    /** Indique si une mise à jour est en cours */
    isUpdating,
    /** Résultat de la dernière mise à jour */
    lastUpdate,
    /** Nombre total de mises à jour effectuées depuis le montage du composant */
    updateCount,
    /** Délai en ms avant la prochaine mise à jour (null si en cours) */
    nextUpdateIn
  }
}

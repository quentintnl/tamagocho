/**
 * Composant pour gérer les mises à jour automatiques des monstres
 *
 * Ce composant invisible s'occupe de déclencher automatiquement
 * les mises à jour des états des monstres à intervalle régulier.
 *
 * À placer dans le dashboard
 *
 * Usage:
 * ```tsx
 * <MonstersAutoUpdater
 *   userId={session.user.id}
 *   minInterval={60000}  // 1 minute
 *   maxInterval={180000} // 3 minutes
 *   enabled={true}
 *   verbose={true}
 * />
 * ```
 */
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'
import { useEffect, useState } from 'react'

interface MonstersAutoUpdaterProps {
  /** ID de l'utilisateur connecté */
  userId?: string | null
  /** Intervalle minimum en millisecondes (par défaut 60000 = 1 minute) */
  minInterval?: number
  /** Intervalle maximum en millisecondes (par défaut 180000 = 3 minutes) */
  maxInterval?: number
  /** Active ou désactive les mises à jour automatiques (par défaut true) */
  enabled?: boolean
  /** Active les logs détaillés dans la console (par défaut true) */
  verbose?: boolean
  /** Affiche un indicateur visuel des mises à jour (par défaut false) */
  showIndicator?: boolean
}

export function MonstersAutoUpdater ({
  userId = null,
  minInterval = 60000,
  maxInterval = 180000,
  enabled = true,
  verbose = true,
  showIndicator = false
}: MonstersAutoUpdaterProps): React.ReactNode {
  const { isUpdating, lastUpdate, updateCount, nextUpdateIn } = useAutoUpdateMonsters({
    userId,
    minInterval,
    maxInterval,
    enabled,
    verbose,
    onUpdate: (result) => {
      if (verbose) {
        if (result.success) {
          console.log(`✅ [AUTO-UPDATER] Mise à jour #${updateCount + 1} réussie: ${result.updated ?? 0} monstre(s)`)
        } else {
          console.error(`❌ [AUTO-UPDATER] Mise à jour #${updateCount + 1} échouée:`, result.error ?? 'Unknown error')
        }
      }
    }
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne rien rendre côté serveur
  if (!mounted) {
    return null
  }

  // Indicateur visuel optionnel
  if (showIndicator && enabled) {
    return (
      <div
        className='fixed bottom-4 right-4 z-50 bg-gray-900/90 text-white px-4 py-2 rounded-lg shadow-lg text-sm'
        role='status'
        aria-live='polite'
      >
        <div className='flex items-center gap-2'>
          {isUpdating
            ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
                <span>Mise à jour en cours...</span>
              </>
              )
            : (
              <>
                <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse' />
                <span>
                  Auto-update actif ({updateCount} mise(s) à jour)
                </span>
              </>
              )}
        </div>
        {(lastUpdate !== null) && (
          <div className='mt-1 text-xs text-gray-400'>
            {lastUpdate.success
              ? (
                  `Dernière: ${lastUpdate.updated ?? 0} monstre(s) en ${lastUpdate.duration ?? 0}ms`
                )
              : (
                  `Erreur: ${lastUpdate.error ?? 'Unknown'}`
                )}
          </div>
        )}
        {(nextUpdateIn !== null) && (
          <div className='mt-1 text-xs text-gray-300'>
            Prochaine: dans {Math.round(nextUpdateIn / 1000)}s
          </div>
        )}
      </div>
    )
  }

  // Par défaut, ne rend rien visuellement
  return null
}


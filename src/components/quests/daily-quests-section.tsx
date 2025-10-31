/**
 * Section des quêtes quotidiennes avec données réelles
 *
 * Presentation Layer: Affichage des quêtes de la base de données
 *
 * Responsabilités :
 * - Charger les quêtes quotidiennes de l'utilisateur
 * - Afficher les quêtes avec leurs progressions
 * - Gérer la réclamation des récompenses
 * - Afficher des notifications de succès
 * - Auto-rafraîchir après réclamation
 *
 * Architecture :
 * - Utilise les server actions pour récupérer/modifier les quêtes
 * - Affiche un toast de notification
 * - Gère les états de chargement
 *
 * @example
 * ```tsx
 * <DailyQuestsSection />
 * ```
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getUserDailyQuests, claimQuestRewardAction } from '@/actions/quest.actions'
import type { DailyQuest } from '@/types/quest'
import { DailyQuestCard } from './daily-quest-card'
import { DailyQuestsSkeleton } from './daily-quests-skeleton'

interface DailyQuestsSectionProps {
  /** Callback appelé après réclamation d'une récompense */
  onRewardClaimed?: (coinReward: number) => void
}

export function DailyQuestsSection ({ onRewardClaimed }: DailyQuestsSectionProps): React.ReactNode {
  const [quests, setQuests] = useState<DailyQuest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  // Ref pour éviter les appels multiples simultanés
  const loadingRef = useRef(false)

  /**
   * Charge les quêtes quotidiennes
   * Optimisé avec useCallback pour éviter les re-créations inutiles
   */
  const loadQuests = useCallback(async (): Promise<void> => {
    // Éviter les appels simultanés
    if (loadingRef.current) {
      console.log('[DailyQuests] Chargement déjà en cours, skip')
      return
    }

    try {
      loadingRef.current = true
      setIsLoading(true)
      setError(null)

      const result = await getUserDailyQuests()

      if (result.success && result.quests !== undefined) {
        setQuests(result.quests)
      } else {
        setError(result.error ?? 'Erreur lors du chargement des quêtes')
      }
    } catch (err) {
      setError('Erreur lors du chargement des quêtes')
      console.error('Erreur chargement quêtes:', err)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, []) // Pas de dépendances car on utilise uniquement des setters

  /**
   * Réclamer la récompense d'une quête
   * Optimisé avec useCallback pour éviter les re-créations inutiles
   */
  const handleClaimReward = useCallback(async (questId: string): Promise<void> => {
    try {
      const quest = quests.find(q => q._id === questId)
      if (quest === undefined) return

      const result = await claimQuestRewardAction(questId)

      if (result.success && result.quest !== undefined) {
        // Afficher la notification
        setNotification({
          message: `🎉 +${quest.coinReward} Koins gagnés !`,
          type: 'success'
        })

        // Callback pour mettre à jour le wallet
        onRewardClaimed?.(quest.coinReward)

        // Masquer la notification après 3 secondes
        setTimeout(() => {
          setNotification(null)
        }, 3000)

        // Rafraîchir les quêtes
        await loadQuests()
      } else {
        setNotification({
          message: result.error ?? 'Erreur lors de la réclamation',
          type: 'error'
        })

        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
    } catch (err) {
      console.error('Erreur réclamation récompense:', err)
      setNotification({
        message: 'Erreur lors de la réclamation',
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }, [quests, onRewardClaimed, loadQuests])

  // Charger les quêtes au montage UNIQUEMENT
  useEffect(() => {
    void loadQuests()
  }, [loadQuests])

  // Calculer les statistiques
  const totalQuests = quests.length
  const completedQuests = quests.filter(q => q.status === 'completed').length
  const activeQuests = quests.filter(q => q.status === 'active').length

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <DailyQuestsSkeleton />
  }

  return (
    <div className='rounded-3xl bg-white/90 p-6 shadow-[0_20px_60px_rgba(22,101,52,0.15)] ring-1 ring-meadow-200/60 backdrop-blur'>
      {/* En-tête */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <span className='flex h-12 w-12 items-center justify-center rounded-full bg-lochinvar-100 text-3xl'>
            🎯
          </span>
          <div>
            <h2 className='text-lg font-bold text-slate-800'>
              Quêtes Quotidiennes
            </h2>
            <p className='text-sm text-slate-600'>
              {`${completedQuests}/${totalQuests} complétées`}
            </p>
          </div>
        </div>

        {/* Badge de progression */}
        {totalQuests > 0 && (
          <div className='flex flex-col items-end gap-1'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>{completedQuests === totalQuests ? '🏆' : '⚡'}</span>
              <span className='text-2xl font-bold text-lochinvar-600'>
                {completedQuests}/{totalQuests}
              </span>
            </div>
            <span className='text-xs text-slate-500'>
              {completedQuests === totalQuests
                ? 'Toutes terminées !'
                : `${activeQuests} en cours`}
            </span>
          </div>
        )}
      </div>

      {/* Erreur */}
      {error !== null && (
        <div className='mt-6 rounded-xl bg-red-50 p-4 ring-1 ring-red-200'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>⚠️</span>
            <div>
              <p className='font-semibold text-red-800'>Erreur</p>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          </div>
          <button
            onClick={loadQuests}
            className='mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 active:scale-95 transition-all duration-200'
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Liste des quêtes */}
      {error === null && (
        <>
          {quests.length === 0 ? (
            <div className='mt-6 rounded-xl bg-slate-50 p-8 text-center ring-1 ring-slate-200'>
              <span className='text-5xl'>🎯</span>
              <p className='mt-4 font-semibold text-slate-800'>Aucune quête disponible</p>
              <p className='mt-2 text-sm text-slate-600'>
                Revenez demain pour de nouvelles quêtes !
              </p>
            </div>
          ) : (
            <div className='mt-6 space-y-4'>
              {quests.map((quest) => (
                <DailyQuestCard
                  key={quest._id}
                  quest={quest}
                  onClaimReward={handleClaimReward}
                />
              ))}
            </div>
          )}

          {/* Message de motivation */}
          {quests.length > 0 && completedQuests === totalQuests && (
            <div className='mt-6 rounded-xl bg-gradient-to-r from-meadow-50 to-lochinvar-50 p-6 text-center ring-1 ring-meadow-300'>
              <span className='text-5xl'>🎉</span>
              <p className='mt-3 text-lg font-bold text-meadow-800'>
                Toutes les quêtes complétées !
              </p>
              <p className='mt-2 text-sm text-meadow-700'>
                Excellent travail ! Revenez demain pour de nouvelles aventures.
              </p>
            </div>
          )}
        </>
      )}

      {/* Notification toast */}
      {notification !== null && (
        <div
          className={`fixed bottom-6 right-6 z-50 animate-slide-up rounded-xl px-6 py-4 shadow-2xl ring-2 ${
            notification.type === 'success'
              ? 'bg-gradient-to-r from-meadow-500 to-meadow-600 ring-meadow-300 text-white'
              : 'bg-gradient-to-r from-red-500 to-red-600 ring-red-300 text-white'
          }`}
        >
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>
              {notification.type === 'success' ? '✨' : '❌'}
            </span>
            <p className='font-bold text-lg'>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}


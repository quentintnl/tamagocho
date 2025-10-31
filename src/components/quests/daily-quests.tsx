/**
 * Daily Quests Component
 *
 * Presentation Layer: Display user's daily quests with progress
 *
 * Responsibilities:
 * - Display 5 daily quests
 * - Show progress bars
 * - Display rewards
 * - Handle quest completion
 *
 * Clean Architecture: Pure UI component with no business logic
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getUserDailyQuests, claimQuestRewardAction } from '@/actions/quest.actions'
import type { DailyQuest } from '@/types/quest'
import Button from '@/components/button'
import { QuestSkeleton } from './quest-skeleton'
import { QuestsHeader } from './quests-header'
import { QuestsFooter } from './quests-footer'
import { useWalletContext } from '@/contexts/wallet-context'
import TomatokenIcon from '@/components/tomatoken-icon'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface DailyQuestsProps {
  onQuestComplete?: () => void
}

export default function DailyQuests ({ onQuestComplete }: DailyQuestsProps): React.ReactNode {
  const [quests, setQuests] = useState<DailyQuest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Utiliser le contexte wallet pour pouvoir le rafraîchir
  const { refreshWallet } = useWalletContext()
  const [claimingQuestId, setClaimingQuestId] = useState<string | null>(null)

  // Ref pour éviter les appels multiples simultanés
  const loadingRef = useRef(false)

  const loadQuests = useCallback(async (): Promise<void> => {
    // Éviter les appels simultanés
    if (loadingRef.current) {
      console.log('[DailyQuests] Chargement déjà en cours, skip')
      return
    }

    try {
      loadingRef.current = true
      setLoading(true)
      setError(null)

      const result = await getUserDailyQuests()

      if (result.success && result.quests != null) {
        // Trier les quêtes : non complétées en premier, puis complétées
        const sortedQuests = [...result.quests].sort((a, b) => {
          const aCompleted = a.status === 'completed' || a.status === 'claimed'
          const bCompleted = b.status === 'completed' || b.status === 'claimed'

          // Si a est non complétée et b complétée, a vient en premier
          if (!aCompleted && bCompleted) return -1
          // Si a est complétée et b non complétée, b vient en premier
          if (aCompleted && !bCompleted) return 1
          // Sinon, garder l'ordre original
          return 0
        })

        setQuests(sortedQuests)
      } else {
        const errorMsg = result.error ?? 'Erreur inconnue'
        setError(errorMsg)
        showErrorToast(`Erreur lors du chargement des quêtes : ${errorMsg}`)
      }
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
    void loadQuests()
  }, [loadQuests])

  const handleClaimReward = useCallback(async (questId: string): Promise<void> => {
    setClaimingQuestId(questId)

    const result = await claimQuestRewardAction(questId)

    if (result.success && result.quest != null) {
      // Update quest in list
      const updatedQuests = quests.map(q => (q._id === questId ? result.quest! : q))

      // Re-trier les quêtes : non complétées en premier
      const sortedQuests = [...updatedQuests].sort((a, b) => {
        const aCompleted = a.status === 'completed' || a.status === 'claimed'
        const bCompleted = b.status === 'completed' || b.status === 'claimed'

        if (!aCompleted && bCompleted) return -1
        if (aCompleted && !bCompleted) return 1
        return 0
      })

      setQuests(sortedQuests)
      // Afficher un toast de succès
      showSuccessToast(`Récompense réclamée : +${result.quest.coinReward} gochoCoins ! 🎉`)


      // Refresh wallet to show updated coins immediately
      await refreshWallet()

      // Notify parent component
      if (onQuestComplete != null) {
        onQuestComplete()
      }
    } else {
      const errorMsg = result.error ?? 'Erreur lors de la réclamation'
      setError(errorMsg)
      showErrorToast(errorMsg)
    }

    setClaimingQuestId(null)
  }, [onQuestComplete, refreshWallet, quests])

  const getProgressPercentage = (quest: DailyQuest): number => {
    return Math.min((quest.currentProgress / quest.targetCount) * 100, 100)
  }


  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'Facile'
      case 'medium':
        return 'Moyen'
      case 'hard':
        return 'Difficile'
      default:
        return difficulty
    }
  }


  if (error != null) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sunset-100 via-white to-gold-100 p-8 shadow-xl border-4 border-white/80">
        {/* Motif décoratif */}
        <div className='absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-sunset-300/40 to-gold-300/30 blur-2xl' aria-hidden='true' />

        <div className='relative text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-sunset-400 to-gold-500 shadow-xl border-4 border-white text-4xl'>
              ⚠️
            </div>
          </div>
          <h3 className='text-2xl font-black text-forest-800'>Oups, une erreur !</h3>
          <p className="text-forest-600 font-medium">{error}</p>
          <div className="pt-2">
            <Button onClick={loadQuests} size="lg" variant="primary">
              🔄 Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header avec skeleton */}
      <QuestsHeader
        title={loading ? null : 'Quêtes du Jour'}
        onRefresh={loadQuests}
        isLoading={loading}
      />

      {/* Contenu principal */}
      {quests.length === 0 && !loading
        ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-sky-100 p-10 text-center shadow-2xl border-4 border-white/90">
            {/* Motifs décoratifs */}
            <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-lavender-300/40 to-fuchsia-blue-300/30 blur-2xl' aria-hidden='true' />
            <div className='absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-meadow-300/30 to-sky-300/20 blur-2xl' aria-hidden='true' />

            <div className='relative space-y-6'>
              <div className='flex justify-center'>
                <div className='flex items-center justify-center h-32 w-32 rounded-3xl bg-gradient-to-br from-gold-400 to-sunset-500 shadow-2xl border-4 border-white text-6xl animate-bounce' style={{ animationDuration: '2s' }}>
                  🎯
                </div>
              </div>
              <h3 className='text-3xl font-black text-forest-800'>Aucune Quête Disponible</h3>
              <p className="text-lg text-forest-600">Reviens plus tard pour de nouvelles missions !</p>
            </div>
          </div>
          )
        : (
          <div className="grid gap-6">
            {loading
              ? (
                // Skeleton des cartes
                [...Array(5)].map((_, index) => (
                  <QuestSkeleton key={index} />
                ))
                )
              : (
                // Vraies cartes de quêtes
                quests.map(quest => {
                  const progressPercentage = getProgressPercentage(quest)
                  const isCompleted = quest.status === 'completed' || quest.status === 'claimed'
                  const canClaim = quest.status === 'completed' && quest.currentProgress >= quest.targetCount

                  // Couleurs basées sur la difficulté
                  interface DifficultyStyle {
                    bg: string
                    border: string
                    badge: string
                    progress: string
                  }

                  const difficultyStylesMap: Record<string, DifficultyStyle> = {
                    easy: {
                      bg: 'from-meadow-100 via-white to-forest-50',
                      border: 'border-meadow-200/80',
                      badge: 'from-meadow-400 to-forest-500',
                      progress: 'from-meadow-400 to-forest-500'
                    },
                    medium: {
                      bg: 'from-sky-100 via-white to-lavender-50',
                      border: 'border-sky-200/80',
                      badge: 'from-sky-400 to-lavender-500',
                      progress: 'from-sky-400 to-lavender-500'
                    },
                    hard: {
                      bg: 'from-sunset-100 via-white to-gold-50',
                      border: 'border-sunset-200/80',
                      badge: 'from-sunset-400 to-gold-500',
                      progress: 'from-sunset-400 to-gold-500'
                    }
                  }

                  const defaultStyle: DifficultyStyle = {
                    bg: 'from-meadow-100 via-white to-forest-50',
                    border: 'border-meadow-200/80',
                    badge: 'from-meadow-400 to-forest-500',
                    progress: 'from-meadow-400 to-forest-500'
                  }

                  const difficultyStyles = difficultyStylesMap[quest.difficulty] ?? defaultStyle

                  return (
                    <div
                      key={quest._id}
                      className={`
                        group relative overflow-hidden rounded-3xl bg-gradient-to-br ${difficultyStyles.bg} p-6 shadow-xl border-4 border-white/90 transition-all duration-300
                        ${isCompleted ? 'ring-4 ring-gold-300/50' : ''}
                        hover:shadow-2xl hover:scale-[1.02]
                      `}
                    >
                      {/* Motif décoratif */}
                      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl transition-all duration-500 group-hover:scale-110' aria-hidden='true' />

                      {/* Badge complété */}
                      {isCompleted && (
                        <div className="absolute right-4 top-4 z-10">
                          <div className='flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-gold-400 to-sunset-500 shadow-lg border-4 border-white text-2xl animate-bounce' style={{ animationDuration: '2s' }}>
                            ✅
                          </div>
                        </div>
                      )}

                      {/* Header */}
                      <div className="relative flex items-start justify-between mb-4">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-forest-800 leading-tight">{quest.title}</h3>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r ${difficultyStyles.badge} text-xs font-black uppercase tracking-wide text-white shadow-lg border-2 border-white/60`}>
                              {getDifficultyLabel(quest.difficulty)}
                            </span>
                          </div>
                          <p className="text-sm text-forest-600 font-medium leading-relaxed">{quest.description}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-bold text-forest-700">
                            Progression: {quest.currentProgress} / {quest.targetCount}
                          </span>
                          <span className="font-black text-forest-800 text-base">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="relative w-full bg-forest-100/50 rounded-full h-4 overflow-hidden border-2 border-white shadow-inner">
                          <div
                            className={`h-full transition-all duration-500 bg-gradient-to-r ${difficultyStyles.progress} shadow-sm`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                          {progressPercentage > 0 && progressPercentage < 100 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{ animationDuration: '2s' }} />
                          )}
                        </div>
                      </div>

                      {/* Rewards & Action */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border-2 border-gold-200/60 shadow-sm">
                            <TomatokenIcon size='md' />
                            <span className="font-black text-gold-600">+{quest.coinReward}</span>
                          </div>
                          {(quest.xpReward ?? 0) > 0 && (
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border-2 border-lavender-200/60 shadow-sm">
                              <span className="text-xl">⭐</span>
                              <span className="font-black text-lavender-600">+{quest.xpReward} XP</span>
                            </div>
                          )}
                        </div>

                        {canClaim && (
                          <Button
                            onClick={async () => { await handleClaimReward(quest._id) }}
                            size="lg"
                            variant="primary"
                            disabled={claimingQuestId === quest._id}
                          >
                            {claimingQuestId === quest._id ? '⏳ En cours...' : '🎁 Réclamer'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
                )}
          </div>
          )}

      {/* Info Footer avec skeleton */}
      <QuestsFooter text={loading ? null : 'Les quêtes se renouvellent à minuit 🌙'} />
    </div>
  )
}


/**
 * Daily Quests Component
 *
 * Presentation Layer: Display user's daily quests with progress
 *
 * Responsibilities:
 * - Display 3 daily quests
 * - Show progress bars
 * - Display rewards
 * - Handle quest completion
 *
 * Clean Architecture: Pure UI component with no business logic
 */

'use client'

import { useEffect, useState } from 'react'
import { getUserDailyQuests, claimQuestRewardAction } from '@/actions/quest.actions'
import type { DailyQuest } from '@/types/quest'
import Button from '@/components/button'

interface DailyQuestsProps {
  onQuestComplete?: () => void
}

export default function DailyQuests ({ onQuestComplete }: DailyQuestsProps): React.ReactNode {
  const [quests, setQuests] = useState<DailyQuest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [claimingQuestId, setClaimingQuestId] = useState<string | null>(null)

  useEffect(() => {
    loadQuests()
  }, [])

  const loadQuests = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    const result = await getUserDailyQuests()

    if (result.success && result.quests != null) {
      setQuests(result.quests)
    } else {
      setError(result.error ?? 'Erreur inconnue')
    }

    setLoading(false)
  }

  const handleClaimReward = async (questId: string): Promise<void> => {
    setClaimingQuestId(questId)

    const result = await claimQuestRewardAction(questId)

    if (result.success && result.quest != null) {
      // Update quest in list
      setQuests(prev =>
        prev.map(q => (q._id === questId ? result.quest! : q))
      )

      // Notify parent component
      if (onQuestComplete != null) {
        onQuestComplete()
      }
    } else {
      setError(result.error ?? 'Erreur lors de la réclamation')
    }

    setClaimingQuestId(null)
  }

  const getProgressPercentage = (quest: DailyQuest): number => {
    return Math.min((quest.currentProgress / quest.targetCount) * 100, 100)
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'bg-lochinvar-500'
      case 'medium':
        return 'bg-fuchsia-blue-500'
      case 'hard':
        return 'bg-moccaccino-500'
      default:
        return 'bg-gray-500'
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moccaccino-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des quêtes...</p>
        </div>
      </div>
    )
  }

  if (error != null) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <div className="mt-2">
          <Button onClick={loadQuests} size="sm" variant="primary">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Quêtes du Jour</h2>
        <Button onClick={loadQuests} size="sm" variant="ghost">
          🔄 Actualiser
        </Button>
      </div>

      {quests.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Aucune quête disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quests.map(quest => {
            const progressPercentage = getProgressPercentage(quest)
            const isCompleted = quest.status === 'completed'
            const canClaim = isCompleted && quest.currentProgress >= quest.targetCount

            return (
              <div
                key={quest._id}
                className={`
                  bg-white rounded-lg shadow-md p-6 border-2 transition-all
                  ${isCompleted ? 'border-lochinvar-500 bg-lochinvar-50' : 'border-gray-200'}
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800">{quest.title}</h3>
                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full text-white font-semibold
                          ${getDifficultyColor(quest.difficulty)}
                        `}
                      >
                        {getDifficultyLabel(quest.difficulty)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>

                  {isCompleted && (
                    <div className="text-3xl ml-4">✅</div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">
                      Progression: {quest.currentProgress} / {quest.targetCount}
                    </span>
                    <span className="text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getDifficultyColor(quest.difficulty)}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Rewards & Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">🪙</span>
                      <span className="font-bold text-yellow-600">+{quest.coinReward} Koins</span>
                    </div>
                    {(quest.xpReward ?? 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xl">⭐</span>
                        <span className="font-bold text-fuchsia-blue-600">+{quest.xpReward} XP</span>
                      </div>
                    )}
                  </div>

                  {canClaim && (
                    <Button
                      onClick={async () => { await handleClaimReward(quest._id) }}
                      size="sm"
                      variant="primary"
                      disabled={claimingQuestId === quest._id}
                    >
                      {claimingQuestId === quest._id ? '⏳ Réclamation...' : '🎁 Réclamer'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>Les quêtes se renouvellent à minuit 🌙</p>
      </div>
    </div>
  )
}


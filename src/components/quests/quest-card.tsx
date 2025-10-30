/**
 * Quest Card Component
 *
 * Presentation Layer: Compact quest display for dashboard
 *
 * Responsibilities:
 * - Display individual quest in compact format
 * - Show mini progress bar
 * - Indicate completion status
 *
 * Clean Architecture: Reusable UI component
 */

'use client'

import type { DailyQuest } from '@/types/quest'

interface QuestCardProps {
  quest: DailyQuest
  compact?: boolean
}

export default function QuestCard ({ quest, compact = false }: QuestCardProps): React.ReactNode {
  const progressPercentage = Math.min((quest.currentProgress / quest.targetCount) * 100, 100)
  const isCompleted = quest.status === 'completed'

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

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border ${isCompleted ? 'bg-lochinvar-50 border-lochinvar-300' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">{quest.title}</span>
          {isCompleted && <span className="text-lg">✅</span>}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
          <div
            className={`h-full transition-all duration-300 ${getDifficultyColor(quest.difficulty)}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{quest.currentProgress} / {quest.targetCount}</span>
          <span className="font-semibold text-yellow-600">+{quest.coinReward} 🪙</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${isCompleted ? 'bg-lochinvar-50 border-lochinvar-500' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-bold text-gray-800">{quest.title}</h4>
          <p className="text-sm text-gray-600">{quest.description}</p>
        </div>
        {isCompleted && <span className="text-2xl">✅</span>}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-semibold text-gray-700">
            {quest.currentProgress} / {quest.targetCount}
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

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <span>🪙</span>
          <span className="font-bold text-yellow-600">+{quest.coinReward}</span>
        </div>
        {(quest.xpReward ?? 0) > 0 && (
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span className="font-bold text-fuchsia-blue-600">+{quest.xpReward}</span>
          </div>
        )}
      </div>
    </div>
  )
}


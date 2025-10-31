/**
 * Composant pour afficher une quête quotidienne avec progression
 *
 * Presentation Layer: Carte de quête interactive avec animations
 *
 * Responsabilités :
 * - Afficher les détails d'une quête (titre, description, progression)
 * - Afficher une progress bar animée
 * - Afficher un badge "Complété" quand la quête est terminée
 * - Animation de complétion
 * - Bouton pour réclamer la récompense
 *
 * Architecture :
 * - SRP : Affichage d'une seule quête
 * - Utilise des animations CSS pour les transitions
 * - Callbacks pour les actions (claim reward)
 *
 * @example
 * ```tsx
 * <DailyQuestCard
 *   quest={quest}
 *   onClaimReward={handleClaim}
 * />
 * ```
 */

'use client'

import { useState } from 'react'
import type { DailyQuest } from '@/types/quest'
import TomatokenIcon from '@/components/tomatoken-icon'

interface DailyQuestCardProps {
  quest: DailyQuest
  onClaimReward?: (questId: string) => Promise<void>
}

/**
 * Obtient l'icône et la couleur selon le type de quête
 */
function getQuestIcon (type: string): { icon: React.ReactNode, color: string, bgColor: string } {
  const icons: Record<string, { icon: React.ReactNode, color: string, bgColor: string }> = {
    feed_monster: { icon: '🍖', color: 'text-moccaccino-600', bgColor: 'bg-moccaccino-100' },
    play_with_monster: { icon: '🎮', color: 'text-fuchsia-blue-600', bgColor: 'bg-fuchsia-blue-100' },
    level_up_monster: { icon: '⬆️', color: 'text-lochinvar-600', bgColor: 'bg-lochinvar-100' },
    buy_accessory: { icon: '🛍️', color: 'text-sunset-600', bgColor: 'bg-sunset-100' },
    equip_accessory: { icon: '👕', color: 'text-lavender-600', bgColor: 'bg-lavender-100' },
    visit_gallery: { icon: '🖼️', color: 'text-sky-600', bgColor: 'bg-sky-100' },
    earn_coins: { icon: <TomatokenIcon size='md' />, color: 'text-gold-600', bgColor: 'bg-gold-100' }
  }

  return icons[type] ?? { icon: '⭐', color: 'text-slate-600', bgColor: 'bg-slate-100' }
}

/**
 * Obtient le style selon la difficulté
 */
function getDifficultyStyle (difficulty: string): { label: string, color: string, bgColor: string } {
  const styles: Record<string, { label: string, color: string, bgColor: string }> = {
    easy: { label: 'Facile', color: 'text-meadow-700', bgColor: 'bg-meadow-100' },
    medium: { label: 'Moyen', color: 'text-sunset-700', bgColor: 'bg-sunset-100' },
    hard: { label: 'Difficile', color: 'text-moccaccino-700', bgColor: 'bg-moccaccino-100' }
  }

  return styles[difficulty] ?? { label: 'Normal', color: 'text-slate-700', bgColor: 'bg-slate-100' }
}

export function DailyQuestCard ({ quest, onClaimReward }: DailyQuestCardProps): React.ReactNode {
  const [isClaiming, setIsClaiming] = useState(false)
  const [showRewardAnimation, setShowRewardAnimation] = useState(false)

  const progress = Math.min((quest.currentProgress / quest.targetCount) * 100, 100)
  const isCompleted = quest.status === 'completed' || quest.status === 'claimed'
  const isExpired = quest.status === 'expired'
  const { icon, color, bgColor } = getQuestIcon(quest.type)
  const difficultyStyle = getDifficultyStyle(quest.difficulty)

  /**
   * Réclamer la récompense
   */
  const handleClaimReward = async (): Promise<void> => {
    if (isClaiming || !isCompleted || onClaimReward === undefined) return

    setIsClaiming(true)
    setShowRewardAnimation(true)

    try {
      await onClaimReward(quest._id)
    } catch (error) {
      console.error('Erreur lors de la réclamation:', error)
    } finally {
      setIsClaiming(false)
      setTimeout(() => {
        setShowRewardAnimation(false)
      }, 2000)
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white p-2 shadow-lg ring-1 transition-all duration-300 ${
        isCompleted
          ? 'ring-meadow-300 shadow-meadow-200/50'
          : isExpired
            ? 'ring-slate-200 opacity-60'
            : 'ring-slate-200 hover:shadow-xl hover:ring-lochinvar-300'
      }`}
    >
      {/* Badge "Complété" */}
      {isCompleted && (
        <div className='absolute -right-8 top-1.5 rotate-45 bg-meadow-500 px-10 py-0.5 text-xs font-bold text-white shadow-md'>
          ✓ Complété
        </div>
      )}

      {/* Badge "Expiré" */}
      {isExpired && (
        <div className='absolute -right-8 top-1.5 rotate-45 bg-slate-400 px-10 py-0.5 text-xs font-bold text-white shadow-md'>
          Expiré
        </div>
      )}

      {/* Animation de récompense */}
      {showRewardAnimation && (
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm'>
          <div className='animate-bounce flex items-center gap-2 text-4xl'>
            <TomatokenIcon size='3xl' /> +{quest.coinReward}
          </div>
        </div>
      )}

      {/* En-tête */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-start gap-2'>
          {/* Icône */}
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bgColor} text-lg`}>
            {icon}
          </div>

          {/* Titre et description */}
          <div className='flex-1'>
            <h3 className='font-semibold text-slate-800 text-sm'>{quest.title}</h3>
            <p className='text-xs text-slate-600 mt-0.5'>{quest.description}</p>

            {/* Badge difficulté */}
            <div className='mt-1 flex items-center gap-1.5'>
              <span className={`inline-flex items-center rounded-full ${difficultyStyle.bgColor} px-1.5 py-0.5 text-xs font-medium ${difficultyStyle.color}`}>
                {difficultyStyle.label}
              </span>
              {(quest.xpReward ?? 0) > 0 && (
                <span className='text-xs text-slate-500'>
                  +{quest.xpReward} XP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Récompense en coins */}
        <div className='flex items-center gap-1 rounded-lg bg-sunset-50 px-2 py-1 ring-1 ring-sunset-200'>
          <TomatokenIcon size='sm' />
          <span className='font-bold text-sunset-700 text-sm'>+{quest.coinReward}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className='mt-2'>
        <div className='flex items-center justify-between text-xs mb-1'>
          <span className='font-medium text-slate-700'>
            Progression
          </span>
          <span className={`font-bold ${isCompleted ? 'text-meadow-600' : 'text-slate-600'}`}>
            {quest.currentProgress} / {quest.targetCount}
          </span>
        </div>

        {/* Barre de progression */}
        <div className='relative h-2 overflow-hidden rounded-full bg-slate-100'>
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCompleted
                ? 'bg-gradient-to-r from-meadow-400 to-meadow-600'
                : 'bg-gradient-to-r from-lochinvar-400 to-lochinvar-600'
            }`}
            style={{ width: `${progress}%` }}
          >
            {/* Effet de brillance */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer' />
          </div>
        </div>

        {/* Pourcentage */}
        <div className='mt-0.5 text-right'>
          <span className='text-xs font-medium text-slate-500'>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Récompense et action */}
      <div className='mt-2 flex items-center justify-end gap-2'>
        {/* Bouton réclamer - seulement pour les quêtes 'completed', pas 'claimed' */}
        {quest.status === 'completed' && (
          <button
            onClick={handleClaimReward}
            disabled={isClaiming}
            className={`rounded-lg px-3 py-1 font-semibold text-xs shadow-md transition-all duration-200 ${
              isClaiming
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-meadow-500 to-meadow-600 text-white hover:from-meadow-600 hover:to-meadow-700 active:scale-95'
            }`}
          >
            {isClaiming ? (
              <span className='flex items-center gap-1.5'>
                <svg className='animate-spin h-3 w-3' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                </svg>
                Réclamation...
              </span>
            ) : (
              '🎁 Réclamer'
            )}
          </button>
        )}
      </div>
    </div>
  )
}


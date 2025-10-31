/**
 * PublicStatusToggle
 *
 * Presentation Layer: Toggle pour rendre un monstre public/privé
 *
 * Responsabilités:
 * - Afficher l'état actuel du statut public
 * - Permettre à l'utilisateur de basculer le statut
 * - Afficher un indicateur visuel de l'état
 * - Gérer les états de chargement et d'erreur
 *
 * Single Responsibility: Gérer l'interface utilisateur du toggle public/privé
 */

'use client'

import { useState, useTransition } from 'react'
import { toggleMonsterPublicStatus } from '@/actions/monsters'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

/**
 * Props pour le composant PublicStatusToggle
 */
interface PublicStatusToggleProps {
  /** Identifiant du monstre */
  monsterId: string
  /** État initial du statut public */
  initialIsPublic: boolean
}

/**
 * Composant toggle pour le statut public d'un monstre
 *
 * Permet à l'utilisateur de rendre son monstre public (visible par tous)
 * ou privé (visible uniquement par le propriétaire).
 *
 * Applique les principes SOLID:
 * - SRP: Gère uniquement l'interface du toggle public/privé
 * - DIP: Dépend de l'abstraction (action serveur)
 *
 * @param {PublicStatusToggleProps} props - Props du composant
 * @returns {React.ReactNode} Interface du toggle
 *
 * @example
 * <PublicStatusToggle monsterId="123" initialIsPublic={false} />
 */
export function PublicStatusToggle ({ monsterId, initialIsPublic }: PublicStatusToggleProps): React.ReactNode {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  /**
   * Gère le changement de statut public
   */
  const handleToggle = (): void => {
    startTransition(() => {
      void (async () => {
        setError(null)
        const result = await toggleMonsterPublicStatus(monsterId)

        if (result.success && result.isPublic !== undefined) {
          showSuccessToast(
            result.isPublic
              ? 'Ton monstre est maintenant visible publiquement ! 🌍'
              : 'Ton monstre est maintenant privé 🔒'
          )
          setIsPublic(result.isPublic)
          const errorMsg = result.error ?? 'Une erreur est survenue'
          setError(errorMsg)
          showErrorToast(errorMsg)
          setError(result.error ?? 'Une erreur est survenue')
          // Revert optimistic update if failed
          setTimeout(() => {
            setError(null)
          }, 3000)
        }
      })()
    })
  }

  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-white to-lavender-50 p-6 shadow-xl border-4 border-white/90'>
      {/* Motif décoratif */}
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl' aria-hidden='true' />

      <div className='relative flex items-center justify-between gap-4'>
        <div className='flex-1'>
          {/* En-tête avec icône */}
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-lavender-500 shadow-lg border-2 border-white text-lg'>
              {isPublic ? '🌍' : '🔒'}
            </div>
            <h3 className='text-lg font-black text-forest-800'>
              Visibilité
            </h3>
          </div>

          <p className='text-sm text-forest-600 font-medium ml-13'>
            {isPublic
              ? 'Ton monstre est visible publiquement'
              : 'Ton monstre est privé'}
          </p>
          {error !== null && (
            <p className='text-xs text-sunset-600 font-bold mt-2 ml-13'>
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Toggle Switch amélioré */}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`
            relative inline-flex h-10 w-20 items-center rounded-2xl
            transition-all duration-300 ease-in-out shadow-lg
            focus:outline-none focus:ring-4 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/60
            ${isPublic 
              ? 'bg-gradient-to-r from-meadow-400 to-forest-500 focus:ring-meadow-300' 
              : 'bg-gradient-to-r from-gray-300 to-gray-400 focus:ring-gray-300'
            }
          `}
          aria-label={isPublic ? 'Rendre privé' : 'Rendre public'}
        >
          <span
            className={`
              inline-block h-7 w-7 transform rounded-xl bg-white shadow-lg
              transition-all duration-300 ease-in-out
              flex items-center justify-center font-bold text-xs
              ${isPublic ? 'translate-x-11' : 'translate-x-1'}
            `}
          >
            {isPending ? '⏳' : (isPublic ? '✓' : '✕')}
          </span>
        </button>
      </div>
    </div>
  )
}


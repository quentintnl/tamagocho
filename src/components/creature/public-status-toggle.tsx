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
    <div className='bg-white rounded-2xl shadow-md p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <h3 className='text-lg font-bold text-gray-900 mb-1'>
            Visibilité
          </h3>
          <p className='text-sm text-gray-600'>
            {isPublic
              ? 'Votre monstre est visible publiquement'
              : 'Votre monstre est privé'}
          </p>
          {error !== null && (
            <p className='text-sm text-moccaccino-600 mt-1'>
              {error}
            </p>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {/* Indicateur visuel */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>
              {isPublic ? 'Public' : 'Privé'}
            </span>
            {isPublic && (
              <svg
                className='w-5 h-5 text-lochinvar-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            )}
            {!isPublic && (
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            )}
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`
              relative inline-flex h-8 w-14 items-center rounded-full
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-lochinvar-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isPublic ? 'bg-lochinvar-500' : 'bg-gray-300'}
            `}
            aria-label={isPublic ? 'Rendre privé' : 'Rendre public'}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white
                transition-transform duration-300 ease-in-out
                ${isPublic ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Description supplémentaire */}
      <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
        <p className='text-xs text-gray-600'>
          {isPublic ? (
            <>
              <strong className='text-lochinvar-700'>Mode public :</strong> Les autres utilisateurs peuvent voir votre monstre
              dans la liste publique. Vos statistiques et traits sont visibles.
            </>
          ) : (
            <>
              <strong className='text-gray-700'>Mode privé :</strong> Seul vous pouvez voir ce monstre.
              Il n&apos;apparaîtra pas dans les listes publiques.
            </>
          )}
        </p>
      </div>
    </div>
  )
}


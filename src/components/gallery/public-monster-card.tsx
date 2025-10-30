/**
 * PublicMonsterCard
 *
 * Presentation Layer: Carte d'affichage pour un monstre public dans la galerie
 *
 * Responsabilités:
 * - Afficher les informations d'un monstre public
 * - Afficher le nom du créateur
 * - Afficher les badges de niveau et d'état
 * - Rendre la carte cliquable pour voir les détails
 *
 * Single Responsibility: Représentation visuelle d'un monstre public
 */

'use client'

import { PixelMonster } from '@/components/monsters'
import { MonsterStateBadge, isMonsterState } from '@/components/monsters/monster-state-badge'
import { parseMonsterTraits, formatAdoptionDate } from '@/lib/utils'
import type { PublicMonsterWithOwner } from '@/actions/monsters'

/**
 * Props pour le composant PublicMonsterCard
 */
interface PublicMonsterCardProps {
  /** Données du monstre public */
  monster: PublicMonsterWithOwner
}

/**
 * Carte d'affichage d'un monstre public dans la galerie communautaire
 *
 * Similaire à MonsterCard mais optimisé pour l'affichage public avec
 * le nom du créateur et sans lien de gestion.
 *
 * Applique les principes SOLID:
 * - SRP: Affichage uniquement des informations publiques d'un monstre
 * - DIP: Dépend des abstractions (types, utilitaires)
 *
 * @param {PublicMonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de monstre public
 *
 * @example
 * <PublicMonsterCard monster={monsterData} />
 */
export function PublicMonsterCard ({ monster }: PublicMonsterCardProps): React.ReactNode {
  // Parsing des traits et normalisation des données
  const traits = parseMonsterTraits(monster.traits)
  const adoptionDate = formatAdoptionDate(String(monster.createdAt))
  const levelLabel = monster.level_id.level ?? 1
  const state = isMonsterState(monster.state) ? monster.state : 'happy'

  return (
    <article
      className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white to-lochinvar-50/40 p-6 shadow-[0_20px_54px_rgba(70,144,134,0.12)] ring-2 ring-lochinvar-200/60 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(70,144,134,0.18)] hover:ring-lochinvar-300/70'
    >
      {/* Bulles décoratives */}
      <div
        className='pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-fuchsia-blue-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-70'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-lochinvar-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-70'
        aria-hidden='true'
      />

      {/* Badge Public - Position absolue en haut à droite */}
      <div className='absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-lochinvar-500/95 px-3 py-1.5 shadow-lg backdrop-blur-sm'>
        <svg
          className='h-3.5 w-3.5 text-white'
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
        <span className='text-xs font-semibold text-white'>Public</span>
      </div>

      <div className='relative flex flex-col gap-5'>
        {/* Zone de rendu du monstre */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-lochinvar-50/50 to-fuchsia-blue-50/50 p-4 ring-1 ring-lochinvar-200/50 shadow-inner'>
          {traits !== null && (
            <PixelMonster
              traits={traits}
              state={state}
              level={levelLabel}
            />
          )}
          <MonsterStateBadge state={monster.state} />
        </div>

        {/* Informations textuelles */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1 flex-1'>
              <h3 className='text-lg font-semibold text-gray-900 sm:text-xl'>{monster.name}</h3>
              <p className='text-xs text-lochinvar-600 font-medium'>
                👤 Par {monster.ownerName}
              </p>
              {adoptionDate !== null && (
                <p className='text-xs text-gray-500'>🌱 Créé le {adoptionDate}</p>
              )}
            </div>
            <span className='inline-flex items-center gap-1 rounded-full bg-fuchsia-blue-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fuchsia-blue-700 shadow-md whitespace-nowrap'>
              <span aria-hidden='true'>⭐</span>
              Niv. {levelLabel}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}


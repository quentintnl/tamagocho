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
    const levelLabel = monster.level_id?.level ?? 1
  const state = isMonsterState(monster.state) ? monster.state : 'happy'

  return (
    <article
      className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white via-lavender-50/30 to-fuchsia-blue-50/40 p-6 shadow-xl border-4 border-white/90 backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-lavender-200/80 hover:scale-[1.02]'
    >
      {/* Motifs décoratifs animés - thème nature */}
      <div
        className='pointer-events-none absolute -right-12 top-16 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-blue-200/40 to-lavender-200/30 blur-2xl transition-all duration-500 group-hover:opacity-80 group-hover:scale-110'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-tr from-sky-200/30 to-meadow-200/20 blur-2xl transition-all duration-500 group-hover:opacity-80 group-hover:scale-110'
        aria-hidden='true'
      />

      {/* Badge Public - Position absolue en haut à droite */}
      <div className='absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-lavender-500 to-fuchsia-blue-500 px-3 py-1.5 shadow-lg backdrop-blur-sm border-2 border-white/60'>
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
        <span className='text-xs font-bold text-white'>Public</span>
      </div>

      <div className='relative flex flex-col gap-5'>
        {/* Zone de rendu du monstre avec effet de relief */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-50 via-white to-fuchsia-blue-50 p-6 border-3 border-lavender-200/50 shadow-inner group-hover:shadow-lg transition-all'>
          {/* Petit effet de brillance */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          {traits !== null && (
            <div className='relative transform group-hover:scale-110 transition-transform duration-300'>
              <PixelMonster
                traits={traits}
                state={state}
                level={levelLabel}
              />
            </div>
          )}
          <MonsterStateBadge state={monster.state} />
        </div>

        {/* Informations textuelles avec meilleur contraste */}
        <div className='flex flex-col gap-4'>
          {/* Nom, créateur et niveau */}
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 space-y-2'>
              <h3 className='text-xl font-black text-forest-800 leading-tight group-hover:text-lavender-700 transition-colors'>{monster.name}</h3>

              {/* Badge du créateur */}
              <div className='flex items-center gap-1.5 text-xs'>
                <div className='flex items-center gap-1.5 bg-lavender-100 rounded-full px-3 py-1 border-2 border-lavender-200/60'>
                  <span className='text-sm'>👤</span>
                  <span className='font-bold text-lavender-700'>Par {monster.ownerName}</span>
                </div>
              </div>

              {adoptionDate !== null && (
                <div className='flex items-center gap-1.5 text-xs text-forest-600'>
                  <span className='text-sm'>🌱</span>
                  <span className='font-medium'>Créé le {adoptionDate}</span>
                </div>
              )}
            </div>
            <div className='flex-shrink-0'>
              <span className='inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-gold-400 to-sunset-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg border-2 border-white/60 group-hover:scale-110 transition-transform'>
                <span aria-hidden='true' className='text-sm'>⭐</span>
                Niv. {levelLabel}
              </span>
            </div>
          </div>

          {/* Barre de progression visuelle décorative */}
          <div className='flex gap-1'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < levelLabel
                    ? 'bg-gradient-to-r from-lavender-400 to-fuchsia-blue-500 shadow-sm'
                    : 'bg-lavender-100/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Effet de lueur au survol */}
      <div className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-lavender-100/20 via-transparent to-transparent' />
    </article>
  )
}


import { memo } from 'react'
import Link from 'next/link'
import { PixelMonster } from '@/components/monsters'
import { MonsterStateBadge, isMonsterState } from './monster-state-badge'
import type { MonsterState } from '@/types/monster'
import type { OwnedAccessory } from '@/types/accessory'
import { parseMonsterTraits, formatAdoptionDate } from '@/lib/utils'

/**
 * Props pour le composant MonsterCard
 */
interface MonsterCardProps {
  /** Identifiant unique du monstre */
  id: string
  /** Nom du monstre */
  name: string
  /** Traits visuels du monstre (JSON stringifié) */
  traits: string
  /** État/humeur actuel du monstre */
  state: MonsterState | string | null | undefined
  /** Niveau du monstre */
  level: number | null | undefined
  /** Date de création du monstre */
  createdAt: string | undefined
  /** Date de dernière mise à jour du monstre */
  updatedAt: string | undefined
  /** Statut de visibilité publique du monstre */
  isPublic?: boolean
  /** Accessoires équipés sur le monstre */
  equippedAccessories?: OwnedAccessory[]
}

/**
 * Carte d'affichage d'un monstre individuel
 *
 * Responsabilité unique : afficher les informations visuelles
 * et textuelles d'un monstre dans un format carte cliquable.
 *
 * Applique SRP en déléguant :
 * - Le rendu du monstre à PixelMonster
 * - L'affichage de l'état à MonsterStateBadge
 * - Le parsing des traits à parseMonsterTraits
 * - Le formatage de la date à formatAdoptionDate
 *
 * Optimisé avec React.memo pour éviter les re-rendus inutiles
 * lorsque les props ne changent pas.
 *
 * @param {MonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de monstre interactive
 *
 * @example
 * <MonsterCard
 *   id="123"
 *   name="Pikachu"
 *   traits='{"bodyColor": "#FFB5E8"}'
 *   state="happy"
 *   level={5}
 *   createdAt="2025-10-27T10:00:00Z"
 *   updatedAt="2025-10-27T12:00:00Z"
 * />
 */
export const MonsterCard = memo(function MonsterCard ({
  id,
  name,
  traits: rawTraits,
  state,
  level,
  createdAt,
  updatedAt,
  isPublic = false,
  equippedAccessories = []
}: MonsterCardProps): React.ReactNode {
  // Parsing des traits et normalisation des données
  const traits = parseMonsterTraits(rawTraits)
  const adoptionDate = formatAdoptionDate(String(createdAt) ?? String(updatedAt))
  const levelLabel = level ?? 1

  return (
    <Link href={`/creature/${id}`} prefetch>
      <article
        className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/30 to-meadow-50/40 p-6 shadow-xl border-4 border-white/90 backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-meadow-200/80 hover:scale-[1.02]'
      >
        {/* Badge Public - Position absolue en haut à droite */}
        {isPublic && (
          <div className='absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-meadow-500 to-forest-500 px-3 py-1.5 shadow-lg backdrop-blur-sm border-2 border-white/60'>
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
        )}

        {/* Motifs décoratifs animés - thème nature */}
        <div
          className='pointer-events-none absolute -right-12 top-16 h-32 w-32 rounded-full bg-gradient-to-br from-lavender-200/40 to-sky-200/30 blur-2xl transition-all duration-500 group-hover:opacity-80 group-hover:scale-110'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-tr from-sunset-200/30 to-gold-200/20 blur-2xl transition-all duration-500 group-hover:opacity-80 group-hover:scale-110'
          aria-hidden='true'
        />

        <div className='relative flex flex-col gap-5'>
          {/* Zone de rendu du monstre avec effet de relief */}
          <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50 via-white to-sky-50 p-6 border-3 border-meadow-200/50 shadow-inner group-hover:shadow-lg transition-all'>
            {/* Petit effet de brillance */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            {traits !== null && (
              <div className='relative transform group-hover:scale-110 transition-transform duration-300'>
                <PixelMonster
                  traits={traits}
                  state={isMonsterState(state) ? state : 'happy'}
                  level={levelLabel}
                  equippedAccessories={equippedAccessories}
                />
              </div>
            )}
            <MonsterStateBadge state={state} />
          </div>

          {/* Informations textuelles avec meilleur contraste */}
          <div className='flex flex-col gap-4'>
            {/* Nom et niveau */}
            <div className='flex items-start justify-between gap-3'>
              <div className='flex-1 space-y-2'>
                <h3 className='text-xl font-black text-forest-800 leading-tight group-hover:text-meadow-700 transition-colors'>{name}</h3>
                {adoptionDate !== null && (
                  <div className='flex items-center gap-1.5 text-xs text-forest-600'>
                    <span className='text-sm'>🌱</span>
                    <span className='font-medium'>Arrivé le {adoptionDate}</span>
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
                      ? 'bg-gradient-to-r from-meadow-400 to-forest-500 shadow-sm'
                      : 'bg-forest-100/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Effet de lueur au survol */}
        <div className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-meadow-100/20 via-transparent to-transparent' />
      </article>
    </Link>
  )
})

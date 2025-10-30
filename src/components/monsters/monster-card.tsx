import Link from 'next/link'
import { PixelMonster } from '@/components/monsters'
import { MonsterStateBadge, isMonsterState } from './monster-state-badge'
import type { MonsterState } from '@/types/monster'
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
export function MonsterCard ({
  id,
  name,
  traits: rawTraits,
  state,
  level,
  createdAt,
  updatedAt
}: MonsterCardProps): React.ReactNode {
  // Parsing des traits et normalisation des données
  const traits = parseMonsterTraits(rawTraits)
  const adoptionDate = formatAdoptionDate(String(createdAt) ?? String(updatedAt))
  const levelLabel = level ?? 1

  return (
    <Link href={`/creature/${id}`}>
      <article
        className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white to-meadow-50/60 p-6 shadow-[0_20px_54px_rgba(22,101,52,0.12)] ring-2 ring-meadow-200/60 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(22,101,52,0.18)] hover:ring-meadow-300/70'
      >
        {/* Bulles décoratives - thème nature */}
        <div
          className='pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-lavender-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-70'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-sky-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-70'
          aria-hidden='true'
        />

        <div className='relative flex flex-col gap-5'>
          {/* Zone de rendu du monstre */}
          <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50/50 to-sky-50/50 p-4 ring-1 ring-meadow-200/50 shadow-inner'>
            {traits !== null && (
              <PixelMonster
                traits={traits}
                state={isMonsterState(state) ? state : 'happy'}
                level={levelLabel}
              />
            )}
            <MonsterStateBadge state={state} />
          </div>

          {/* Informations textuelles */}
          <div className='flex flex-1 flex-col gap-4'>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1'>
                <h3 className='text-lg font-semibold text-forest-800 sm:text-xl'>{name}</h3>
                {adoptionDate !== null && (
                  <p className='text-xs text-forest-500'>🌱 Arrivé le {adoptionDate}</p>
                )}
              </div>
              <span className='inline-flex items-center gap-1 rounded-full bg-sunset-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sunset-700 shadow-md'>
                <span aria-hidden='true'>⭐</span>
                Niveau {levelLabel}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

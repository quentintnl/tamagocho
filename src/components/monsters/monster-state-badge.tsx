import {
  MONSTER_STATES,
  type MonsterState,
  DEFAULT_MONSTER_STATE
} from '@/types/monster'

/**
 * Mapping des états vers leurs labels français
 */
const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

/**
 * Mapping des états vers leurs classes CSS de badge
 */
const STATE_BADGE_CLASSES: Record<MonsterState, string> = {
  happy: 'bg-lochinvar-100 text-lochinvar-700 ring-1 ring-inset ring-lochinvar-200',
  sad: 'bg-fuchsia-blue-100 text-fuchsia-blue-700 ring-1 ring-inset ring-fuchsia-blue-200',
  angry: 'bg-moccaccino-100 text-moccaccino-600 ring-1 ring-inset ring-moccaccino-200',
  hungry: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
  sleepy: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
}

/**
 * Mapping des états vers leurs emojis
 */
const MONSTER_STATE_EMOJI: Record<MonsterState, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
}

/**
 * Type guard pour vérifier si une valeur est un MonsterState valide
 *
 * @param {MonsterState | string | null | undefined} value - Valeur à vérifier
 * @returns {boolean} True si la valeur est un MonsterState valide
 */
export const isMonsterState = (
  value: MonsterState | string | null | undefined
): value is MonsterState => (
  typeof value === 'string' && MONSTER_STATES.includes(value as MonsterState)
)

/**
 * Props pour le composant MonsterStateBadge
 */
interface MonsterStateBadgeProps {
  /** État du monstre (peut être invalide, sera normalisé) */
  state: MonsterState | string | null | undefined
}

/**
 * Badge d'affichage de l'état/humeur d'un monstre
 *
 * Responsabilité unique : afficher visuellement l'état émotionnel
 * d'un monstre avec emoji et label.
 *
 * @param {MonsterStateBadgeProps} props - Props du composant
 * @returns {React.ReactNode} Badge stylisé selon l'état
 *
 * @example
 * <MonsterStateBadge state="happy" />
 * // Badge vert "😄 Heureux"
 */
export function MonsterStateBadge ({ state }: MonsterStateBadgeProps): React.ReactNode {
  // Normalisation de l'état : utilise DEFAULT si invalide
  const normalizedState = isMonsterState(state) ? state : DEFAULT_MONSTER_STATE

  return (
    <span
      className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATE_BADGE_CLASSES[normalizedState]}`}
    >
      <span aria-hidden='true'>{MONSTER_STATE_EMOJI[normalizedState]}</span>
      {MONSTER_STATE_LABELS[normalizedState]}
    </span>
  )
}

import { AnimatedMonster, MonsterActions } from '@/components/monsters'
import type { MonsterTraits, MonsterState } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { getStateLabel } from '@/lib/utils'

/**
 * Props pour le composant CreatureMonsterDisplay
 */
interface CreatureMonsterDisplayProps {
  /** Traits visuels du monstre */
  traits: MonsterTraits
  /** État actuel du monstre */
  state: MonsterState
  /** Niveau du monstre */
  level: number
  /** Action actuellement en cours */
  currentAction: MonsterAction
  /** Callback appelé lors d'une action */
  onAction: (action: MonsterAction) => void
}

/**
 * Panneau d'affichage du monstre animé avec actions
 *
 * Responsabilité unique : orchestrer l'affichage du monstre animé,
 * de son état actuel et des actions disponibles.
 *
 * Applique SRP en déléguant :
 * - Le rendu du monstre à AnimatedMonster
 * - Les actions à MonsterActions
 *
 * @param {CreatureMonsterDisplayProps} props - Props du composant
 * @returns {React.ReactNode} Panneau avec monstre et actions
 *
 * @example
 * <CreatureMonsterDisplay
 *   traits={traits}
 *   state="happy"
 *   level={5}
 *   currentAction={null}
 *   onAction={handleAction}
 * />
 */
export function CreatureMonsterDisplay ({
  traits,
  state,
  level,
  currentAction,
  onAction
}: CreatureMonsterDisplayProps): React.ReactNode {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-4 border-lochinvar-200'>
      {/* Zone d'affichage du monstre animé */}
      <div className='aspect-square max-w-md mx-auto'>
        <AnimatedMonster
          state={state}
          traits={traits}
          level={level}
          currentAction={currentAction}
        />
      </div>

      {/* Badge d'état du monstre */}
      <div className='mt-6 text-center'>
        <div className='inline-block bg-gradient-to-r from-moccaccino-100 to-fuchsia-blue-100 px-6 py-3 rounded-full border-2 border-moccaccino-300'>
          <p className='text-sm font-semibold text-moccaccino-700 uppercase tracking-wide'>
            État: <span className='text-fuchsia-blue-700'>{getStateLabel(state)}</span>
          </p>
        </div>
      </div>

      {/* Actions disponibles */}
      <MonsterActions onAction={onAction} />
    </div>
  )
}

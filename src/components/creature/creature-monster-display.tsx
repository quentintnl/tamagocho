import { AnimatedMonster, MonsterActions } from '@/components/monsters'
import type { MonsterTraits, MonsterState } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import type { OwnedAccessory } from '@/types/accessory'
import { getStateLabel } from '@/lib/utils'

/**
 * Props pour le composant CreatureMonsterDisplay
 */
interface CreatureMonsterDisplayProps {
  /** Nom du monstre */
  name: string
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
  /** ID du monstre */
  monsterId: string
  /** Callback appelé après l'action pour rafraîchir les données */
  onActionComplete?: () => void
  /** Accessoires équipés sur le monstre */
  equippedAccessories?: OwnedAccessory[]
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
  name,
  traits,
  state,
  level,
  currentAction,
  onAction,
  monsterId,
  onActionComplete,
  equippedAccessories = []
}: CreatureMonsterDisplayProps): React.ReactNode {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/30 to-meadow-50/40 p-8 shadow-xl border-4 border-white/90 backdrop-blur'>
      {/* Motifs décoratifs animés */}
      <div className='absolute -right-12 top-16 h-32 w-32 rounded-full bg-gradient-to-br from-lavender-200/40 to-sky-200/30 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-tr from-sunset-200/30 to-gold-200/20 blur-2xl' aria-hidden='true' />

      {/* Nom du monstre en en-tête */}
      <div className='relative mb-6 text-center'>
        <h1 className='text-3xl sm:text-4xl font-black text-forest-800 leading-tight'>
          {name}
          <span className='ml-3 inline-block text-2xl' style={{ animation: 'bounce 2s infinite' }}>✨</span>
        </h1>
      </div>

      {/* Zone d'affichage du monstre animé */}
      <div className='relative aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-meadow-50 via-white to-sky-50 p-6 border-3 border-meadow-200/50 shadow-inner'>
        {/* Petit effet de brillance */}
        <div className='absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent rounded-3xl' />

        <div className='relative'>
          <AnimatedMonster
            state={state}
            traits={traits}
            level={level}
            currentAction={currentAction}
            equippedAccessories={equippedAccessories}
          />
        </div>
      </div>

      {/* Badge d'état du monstre */}
      <div className='relative mt-6 text-center'>
        <div className='inline-flex items-center gap-2 bg-gradient-to-r from-lavender-100 via-white to-fuchsia-blue-100 px-6 py-3 rounded-2xl border-2 border-lavender-200/60 shadow-md'>
          <span className='text-lg'>💫</span>
          <p className='text-sm font-black text-forest-800 uppercase tracking-wide'>
            État: <span className='text-lavender-700'>{getStateLabel(state)}</span>
          </p>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className='relative mt-6'>
        <MonsterActions onAction={onAction} monsterId={monsterId} onActionComplete={onActionComplete} />
      </div>
    </div>
  )
}

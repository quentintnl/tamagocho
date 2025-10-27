'use client'

import { PixelMonster } from '@/components/monsters/pixel-monster'
import type { MonsterTraits, MonsterState } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'

/**
 * Props pour le composant AnimatedMonster
 */
interface AnimatedMonsterProps {
  /** État/humeur actuel du monstre */
  state: MonsterState
  /** Traits visuels du monstre */
  traits: MonsterTraits
  /** Niveau du monstre */
  level: number
  /** Action actuellement en cours (optionnel) */
  currentAction?: MonsterAction
}

/**
 * Wrapper pour le rendu d'un monstre animé
 *
 * Responsabilité unique : wrapper le composant PixelMonster
 * en gérant le conteneur overflow pour permettre les animations
 * qui dépassent les limites du canvas.
 *
 * Ce composant sert d'adaptateur entre l'API de haut niveau
 * et le composant de rendu Canvas bas niveau.
 *
 * @param {AnimatedMonsterProps} props - Props du composant
 * @returns {React.ReactNode} Monstre animé dans son conteneur
 *
 * @example
 * <AnimatedMonster
 *   state="happy"
 *   traits={monsterTraits}
 *   level={5}
 *   currentAction="feed"
 * />
 */
export function AnimatedMonster ({
  state,
  traits,
  level,
  currentAction
}: AnimatedMonsterProps): React.ReactNode {
  return (
    <div className='relative overflow-visible'>
      <PixelMonster
        state={state}
        traits={traits}
        level={level}
        currentAction={currentAction}
      />
    </div>
  )
}

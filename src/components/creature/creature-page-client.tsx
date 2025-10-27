'use client'

import { useState } from 'react'
import type { MonsterTraits, DBMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureHeader } from './creature-header'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { CreatureTraitsPanel } from './creature-traits-panel'
import { CreatureColorsPanel } from './creature-colors-panel'

/**
 * Props pour le composant CreaturePageClient
 */
interface CreaturePageClientProps {
  /** Données du monstre à afficher */
  monster: DBMonster
}

/**
 * Composant client de la page de détail d'une créature
 *
 * Responsabilité unique : orchestrer l'affichage de toutes les sections
 * de la page de détail (header, monstre animé, stats, traits, couleurs).
 *
 * Applique les principes SOLID :
 * - SRP : Délègue chaque section à un composant spécialisé
 * - OCP : Extensible via l'ajout de nouveaux panneaux
 * - DIP : Dépend des abstractions (types, interfaces)
 *
 * @param {CreaturePageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de détail de la créature
 *
 * @example
 * <CreaturePageClient monster={monsterData} />
 */
export function CreaturePageClient ({ monster }: CreaturePageClientProps): React.ReactNode {
  const [currentAction, setCurrentAction] = useState<MonsterAction>(null)

  // Parse des traits depuis le JSON stocké en base
  const traits: MonsterTraits = parseMonsterTraits(monster.traits) ?? {
    bodyColor: '#FFB5E8',
    accentColor: '#FF9CEE',
    eyeColor: '#2C2C2C',
    antennaColor: '#FFE66D',
    bobbleColor: '#FFE66D',
    cheekColor: '#FFB5D5',
    bodyStyle: 'round',
    eyeStyle: 'big',
    antennaStyle: 'single',
    accessory: 'none'
  }

  /**
   * Gère le déclenchement d'une action sur le monstre
   * @param {MonsterAction} action - Action déclenchée
   */
  const handleAction = (action: MonsterAction): void => {
    setCurrentAction(action)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* En-tête avec nom et niveau */}
        <CreatureHeader name={monster.name} level={monster.level} />

        {/* Grille principale : monstre + informations */}
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Colonne gauche : Monstre animé et actions */}
          <CreatureMonsterDisplay
            traits={traits}
            state={monster.state}
            level={monster.level}
            currentAction={currentAction}
            onAction={handleAction}
          />

          {/* Colonne droite : Panneaux d'informations */}
          <div className='space-y-6'>
            <CreatureStatsPanel
              level={monster.level}
              state={monster.state}
              createdAt={monster.createdAt}
              updatedAt={monster.updatedAt}
            />
            <CreatureTraitsPanel traits={traits} />
            <CreatureColorsPanel traits={traits} />
          </div>
        </div>
      </div>
    </div>
  )
}

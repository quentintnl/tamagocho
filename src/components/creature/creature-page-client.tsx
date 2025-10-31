'use client'

import { useState } from 'react'
import type { MonsterTraits, PopulatedMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { OwnedAccessoriesManager } from './owned-accessories-manager'
import { PublicStatusToggle } from './public-status-toggle'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { useMonsterData, useMonsterAccessories, useAutoStateChange } from '@/hooks/monsters'

/**
 * Props pour le composant CreaturePageClient
 */
interface CreaturePageClientProps {
  /** Données du monstre à afficher */
  monster: PopulatedMonster
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
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Hooks personnalisés pour la gestion de l'état
  const { currentMonster, xpToNextLevel, refreshMonster } = useMonsterData(monster)
  const { equippedAccessories, ownedAccessoryIds, refreshAccessories } = useMonsterAccessories(monster._id)

  // Hook pour le changement automatique d'état toutes les 10 secondes
  useAutoStateChange(monster._id, refreshMonster)

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
     *
     * @param {MonsterAction} action - Action déclenchée
     */
  const handleAction = (action: MonsterAction): void => {
    setCurrentAction(action)
  }

  /**
     * Rafraîchit toutes les données après une action
     * Combine le rafraîchissement du monstre et des accessoires
     */
  const handleActionComplete = async (): Promise<void> => {
    await Promise.all([
      refreshMonster(),
      refreshAccessories()
    ])
  }

  /**
     * Rafraîchit les accessoires après un achat ou un changement
     * Incrémente le trigger pour forcer le rafraîchissement du OwnedAccessoriesManager
     */
  const handleAccessoriesRefresh = async (): Promise<void> => {
    await refreshAccessories()
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100'>
      {/* Header avec wallet et bouton retour */}
      <PageHeaderWithWallet />

      {/* Motifs décoratifs de fond animés - thème fruits & légumes */}
      <div className='pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-sunset-200/40 via-gold-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '8s' }} />
      <div className='pointer-events-none absolute -left-24 bottom-40 h-96 w-96 rounded-full bg-gradient-to-tr from-meadow-200/50 via-forest-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '10s' }} />
      <div className='pointer-events-none absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-gradient-to-bl from-lavender-200/40 via-sky-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '12s' }} />

      <div className='relative z-10 py-12'>
        <div className='container mx-auto px-4 max-w-6xl'>

          {/* Grille principale : monstre + informations */}
          <div className='grid lg:grid-cols-2 gap-6'>
            {/* Colonne gauche : Monstre animé, actions et visibilité */}
            <div className='space-y-6'>
              <CreatureMonsterDisplay
                name={currentMonster.name}
                traits={traits}
                state={currentMonster.state}
                level={currentMonster.level_id?.level ?? 1}
                currentAction={currentAction}
                onAction={handleAction}
                monsterId={currentMonster._id}
                onActionComplete={handleActionComplete}
                equippedAccessories={equippedAccessories}
              />
              <PublicStatusToggle
                monsterId={currentMonster._id}
                initialIsPublic={currentMonster.isPublic ?? false}
              />
            </div>

            {/* Colonne droite : Panneaux d'informations */}
            <div className='space-y-6'>
              <CreatureStatsPanel
                level={currentMonster.level_id?.level ?? 1}
                xp={currentMonster.xp}
                xpToNextLevel={xpToNextLevel}
                isMaxLevel={currentMonster.level_id?.isMaxLevel ?? false}
                state={currentMonster.state}
                createdAt={currentMonster.createdAt}
                updatedAt={currentMonster.updatedAt}
              />
              <OwnedAccessoriesManager
                monsterId={currentMonster._id}
                equippedAccessories={equippedAccessories}
                onAccessoryChange={handleAccessoriesRefresh}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

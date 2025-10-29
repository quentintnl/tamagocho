'use client'

import { useState } from 'react'
import type { MonsterTraits, PopulatedMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureHeader } from './creature-header'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { CreatureTraitsPanel } from './creature-traits-panel'
import { AccessoryShop } from './accessory-shop'
import { OwnedAccessoriesManager } from './owned-accessories-manager'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { getAvailableAccessories } from '@/services/accessory.service'
import { useMonsterData, useMonsterAccessories } from '@/hooks/monsters'

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

    // Hooks personnalisés pour la gestion de l'état
    const { currentMonster, xpToNextLevel, refreshMonster } = useMonsterData(monster)
    const { equippedAccessories, ownedAccessoryIds, refreshAccessories } = useMonsterAccessories(monster._id)

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

    return (
        <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50'>
            {/* Header avec wallet et bouton retour */}
            <PageHeaderWithWallet
                showBackButton={true}
                backUrl='/dashboard'
            />

            <div className='py-12'>
                <div className='container mx-auto px-4 max-w-4xl'>
                    {/* En-tête avec nom et niveau */}
                    <CreatureHeader name={currentMonster.name} level={currentMonster.level_id.level} />

                {/* Grille principale : monstre + informations */}
                <div className='grid md:grid-cols-2 gap-8'>
                    {/* Colonne gauche : Monstre animé et actions */}
                    <CreatureMonsterDisplay
                        traits={traits}
                        state={currentMonster.state}
                        level={currentMonster.level_id.level}
                        currentAction={currentAction}
                        onAction={handleAction}
                        monsterId={currentMonster._id}
                        onActionComplete={handleActionComplete}
                        equippedAccessories={equippedAccessories}
                    />

                    {/* Colonne droite : Panneaux d'informations */}
                    <div className='space-y-6'>
                        <CreatureStatsPanel
                            level={currentMonster.level_id.level}
                            xp={currentMonster.xp}
                            xpToNextLevel={xpToNextLevel}
                            isMaxLevel={currentMonster.level_id.isMaxLevel}
                            state={currentMonster.state}
                            createdAt={currentMonster.createdAt}
                            updatedAt={currentMonster.updatedAt}
                        />
                        <CreatureTraitsPanel traits={traits} />
                    </div>
                </div>

                {/* Gestionnaire d'accessoires possédés - Pleine largeur */}
                <div className='mt-8'>
                    <OwnedAccessoriesManager
                        monsterId={currentMonster._id}
                        equippedAccessories={equippedAccessories}
                        onAccessoryChange={refreshAccessories}
                    />
                </div>

                {/* Boutique d'accessoires */}
                <div className='mt-12'>
                    <AccessoryShop
                        accessories={getAvailableAccessories()}
                        monsterId={currentMonster._id}
                        ownedAccessoryIds={ownedAccessoryIds}
                        onPurchaseSuccess={refreshAccessories}
                    />
                </div>
            </div>
            </div>
        </div>
    )
}

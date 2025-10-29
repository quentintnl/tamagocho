'use client'

import { useEffect, useState } from 'react'
import type { MonsterTraits, PopulatedMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureHeader } from './creature-header'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { CreatureTraitsPanel } from './creature-traits-panel'
import { CreatureColorsPanel } from './creature-colors-panel'
import { AccessoryShop } from './accessory-shop'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { getAvailableAccessories } from '@/services/accessory.service'

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
    const [currentMonster, setCurrentMonster] = useState<PopulatedMonster>(monster)
    const [xpToNextLevel, setXpToNextLevel] = useState<number>(0)

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

    useEffect(() => {
        const fetchMonster = async (): Promise<void> => {
            try {
                const response = await fetch(`/api/monster?id=${monster._id}`)
                if (response.ok) {
                    const updatedMonster: PopulatedMonster = await response.json()
                    setCurrentMonster(updatedMonster)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du monstre :', error)
            }
        }

        const interval = setInterval(() => {
            void fetchMonster()
        }, 1000)

        return () => clearInterval(interval)
    }, [monster])

    // Récupération de l'XP requis pour le niveau suivant
    useEffect(() => {
        const fetchNextLevelXp = async (): Promise<void> => {
            try {
                if (currentMonster.level_id.isMaxLevel) {
                    setXpToNextLevel(0)
                    return
                }

                const response = await fetch(`/api/xp-levels?level=${currentMonster.level_id.level + 1}`)
                if (response.ok) {
                    const nextLevel = await response.json()
                    setXpToNextLevel(nextLevel?.xpRequired ?? 0)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du niveau suivant :', error)
            }
        }

        void fetchNextLevelXp()
    }, [currentMonster.level_id.level, currentMonster.level_id.isMaxLevel])

    /**
     * Gère le déclenchement d'une action sur le monstre
     * @param {MonsterAction} action - Action déclenchée
     */
    const handleAction = (action: MonsterAction): void => {
        setCurrentAction(action)
    }

    /**
     * Force le rafraîchissement des données du monstre
     */
    const forceRefresh = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/monster?id=${monster._id}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
            if (response.ok) {
                const updatedMonster: PopulatedMonster = await response.json()
                setCurrentMonster(updatedMonster)
            }
        } catch (error) {
            console.error('Erreur lors du rafraîchissement forcé :', error)
        }
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
                        onActionComplete={forceRefresh}
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
                        <CreatureColorsPanel traits={traits} />
                    </div>
                </div>

                {/* Boutique d'accessoires */}
                <div className='mt-12'>
                    <AccessoryShop
                        accessories={getAvailableAccessories()}
                        monsterId={currentMonster._id}
                    />
                </div>
            </div>
            </div>
        </div>
    )
}

'use client'

import type {DBMonster} from '@/types/monster'
import MonsterCard from './monster-card'

interface MonstersListProps {
    monsters: DBMonster[]
}

function MonstersList({monsters}: MonstersListProps): React.ReactNode {
    if (monsters.length === 0) {
        return (
            <div className="text-center">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune créature</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer votre première créature !
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {monsters.map((monster) => (
                <MonsterCard key={monster.id} monster={monster}/>
            ))}
        </div>
    )
}

export default MonstersList

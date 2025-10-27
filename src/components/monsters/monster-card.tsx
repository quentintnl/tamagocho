'use client'

import type {DBMonster} from '@/types/monster'
import {useRouter} from 'next/navigation'
import type {ReactNode} from 'react'

interface MonsterCardProps {
    monster: DBMonster
}

function MonsterCard({monster}: MonsterCardProps): ReactNode {
    const router = useRouter()

    const handleClick = (): void => {
        router.push(`/creature/${monster.id}`)
    }

    const getHealthColor = (): string => {
        const healthPercentage = (monster.health / 100) * 100
        if (healthPercentage > 66) return 'bg-green-500'
        if (healthPercentage > 33) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getHappinessEmoji = (): string => {
        if (monster.happiness > 66) return '😊'
        if (monster.happiness > 33) return '😐'
        return '😢'
    }

    return (
        <div
            onClick={handleClick}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
        >
            {/* En-tête de la carte */}
            <div className="relative h-48 bg-gradient-to-b from-moccaccino-100 to-moccaccino-200 p-6">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                        />
                    </svg>
                </div>
                <h3 className="relative text-2xl font-bold text-moccaccino-900">
                    {monster.name}
                </h3>
            </div>

            {/* Corps de la carte */}
            <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Barre de santé */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Santé</span>
                        <span className="text-sm font-medium text-gray-900">{monster.health}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                            className={`h-2 rounded-full ${getHealthColor()}`}
                            style={{width: `${monster.health}%`}}
                        />
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-600">Bonheur</div>
                        <div className="mt-1 flex items-baseline">
                            <span className="text-2xl font-semibold text-gray-900">{monster.happiness}%</span>
                            <span className="ml-2 text-2xl">{getHappinessEmoji()}</span>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-600">Niveau</div>
                        <div className="mt-1">
                            <span className="text-2xl font-semibold text-gray-900">{monster.level}</span>
                        </div>
                    </div>
                </div>

                {/* Badge de dernière interaction */}
                <div className="mt-auto">
          <span
              className="inline-flex items-center rounded-full bg-moccaccino-50 px-2.5 py-0.5 text-xs font-medium text-moccaccino-700">
            Dernière interaction : {new Date(monster.lastInteraction).toLocaleDateString()}
          </span>
                </div>
            </div>
        </div>
    )
}

export default MonsterCard

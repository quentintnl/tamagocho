'use client'

import {useState} from 'react'
import Image from 'next/image'
import {MONSTER_ACTIONS, MonsterActionDefinition} from '@/types/monster-actions'
import {performMonsterAction} from '@/actions/monster-actions.actions'

interface MonsterActionsProps {
    monsterId: string;
    onAction?: (action: MonsterActionDefinition) => void;
}

export default function MonsterActions({monsterId, onAction}: MonsterActionsProps) {
    const [activeAnimation, setActiveAnimation] = useState<string>('')

    const handleAction = async (actionDef: MonsterActionDefinition) => {
        setActiveAnimation(actionDef.animation)

        try {
            await performMonsterAction(monsterId, actionDef.action)
            onAction?.(actionDef)
        } catch (error) {
            console.error('Error performing action:', error)
        }

        // Réinitialiser l'animation après un délai
        setTimeout(() => {
            setActiveAnimation('')
        }, 1000)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-center">
                <div className={`transition-all duration-200 ${activeAnimation}`}>
                    <Image
                        src="/fox.svg"
                        alt="Monster"
                        width={192}
                        height={192}
                        className="w-48 h-48 object-contain"
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
                {MONSTER_ACTIONS.map((actionDef) => (
                    <button
                        key={actionDef.action}
                        onClick={() => handleAction(actionDef)}
                        className={`
                            px-4 py-2 rounded-full
                            bg-gradient-to-r from-purple-500 to-pink-500
                            text-white font-medium
                            transform transition-all duration-200
                            hover:scale-105 hover:shadow-lg
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                        `}
                    >
                        <span className="mr-2">{actionDef.icon}</span>
                        {actionDef.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

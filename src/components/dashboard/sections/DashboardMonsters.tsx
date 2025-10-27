import MonstersList from '@/components/monsters/monsters-list'
import type {DBMonster as Monster} from '@/types/monster'
import {JSX} from "react";

interface DashboardMonstersProps {
    monsters: Monster[]
}

/**
 * Section affichant la liste des monstres de l'utilisateur
 * @param {Object} props - Les propriétés du composant
 * @param {Monster[]} props.monsters - Liste des monstres à afficher
 */
const DashboardMonsters = ({monsters}: DashboardMonstersProps): JSX.Element => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
                    Vos créatures
                </h2>
                <div className="mt-8">
                    <MonstersList monsters={monsters}/>
                </div>
            </div>
        </section>
    )
}

export default DashboardMonsters

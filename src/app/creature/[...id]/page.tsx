import {getMonsterById} from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import {CreatureContent} from '@/components/creature'
import '../../animations.css'
import {JSX} from "react";

/**
 * Page de détail d'une créature
 * Affiche les informations détaillées et les actions possibles pour une créature spécifique
 */
async function CreaturePage({params}: { params: { id: string } }): Promise<JSX.Element> {
    const {id} = params
    const monster = await getMonsterById(id)

    if (monster === null || monster === undefined) {
        return <ErrorClient error='Creature not found.'/>
    }

    return (
        <main className='min-h-screen bg-gradient-to-b from-purple-500 to-pink-500'>
            <CreatureContent monster={monster}/>
        </main>
    )
}

export default CreaturePage

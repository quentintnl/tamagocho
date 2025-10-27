import type {DBMonster} from '@/types/monster'
import MonsterActions from '@/components/monster-actions'
import CreatureHeader from './CreatureHeader'
import CreatureStats from './CreatureStats'

interface CreatureContentProps {
    monster: DBMonster
}

/**
 * Contenu principal de la page créature
 * Organise et affiche tous les composants liés à la créature
 */
const CreatureContent = ({monster}: CreatureContentProps): JSX.Element => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
                <div className="flex flex-col items-center space-y-6">
                    <MonsterActions monsterId={monster._id.toString()}/>

                    <CreatureHeader
                        name={monster.name}
                        level={monster.level}
                        state={monster.state}
                    />

                    <CreatureStats
                        level={monster.level}
                        state={monster.state}
                    />
                </div>
            </div>
        </div>
    )
}

export default CreatureContent

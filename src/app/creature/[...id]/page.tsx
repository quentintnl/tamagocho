import {getMonsterById} from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import MonsterActions from '@/components/monster-actions'
import '../../animations.css'

async function CreaturePage({params}: { params: { id: string } }): Promise<React.ReactNode> {
    const {id} = params
    const monster = await getMonsterById(id)

    if (monster === null || monster === undefined) {
        return <ErrorClient error='Creature not found.'/>
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Actions du monstre avec son avatar animé */}
                        <MonsterActions monsterId={monster._id.toString()}/>

                        {/* Informations du monstre */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-purple-600 mb-2">{monster.name}</h1>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <p className="text-purple-600 font-semibold">Niveau</p>
                                    <p className="text-2xl">{monster.level}</p>
                                </div>
                                <div className="bg-pink-100 p-4 rounded-lg">
                                    <p className="text-pink-600 font-semibold">État</p>
                                    <p className="text-2xl capitalize">{monster.state}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats du monstre */}
                        <div className="w-full bg-gray-100 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Statistiques</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Niveau</span>
                                        <div className="w-48 h-2 bg-gray-300 rounded-full">
                                            <div className="h-full bg-yellow-400 rounded-full"
                                                 style={{width: `${(monster.level / 10) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">État</span>
                                        <div className="flex justify-end items-center space-x-2">
                                            <span
                                                className="text-sm font-medium text-gray-600 capitalize">{monster.state}</span>
                                            <div className={`w-3 h-3 rounded-full ${
                                                monster.state === 'happy' ? 'bg-green-400' :
                                                    monster.state === 'sad' ? 'bg-blue-400' :
                                                        monster.state === 'angry' ? 'bg-red-400' :
                                                            monster.state === 'hungry' ? 'bg-yellow-400' :
                                                                'bg-gray-400'
                                            }`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CreaturePage

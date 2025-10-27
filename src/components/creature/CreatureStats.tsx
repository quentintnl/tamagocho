import StateIndicator from './StateIndicator'

interface CreatureStatsProps {
    level: number
    state: string
}

/**
 * Section des statistiques de la créature
 */
const CreatureStats = ({level, state}: CreatureStatsProps): JSX.Element => {
    return (
        <div className="w-full bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Statistiques</h2>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Niveau</span>
                        <div className="w-48 h-2 bg-gray-300 rounded-full ml-4">
                            <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{width: `${(level / 10) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 mr-4">État</span>
                        <StateIndicator state={state}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatureStats

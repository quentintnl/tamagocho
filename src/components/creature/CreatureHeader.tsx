import {JSX} from "react";

interface CreatureHeaderProps {
    name: string
    level: number
    state: string
}

/**
 * En-tête de la page créature affichant les informations principales
 */
const CreatureHeader = ({name, level, state}: CreatureHeaderProps): JSX.Element => {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">{name}</h1>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-purple-600 font-semibold">Niveau</p>
                    <p className="text-2xl">{level}</p>
                </div>
                <div className="bg-pink-100 p-4 rounded-lg">
                    <p className="text-pink-600 font-semibold">État</p>
                    <p className="text-2xl capitalize">{state}</p>
                </div>
            </div>
        </div>
    )
}

export default CreatureHeader

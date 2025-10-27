import Button from '@/components/button'
import {JSX} from "react";

interface DashboardActionsProps {
    onCreateMonster: () => void
    onLogout: () => void
}

/**
 * Section des actions principales du tableau de bord
 * @param {Object} props - Les propriétés du composant
 * @param {() => void} props.onCreateMonster - Callback pour la création d'un monstre
 * @param {() => void} props.onLogout - Callback pour la déconnexion
 */
const DashboardActions = ({onCreateMonster, onLogout}: DashboardActionsProps): JSX.Element => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-4">
                    <Button
                        onClick={onCreateMonster}
                        className="bg-moccaccino-600 hover:bg-moccaccino-700"
                    >
                        Créer une nouvelle créature
                    </Button>
                    <Button
                        onClick={onLogout}
                        variant="ghost"
                        className="text-moccaccino-600 hover:text-moccaccino-700"
                    >
                        Se déconnecter
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default DashboardActions

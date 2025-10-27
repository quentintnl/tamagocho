import {JSX} from "react";

/**
 * Section héro du tableau de bord affichant le message de bienvenue
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.userEmail - L'email de l'utilisateur connecté
 */
const DashboardHero = ({userEmail}: { userEmail: string }): JSX.Element => {
    return (
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Bienvenue,</span>
                        <span className="block text-moccaccino-600">{userEmail}</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Gérez vos créatures et suivez leur progression depuis votre espace personnel.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default DashboardHero

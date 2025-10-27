'use client'
import CreateMonsterModal from './create-monster-modal'
import type {DBMonster as Monster} from '@/types/monster'
import type {authClient} from '@/lib/auth-client'
import {useDashboard} from '@/hooks/useDashboard'
import DashboardHero from './sections/DashboardHero'
import DashboardActions from './sections/DashboardActions'
import DashboardMonsters from './sections/DashboardMonsters'
import {JSX} from "react";

type Session = typeof authClient.$Infer.Session

/**
 * Composant principal du tableau de bord
 * @param {Object} props - Les propriétés du composant
 * @param {Session} props.session - Session de l'utilisateur connecté
 * @param {Monster[]} props.monsters - Liste des monstres de l'utilisateur
 */
function DashboardContent({session, monsters}: { session: Session, monsters: Monster[] }): JSX.Element {
    const {
        isModalOpen,
        handleLogout,
        handleCreateMonster,
        handleCloseModal,
        handleMonsterSubmit
    } = useDashboard()

    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
            <DashboardHero userEmail={session.user.email}/>
            <DashboardActions
                onCreateMonster={handleCreateMonster}
                onLogout={handleLogout}
            />
            <DashboardMonsters monsters={monsters}/>
            <CreateMonsterModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleMonsterSubmit}
            />
        </main>
    )
}

export default DashboardContent

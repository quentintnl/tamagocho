'use client'
import {useState} from 'react'
import Button from '../button'
import CreateMonsterModal from './create-monster-modal'
import type {CreateMonsterFormValues} from '@/types/forms/create-monster-form'
import {authClient} from '@/lib/auth-client'
import {createMonster} from '@/actions/monsters.actions'
import MonstersList from '../monsters/monsters-list'
import type {DBMonster as Monster} from '@/types/monster'

type Session = typeof authClient.$Infer.Session

function DashboardContent({session, monsters}: { session: Session, monsters: Monster[] }): React.ReactNode {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogout = (): void => {
        void authClient.signOut()
        window.location.href = '/sign-in'
    }

    const handleCreateMonster = (): void => {
        setIsModalOpen(true)
    }

    const handleCloseModal = (): void => {
        setIsModalOpen(false)
    }

    const handleMonsterSubmit = async (values: CreateMonsterFormValues): Promise<void> => {
        void values
        await createMonster(values)
    }

    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
            {/* Section Hero du Dashboard */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Bienvenue,</span>
                            <span className="block text-moccaccino-600">{session.user.email}</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Gérez vos créatures et suivez leur progression depuis votre espace personnel.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section Actions */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={handleCreateMonster}
                            className="bg-moccaccino-600 hover:bg-moccaccino-700"
                        >
                            Créer une nouvelle créature
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-moccaccino-600 hover:text-moccaccino-700"
                        >
                            Se déconnecter
                        </Button>
                    </div>
                </div>
            </section>

            {/* Section Liste des Monstres */}
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

            {/* Modal de création */}
            <CreateMonsterModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleMonsterSubmit}
            />
        </main>
    )
}

export default DashboardContent

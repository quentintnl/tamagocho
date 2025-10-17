'use client'
import Button from '../button'
import {authClient} from '@/lib/auth-client'
import {useState} from "react"
import CreateMonsterModal from '@/components/modals/create-monster-modal'

type Session = typeof authClient.$Infer.Session

function DashboardContent({session}: { session: Session }): React.ReactNode {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogout = (): void => {
        void authClient.signOut()
        window.location.href = '/sign-in'
    }

    const handleCreateMonster = async (monsterData: { name: string, draw: string }) => {
        try {
            const response = await fetch('/api/monsters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(monsterData)
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la création du monstre')
            }

            // Recharger la page pour voir le nouveau monstre
            window.location.reload()
        } catch (error) {
            console.error('Erreur:', error)
            // Ici vous pourriez ajouter une notification d'erreur
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-4xl font-bold mb-4'>Bienvenue {session.user.email} sur votre tableau de bord</h1>
            <Button onClick={() => setIsModalOpen(true)}>
                Créer une nouvelle créature
            </Button>
            <p className='text-lg text-gray-600'>Ici, vous pouvez gérer vos créatures et suivre votre progression.</p>
            <Button onClick={handleLogout}>
                Se déconnecter
            </Button>

            <CreateMonsterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateMonster}
            />
        </div>
    )
}

export default DashboardContent

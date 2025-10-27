import {useState} from 'react'
import {authClient} from '@/lib/auth-client'
import type {CreateMonsterFormValues} from '@/types/forms/create-monster-form'
import {createMonster} from '@/actions/monsters.actions'

/**
 * Hook personnalisé pour gérer la logique du tableau de bord
 * @returns {Object} Les états et fonctions nécessaires pour le tableau de bord
 */
export const useDashboard = () => {
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
        try {
            await createMonster(values)
            handleCloseModal()
        } catch (error) {
            console.error('Erreur lors de la création du monstre:', error)
        }
    }

    return {
        isModalOpen,
        handleLogout,
        handleCreateMonster,
        handleCloseModal,
        handleMonsterSubmit
    }
}

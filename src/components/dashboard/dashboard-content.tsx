'use client'
import Button from '../button'
import {authClient} from '@/lib/auth-client'

type Session = typeof authClient.$Infer.Session

function DashboardContent({session}: { session: Session }): React.ReactNode {
    const handleLogout = (): void => {
        void authClient.signOut()
        window.location.href = '/sign-in'
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-4xl font-bold mb-4'>Bienvenue {session.user.email} sur votre tableau de bord</h1>
            <p className='text-lg text-gray-600'>Ici, vous pouvez gérer vos créatures et suivre votre progression.</p>
            <Button onClick={handleLogout}>
                Se déconnecter
            </Button>
        </div>
    )
}

export default DashboardContent

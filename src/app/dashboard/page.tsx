'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/button'

const DashboardPage = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST'
      })
      if (response.ok) {
        router.push('/sign-in')
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Mon Dashboard</h1>
      <Button
        variant='primary'
        onClick={handleLogout}
        className='bg-red-500 hover:bg-red-600'
      >
        Se déconnecter
      </Button>
    </div>
  )
}

export default DashboardPage

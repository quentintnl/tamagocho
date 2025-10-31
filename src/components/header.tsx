/**
 * Header Component
 *
 * Presentation Layer: Navigation header
 *
 * Single Responsibility Principle Applied:
 * - Only handles UI rendering
 * - Navigation logic extracted to usePageTitle and useActiveRoute hooks
 * - Wallet data retrieval delegated to useWalletContext hook
 *
 * Responsibilities:
 * - Display page title
 * - Render navigation buttons
 * - Show wallet balance
 */

'use client'

import { useRouter } from 'next/navigation'
import { useWalletContext } from '@/contexts/wallet-context'
import { useCallback } from 'react'
import TomatokenIcon from '@/components/tomatoken-icon'
import { usePageTitle, useActiveRoute } from '@/hooks/useNavigation'

export default function Header (): React.ReactNode {
  const router = useRouter()
  const { wallet } = useWalletContext()
  const pageTitle = usePageTitle()
  const isActive = useActiveRoute()

  // Navigation handlers optimisés avec useCallback et router.push
  const handleDashboard = useCallback((): void => {
    router.push('/dashboard')
  }, [router])

  const handleMonsters = useCallback((): void => {
    router.push('/monsters')
  }, [router])

  const handleGallery = useCallback((): void => {
    router.push('/gallery')
  }, [router])

  const handleShop = useCallback((): void => {
    router.push('/shop')
  }, [router])

  const handleWallet = useCallback((): void => {
    router.push('/wallet')
  }, [router])

  const handleQuests = useCallback((): void => {
    router.push('/quests')
  }, [router])

  return (
    <header className='bg-gradient-to-r from-meadow-50/90 to-sky-50/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-meadow-200/50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Nom de la page à gauche */}
          <div className='flex-shrink-0'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-forest-700 to-meadow-600 bg-clip-text text-transparent'>
              {pageTitle}
            </h1>
          </div>

          {/* 4 Boutons à droite */}
          <div className='flex items-center gap-2'>
            {/* Dashboard */}
            <button
              onClick={handleDashboard}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive('/dashboard')
                    ? 'border-2 border-meadow-500 text-forest-700 bg-meadow-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-meadow-300 hover:bg-meadow-50/30'
                }
              `}
            >
              📊 Dashboard
            </button>

            {/* Monstres */}
            <button
              onClick={handleMonsters}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive('/monsters')
                    ? 'border-2 border-meadow-500 text-forest-700 bg-meadow-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-meadow-300 hover:bg-meadow-50/30'
                }
              `}
            >
              👾 Monstres
            </button>

            {/* Galerie Publique */}
            <button
              onClick={handleGallery}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive('/gallery')
                    ? 'border-2 border-meadow-500 text-forest-700 bg-meadow-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-meadow-300 hover:bg-meadow-50/30'
                }
              `}
            >
              🌍 Monstres Publics
            </button>

            {/* Quêtes */}
            <button
              onClick={handleQuests}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive('/quests')
                    ? 'border-2 border-meadow-500 text-forest-700 bg-meadow-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-meadow-300 hover:bg-meadow-50/30'
                }
              `}
            >
              🎯 Quêtes
            </button>

            {/* Boutique */}
            <button
              onClick={handleShop}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive('/shop')
                    ? 'border-2 border-meadow-500 text-forest-700 bg-meadow-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-meadow-300 hover:bg-meadow-50/30'
                }
              `}
            >
              🛍️ Boutique
            </button>

            {/* Coins avec affichage du montant */}
            <button
              onClick={handleWallet}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${
                  isActive('/wallet')
                    ? 'border-2 border-sunset-500 text-forest-700 bg-sunset-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-sunset-300 hover:bg-sunset-50/30'
                }
              `}
            >
              <div className='flex items-center justify-center w-5 h-5 bg-gradient-to-br from-sunset-400 to-sunset-600 rounded-full'>
                <TomatokenIcon size='xs' />
              </div>
              <span className='font-bold'>
                {wallet?.coin?.toLocaleString() ?? '0'}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

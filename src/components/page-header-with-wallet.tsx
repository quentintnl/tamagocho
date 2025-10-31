/**
 * Page Header with Wallet Component
 *
 * Presentation Layer: Composant réutilisable pour afficher un header
 * avec navigation et wallet
 *
 * Responsabilités:
 * - Afficher un titre de page
 * - Afficher les 4 boutons de navigation
 * - Afficher le wallet avec le nombre de coins
 *
 * Single Responsibility: Header interne unifié
 */

'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'
import { useCallback } from 'react'
import TomatokenIcon from '@/components/tomatoken-icon'

interface PageHeaderWithWalletProps {
  title?: string
}

/**
 * Header de page avec wallet intégré
 *
 * @param title - Titre de la page (optionnel, sinon détecté automatiquement)
 */
export default function PageHeaderWithWallet ({
  title
}: PageHeaderWithWalletProps): React.ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const { wallet } = useWallet()

  // Déterminer le nom de la page actuelle
  const getPageTitle = (): string => {
    if (title !== undefined) return title
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/monsters') return 'Mes Créatures'
    if (pathname === '/gallery') return 'Galerie Communautaire'
    if (pathname === '/quests') return 'Quêtes du Jour'
    if (pathname === '/shop') return 'Boutique'
    if (pathname === '/wallet') return 'Mon Wallet'
    if (pathname?.startsWith('/creature/')) return 'Ma Créature'
    return 'Tamagotcho'
  }

  // Déterminer si un bouton est actif
  const isActive = (path: string): boolean => {
    return pathname === path
  }

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
    <div className='sticky top-0 z-40 bg-gradient-to-r from-meadow-50/90 to-sky-50/90 backdrop-blur-md shadow-lg border-b-2 border-meadow-200/50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 gap-4'>
          {/* Nom de la page à gauche */}
          <div className='flex-shrink-0'>
            <h1 className='text-xl font-bold bg-gradient-to-r from-forest-700 to-meadow-600 bg-clip-text text-transparent'>
              {getPageTitle()}
            </h1>
          </div>

          {/* 4 Boutons à droite */}
          <div className='flex items-center gap-2'>
            {/* Dashboard */}
            <button
              onClick={handleDashboard}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
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
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
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
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive('/gallery')
                    ? 'border-2 border-meadow-500 text-forest-700 bg-meadow-50/50'
                    : 'border-2 border-transparent text-forest-600 hover:border-meadow-300 hover:bg-meadow-50/30'
                }
              `}
            >
              🌍 Public
            </button>

            {/* Quêtes */}
            <button
              onClick={handleQuests}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
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
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
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
                px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
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
      </div>
    </div>
  )
}


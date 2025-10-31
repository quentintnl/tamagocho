'use client'

import { usePathname } from 'next/navigation'
import { useWallet } from '@/hooks/useWallet'

// Single Responsibility: Header handles only navigation and page title display
export default function Header (): React.ReactNode {
  const pathname = usePathname()
  const { wallet } = useWallet()

  // Déterminer le nom de la page actuelle
  const getPageTitle = (): string => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/monsters') return 'Mes Créatures'
    if (pathname === '/shop') return 'Boutique'
    if (pathname === '/wallet') return 'Mon Wallet'
    if (pathname === '/gallery') return 'Galerie Communautaire'
    if (pathname === '/quests') return 'Quêtes du Jour'
    if (pathname?.startsWith('/creature/')) return 'Ma Créature'
    return 'Tamagotcho'
  }

  // Déterminer si un bouton est actif
  const isActive = (path: string): boolean => {
    return pathname === path
  }

  // Navigation handlers
  const handleDashboard = (): void => {
    window.location.href = '/dashboard'
  }

  const handleMonsters = (): void => {
    window.location.href = '/monsters'
  }

  const handleGallery = (): void => {
    window.location.href = '/gallery'
  }

  const handleShop = (): void => {
    window.location.href = '/shop'
  }

  const handleWallet = (): void => {
    window.location.href = '/wallet'
  }

  const handleQuests = (): void => {
    window.location.href = '/quests'
  }

  return (
    <header className='bg-gradient-to-r from-meadow-50/90 to-sky-50/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-meadow-200/50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Nom de la page à gauche */}
          <div className='flex-shrink-0'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-forest-700 to-meadow-600 bg-clip-text text-transparent'>
              {getPageTitle()}
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
                <span className='text-xs'>💰</span>
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

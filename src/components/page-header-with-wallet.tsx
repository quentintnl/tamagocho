/**
 * Page Header with Wallet Component
 *
 * Presentation Layer: Composant réutilisable pour afficher un header
 * avec le wallet en haut à droite des pages internes
 *
 * Responsabilités:
 * - Afficher un titre de page
 * - Afficher le wallet de l'utilisateur
 * - Navigation de retour (optionnelle)
 *
 * Single Responsibility: Header interne avec wallet
 */

'use client'

import WalletDisplay from '@/components/wallet-display'
import Button from '@/components/button'

interface PageHeaderWithWalletProps {
  title?: string
  showBackButton?: boolean
  backUrl?: string
  showShopButton?: boolean
  showDashboardButton?: boolean
  showMonstersButton?: boolean
  children?: React.ReactNode
}

/**
 * Header de page avec wallet intégré
 *
 * @param title - Titre de la page (optionnel)
 * @param showBackButton - Afficher le bouton retour
 * @param backUrl - URL de retour
 * @param showShopButton - Afficher le bouton boutique (par défaut true)
 * @param showDashboardButton - Afficher le bouton dashboard (par défaut true)
 * @param showMonstersButton - Afficher le bouton mes monstres (par défaut true)
 * @param children - Contenu additionnel dans le header
 */
export default function PageHeaderWithWallet ({
  title,
  showBackButton = false,
  backUrl = '/dashboard',
  showShopButton = true,
  showDashboardButton = true,
  showMonstersButton = true,
  children
}: PageHeaderWithWalletProps): React.ReactNode {
  const handleBack = (): void => {
    window.location.href = backUrl
  }

  const handleShop = (): void => {
    window.location.href = '/shop'
  }

  const handleDashboard = (): void => {
    window.location.href = '/dashboard'
  }

  const handleMonsters = (): void => {
    window.location.href = '/monster'
  }

  return (
    <div className='sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 gap-4'>
          {/* Partie gauche : bouton retour + titre */}
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            {showBackButton && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleBack}
              >
                ← Retour
              </Button>
            )}
            {title !== undefined && (
              <h1 className='text-lg font-bold text-gray-800 truncate'>
                {title}
              </h1>
            )}
            {children}
          </div>

          {/* Partie droite : Bouton boutique + Wallet */}
          <div className='flex items-center gap-3 flex-shrink-0'>
            {showShopButton && (
              <Button
                variant='primary'
                size='sm'
                onClick={handleShop}
              >
                🛍️ Boutique
              </Button>
            )}
            <WalletDisplay variant='compact' />
          </div>
        </div>
      </div>
    </div>
  )
}


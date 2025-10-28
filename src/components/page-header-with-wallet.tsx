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
  children?: React.ReactNode
}

/**
 * Header de page avec wallet intégré
 *
 * @param title - Titre de la page (optionnel)
 * @param showBackButton - Afficher le bouton retour
 * @param backUrl - URL de retour
 * @param children - Contenu additionnel dans le header
 */
export default function PageHeaderWithWallet ({
  title,
  showBackButton = false,
  backUrl = '/dashboard',
  children
}: PageHeaderWithWalletProps): React.ReactNode {
  const handleBack = (): void => {
    window.location.href = backUrl
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

          {/* Partie droite : Wallet */}
          <div className='flex-shrink-0'>
            <WalletDisplay variant='compact' />
          </div>
        </div>
      </div>
    </div>
  )
}


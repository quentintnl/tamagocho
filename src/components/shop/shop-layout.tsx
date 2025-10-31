/**
 * Shop Layout - Layout réutilisable pour la boutique
 *
 * Encapsule la structure commune (header, bulles décoratives, conteneur principal)
 * pour éviter la duplication entre la page et le skeleton
 */

import PageHeaderWithWallet from '@/components/page-header-with-wallet'

interface ShopLayoutProps {
  children: React.ReactNode
}

/**
 * Composant Layout pour la page boutique
 *
 * @param {ShopLayoutProps} props - Props du composant
 * @returns {React.ReactNode} Layout de la boutique
 */
export function ShopLayout ({ children }: ShopLayoutProps): React.ReactNode {
  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Boutique' />

      {/* Motifs décoratifs de fond animés - thème fruits & légumes */}
      <div className='pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-sunset-200/40 via-gold-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '8s' }} />
      <div className='pointer-events-none absolute -left-24 bottom-40 h-96 w-96 rounded-full bg-gradient-to-tr from-meadow-200/50 via-forest-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '10s' }} />
      <div className='pointer-events-none absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-gradient-to-bl from-lavender-200/40 via-sky-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '12s' }} />

      {/* Contenu principal */}
      <main className='relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-24 pb-16'>
        {children}
      </main>
    </div>
  )
}


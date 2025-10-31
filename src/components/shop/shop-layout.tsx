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
    <div className='min-h-screen bg-gradient-to-br from-sky-100 via-meadow-50 to-lavender-50 relative overflow-hidden'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Boutique' />

      {/* Bulles décoratives de fond - thème nature */}
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-meadow-200/50 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl' aria-hidden='true' />

      {/* Contenu principal */}
      <main className='relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pt-24'>
        {children}
      </main>
    </div>
  )
}


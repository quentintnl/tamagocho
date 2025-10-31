/**
 * Quests Layout - Layout réutilisable pour la page des quêtes
 *
 * Encapsule la structure commune (header, conteneur principal, footer)
 * pour éviter la duplication
 */

import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import Footer from '@/components/footer'

interface QuestsLayoutProps {
  children: React.ReactNode
}

/**
 * Composant Layout pour la page des quêtes
 *
 * @param {QuestsLayoutProps} props - Props du composant
 * @returns {React.ReactNode} Layout des quêtes
 */
export function QuestsLayout ({ children }: QuestsLayoutProps): React.ReactNode {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header avec wallet - sticky en haut */}
      <PageHeaderWithWallet title="Quêtes Quotidiennes" />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
      <Footer />
    </div>
  )
}


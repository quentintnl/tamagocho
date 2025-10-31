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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100">
      {/* Header avec wallet - sticky en haut */}
      <PageHeaderWithWallet title="Quêtes Quotidiennes" />

      {/* Motifs décoratifs de fond animés - thème fruits & légumes */}
      <div className='pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-sunset-200/40 via-gold-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '8s' }} />
      <div className='pointer-events-none absolute -left-24 bottom-40 h-96 w-96 rounded-full bg-gradient-to-tr from-meadow-200/50 via-forest-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '10s' }} />
      <div className='pointer-events-none absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-gradient-to-bl from-lavender-200/40 via-sky-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '12s' }} />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
      <Footer />
    </div>
  )
}


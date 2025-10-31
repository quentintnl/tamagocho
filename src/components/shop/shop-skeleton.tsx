/**
 * Shop Skeleton - Skeleton de chargement pour la boutique
 *
 * Affiche un skeleton animé pendant le chargement de la boutique
 */

import PageHeaderWithWallet from '@/components/page-header-with-wallet'

/**
 * Composant Skeleton pour la page boutique
 *
 * @returns {React.ReactNode} Skeleton de chargement
 */
export function ShopSkeleton (): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-100 via-meadow-50 to-lavender-50 relative overflow-hidden'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Boutique' />

      {/* Bulles décoratives de fond - thème nature */}
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-meadow-200/50 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl' aria-hidden='true' />

      {/* Contenu principal */}
      <main className='relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pt-6'>
        {/* Skeleton pour les statistiques */}
        <div className='mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-gray-200/60'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse' />
              <div className='h-8 bg-gray-300 rounded w-1/2 mx-auto animate-pulse' />
            </div>
          ))}
        </div>

        {/* Skeleton pour les onglets */}
        <div className='mb-8 flex justify-center'>
          <div className='inline-flex gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg'>
            <div className='h-10 w-40 bg-gray-200 rounded-xl animate-pulse' />
            <div className='h-10 w-40 bg-gray-200 rounded-xl animate-pulse' />
          </div>
        </div>

        {/* Skeleton pour l'en-tête de section */}
        <div className='mb-6'>
          <div className='h-8 bg-gray-300 rounded w-48 mb-2 animate-pulse' />
          <div className='h-4 bg-gray-200 rounded w-64 animate-pulse' />
        </div>

        {/* Skeleton pour la grille d'accessoires */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg ring-2 ring-gray-200/60'>
              {/* Image skeleton */}
              <div className='aspect-square bg-gray-200 rounded-xl mb-4 animate-pulse' />

              {/* Titre skeleton */}
              <div className='h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse' />

              {/* Description skeleton */}
              <div className='h-4 bg-gray-200 rounded w-full mb-1 animate-pulse' />
              <div className='h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse' />

              {/* Prix skeleton */}
              <div className='h-8 bg-gray-300 rounded w-1/2 mb-4 animate-pulse' />

              {/* Bouton skeleton */}
              <div className='h-10 bg-gray-200 rounded-xl animate-pulse' />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}


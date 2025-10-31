/**
 * Accessories Grid Skeleton - Skeleton pour la grille d'accessoires
 *
 * Affiche un skeleton pour la grille d'accessoires pendant le chargement
 */

/**
 * Composant Skeleton pour la grille d'accessoires
 *
 * @returns {React.ReactNode} Skeleton de la grille
 */
export function AccessoriesGridSkeleton (): React.ReactNode {
  return (
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
  )
}


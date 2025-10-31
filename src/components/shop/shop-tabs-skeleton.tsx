/**
 * Shop Tabs Skeleton - Skeleton pour les onglets de la boutique
 *
 * Affiche un skeleton pour les onglets pendant le chargement
 */

/**
 * Composant Skeleton pour les onglets
 *
 * @returns {React.ReactNode} Skeleton des onglets
 */
export function ShopTabsSkeleton (): React.ReactNode {
  return (
    <div className='mb-8 flex justify-center'>
      <div className='inline-flex gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg'>
        <div className='h-10 w-40 bg-gray-200 rounded-xl animate-pulse' />
        <div className='h-10 w-40 bg-gray-200 rounded-xl animate-pulse' />
      </div>
    </div>
  )
}

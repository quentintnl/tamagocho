/**
 * Shop Stats - Statistiques de la boutique
 *
 * Composant réutilisable pour afficher les statistiques de la boutique
 */

interface ShopStatsProps {
  totalItems: number | null
  ownedItems: number | null
  balance: number | null
}

/**
 * Composant pour afficher les statistiques de la boutique
 *
 * @param {ShopStatsProps} props - Props du composant
 * @returns {React.ReactNode} Statistiques de la boutique
 */
export function ShopStats ({ totalItems, ownedItems, balance }: ShopStatsProps): React.ReactNode {
  return (
    <div className='mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto'>
      <div className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-meadow-200/60 text-center hover:shadow-xl transition-shadow'>
        <p className='text-sm text-forest-600 font-medium'>Articles disponibles</p>
        {totalItems === null
          ? <div className='h-8 bg-gray-300 rounded w-1/2 mx-auto animate-pulse mt-1' />
          : <p className='text-3xl font-bold text-meadow-600'>{totalItems}</p>}
      </div>
      <div className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-sky-200/60 text-center hover:shadow-xl transition-shadow'>
        <p className='text-sm text-forest-600 font-medium'>Accessoires possédés</p>
        {ownedItems === null
          ? <div className='h-8 bg-gray-300 rounded w-1/2 mx-auto animate-pulse mt-1' />
          : <p className='text-3xl font-bold text-sky-600'>{ownedItems}</p>}
      </div>
      <div className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-sunset-200/60 text-center hover:shadow-xl transition-shadow'>
        <p className='text-sm text-forest-600 font-medium'>Votre solde</p>
        {balance === null
          ? <div className='h-8 bg-gray-300 rounded w-1/2 mx-auto animate-pulse mt-1' />
          : <p className='text-3xl font-bold text-sunset-600'>{balance} 💰</p>}
      </div>
    </div>
  )
}


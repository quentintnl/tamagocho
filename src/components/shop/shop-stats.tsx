/**
 * Shop Stats - Statistiques de la boutique
 *
 * Composant réutilisable pour afficher les statistiques de la boutique
 */

import TomatokenIcon from '@/components/tomatoken-icon'

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
    <div className='mb-8'>
      {/* En-tête de la boutique */}
      <div className='mb-6 relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-100 via-white to-sunset-100 p-8 shadow-xl border-4 border-white/80'>
        {/* Motif décoratif de fond */}
        <div className='absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-sunset-200/50 to-gold-200/30 blur-2xl' aria-hidden='true' />
        <div className='absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-tr from-gold-200/50 to-meadow-200/30 blur-2xl' aria-hidden='true' />

        <div className='relative text-center space-y-4'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 shadow-md border-2 border-gold-200/60'>
            <span className='text-2xl' aria-hidden='true'>🛍️</span>
            <span className='text-sm font-bold text-forest-700'>
              Boutique d'Accessoires
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl font-black text-forest-800 leading-tight'>
            Personnalise tes Créatures
            <span className='ml-3 inline-block' style={{ animation: 'bounce 2s infinite' }}>✨</span>
          </h1>

          <p className='text-lg text-forest-600 leading-relaxed max-w-2xl mx-auto'>
            Découvre des accessoires uniques pour rendre tes petits monstres encore plus <strong className='text-sunset-600'>adorables</strong> ! Utilise tes <strong className='text-gold-600'>Tomatokens</strong> pour débloquer de nouvelles décorations.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto'>
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-meadow-100 via-white to-forest-50 p-5 shadow-lg border-2 border-meadow-200/80 hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
          <div className='relative flex items-center gap-3'>
            <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-meadow-400 to-forest-500 shadow-lg text-xl border-2 border-white/80'>
              🎨
            </div>
            <div>
              {totalItems === null
                ? <div className='h-8 w-16 bg-meadow-200/50 rounded animate-pulse' />
                : <p className='text-3xl font-black text-forest-800'>{totalItems}</p>}
              <p className='text-xs font-bold text-meadow-700'>Articles</p>
            </div>
          </div>
        </div>

        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-lavender-50 p-5 shadow-lg border-2 border-sky-200/80 hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
          <div className='relative flex items-center gap-3'>
            <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400 to-lavender-500 shadow-lg text-xl border-2 border-white/80'>
              ✅
            </div>
            <div>
              {ownedItems === null
                ? <div className='h-8 w-16 bg-sky-200/50 rounded animate-pulse' />
                : <p className='text-3xl font-black text-forest-800'>{ownedItems}</p>}
              <p className='text-xs font-bold text-sky-700'>Possédés</p>
            </div>
          </div>
        </div>

        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-sunset-100 via-white to-gold-50 p-5 shadow-lg border-2 border-sunset-200/80 hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
          <div className='relative flex items-center gap-3'>
            <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-sunset-400 to-gold-500 shadow-lg text-xl border-2 border-white/80'>
              <TomatokenIcon size='md' />
            </div>
            <div>
              {balance === null
                ? <div className='h-8 w-20 bg-gold-200/50 rounded animate-pulse' />
                : <p className='text-3xl font-black text-gold-600'>{balance}</p>}
              <p className='text-xs font-bold text-sunset-700'>Solde</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

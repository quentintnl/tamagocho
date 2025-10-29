/**
 * Accessories Demo Page
 *
 * Page de démonstration des accessoires sans authentification
 * Pour tester visuellement les cartes d'accessoires
 */

import { AccessoriesList } from '@/components/wallet/accessories-list'
import { getAvailableAccessories } from '@/services/accessory.service'

export default function AccessoriesDemoPage (): React.ReactNode {
  const accessories = getAvailableAccessories()

  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50'>
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <h1 className='text-4xl font-bold text-slate-900'>
            🎨 Boutique d&apos;Accessoires
          </h1>
          <p className='mt-2 text-lg text-slate-600'>
            Personnalisez vos monstres avec style !
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <main className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold text-slate-900'>
            Tous les accessoires disponibles
          </h2>
          <p className='mt-2 text-sm text-slate-600'>
            {accessories.length} accessoires trouvés
          </p>
        </div>

        <AccessoriesList
          accessories={accessories}
          onPurchase={(id) => { alert(`Achat de l'accessoire ${id}`) }}
          ownedAccessoryIds={['hat-party', 'glasses-cool']}
        />
      </main>
    </div>
  )
}



import { UniversalAccessoryCard } from '@/components/accessories/universal-accessory-card'
import type { Accessory } from '@/types/accessory'

/**
 * Props pour le composant AccessoriesList
 */
interface AccessoriesListProps {
  /** Liste des accessoires à afficher */
  accessories: Accessory[]
  /** Callback lors de l'achat d'un accessoire */
  onPurchase?: (accessoryId: string) => void
  /** IDs des accessoires déjà possédés */
  ownedAccessoryIds?: string[]
}

/**
 * Liste d'affichage des accessoires
 *
 * Responsabilité unique : organiser l'affichage d'une collection d'accessoires
 * en grille responsive.
 *
 * Applique SRP en déléguant :
 * - Le rendu de chaque accessoire à UniversalAccessoryCard
 * - La vérification de possession via ownedAccessoryIds
 * - La détection automatique du type SVG au composant universel
 *
 * @param {AccessoriesListProps} props - Props du composant
 * @returns {React.ReactNode} Grille d'accessoires
 *
 * @example
 * <AccessoriesList
 *   accessories={accessories}
 *   onPurchase={handlePurchase}
 *   ownedAccessoryIds={['hat-party', 'glasses-cool']}
 * />
 */
export function AccessoriesList ({
  accessories,
  onPurchase,
  ownedAccessoryIds = []
}: AccessoriesListProps): React.ReactNode {
  if (accessories.length === 0) {
    return (
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-sky-100 p-10 sm:p-12 text-center shadow-2xl border-4 border-white/90'>
        {/* Motifs décoratifs */}
        <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-lavender-300/40 to-fuchsia-blue-300/30 blur-2xl' aria-hidden='true' />
        <div className='absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-meadow-300/30 to-sky-300/20 blur-2xl' aria-hidden='true' />

        <div className='relative space-y-6'>
          {/* Grosse icône centrale */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='flex items-center justify-center h-32 w-32 rounded-3xl bg-gradient-to-br from-gold-400 to-sunset-500 shadow-2xl border-4 border-white text-6xl animate-bounce' style={{ animationDuration: '2s' }}>
                🛍️
              </div>
              {/* Petites étoiles autour */}
              <div className='absolute -top-2 -right-2 text-2xl animate-pulse'>✨</div>
              <div className='absolute -bottom-2 -left-2 text-2xl animate-pulse' style={{ animationDelay: '0.5s' }}>🌟</div>
            </div>
          </div>

          {/* Titre accrocheur */}
          <div className='space-y-3'>
            <h3 className='text-3xl sm:text-4xl font-black text-forest-800 leading-tight'>
              Aucun Accessoire Disponible
            </h3>
            <p className='text-lg text-forest-600 leading-relaxed max-w-md mx-auto'>
              Reviens plus tard pour découvrir de nouveaux articles magiques ! 🌿
            </p>
          </div>

          {/* Message encourageant */}
          <div className='pt-4'>
            <p className='text-sm font-medium text-forest-500 italic'>
              "De nouvelles merveilles arrivent bientôt dans la boutique ! ✨"
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {accessories.map((accessory) => (
        <UniversalAccessoryCard
          key={accessory.id}
          accessory={accessory}
          onPurchase={onPurchase}
          isOwned={ownedAccessoryIds.includes(accessory.id)}
        />
      ))}
    </div>
  )
}


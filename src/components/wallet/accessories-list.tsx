
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
      <div className='flex min-h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-white/90 via-white to-slate-50/70 p-12 shadow-[0_20px_54px_rgba(15,23,42,0.14)] ring-1 ring-white/70'>
        <div className='text-center'>
          <p className='text-7xl'>🛍️</p>
          <p className='mt-4 text-lg font-medium text-slate-900'>Aucun accessoire disponible</p>
          <p className='mt-2 text-sm text-slate-600'>Revenez plus tard pour découvrir de nouveaux articles !</p>
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


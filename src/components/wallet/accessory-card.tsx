import type { Accessory, AccessoryRarity } from '@/types/accessory'
import TomatokenIcon from '@/components/tomatoken-icon'

/**
 * Props pour le composant AccessoryCard
 */
interface AccessoryCardProps {
  /** Accessoire à afficher */
  accessory: Accessory
  /** Callback lors de l'achat */
  onPurchase?: (accessoryId: string) => void
  /** Indique si l'accessoire est déjà possédé */
  isOwned?: boolean
}

/**
 * Obtenir la couleur de badge selon la rareté
 */
function getRarityColor (rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common':
      return 'bg-slate-100/80 text-slate-600'
    case 'rare':
      return 'bg-lochinvar-100/80 text-lochinvar-600'
    case 'epic':
      return 'bg-fuchsia-blue-100/80 text-fuchsia-blue-600'
    case 'legendary':
      return 'bg-moccaccino-100/80 text-moccaccino-600'
  }
}

/**
 * Obtenir le label de rareté en français
 */
function getRarityLabel (rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common':
      return 'Commun'
    case 'rare':
      return 'Rare'
    case 'epic':
      return 'Épique'
    case 'legendary':
      return 'Légendaire'
  }
}

/**
 * Obtenir le label de catégorie en français
 */
function getCategoryLabel (category: string): string {
  switch (category) {
    case 'hat':
      return 'Chapeau'
    case 'glasses':
      return 'Lunettes'
    case 'shoes':
      return 'Chaussures'
    case 'background':
      return 'Arrière-plan'
    case 'effect':
      return 'Effet'
    default:
      return category
  }
}

/**
 * Carte d'affichage d'un accessoire
 *
 * Responsabilité unique : afficher les informations visuelles
 * et textuelles d'un accessoire dans un format carte.
 *
 * Applique SRP en déléguant :
 * - Le calcul des couleurs à getRarityColor
 * - Le formatage des labels à getRarityLabel et getCategoryLabel
 *
 * @param {AccessoryCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte d'accessoire interactive
 *
 * @example
 * <AccessoryCard
 *   accessory={accessory}
 *   onPurchase={(id) => handlePurchase(id)}
 *   isOwned={false}
 * />
 */
export function AccessoryCard ({
  accessory,
  onPurchase,
  isOwned = false
}: AccessoryCardProps): React.ReactNode {
  const rarityColor = getRarityColor(accessory.rarity)
  const rarityLabel = getRarityLabel(accessory.rarity)
  const categoryLabel = getCategoryLabel(accessory.category)

  const handleClick = (): void => {
    if (!isOwned && onPurchase !== undefined) {
      onPurchase(accessory.id)
    }
  }

  return (
    <article
      className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-white to-lochinvar-50/70 p-6 shadow-[0_20px_54px_rgba(15,23,42,0.14)] ring-1 ring-white/70 backdrop-blur transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.18)]'
    >
      {/* Bulles décoratives */}
      <div
        className='pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-fuchsia-blue-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-60'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-lochinvar-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-60'
        aria-hidden='true'
      />

      <div className='relative flex flex-col gap-5'>
        {/* Zone d'affichage de l'icône */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50/70 p-8 ring-1 ring-white/70'>
          <span className='text-6xl' aria-label={accessory.name}>
            {accessory.icon}
          </span>

          {/* Badge de rareté */}
          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-inner ${rarityColor}`}
          >
            {rarityLabel}
          </span>

          {/* Badge possédé */}
          {isOwned && (
            <span className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-600 shadow-inner'>
              ✓ Possédé
            </span>
          )}
        </div>

        {/* Informations textuelles */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-start justify-between gap-3'>
              <h3 className='text-lg font-semibold text-slate-900 sm:text-xl'>{accessory.name}</h3>
              <span className='inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-600 shadow-inner'>
                <TomatokenIcon size='xs' />
                {accessory.price}
              </span>
            </div>

            <p className='text-sm text-slate-600'>{accessory.description}</p>

            <div className='flex flex-wrap gap-2'>
              <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600'>
                {categoryLabel}
              </span>
              {accessory.effect !== undefined && (
                <span className='inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs text-purple-600'>
                  <span aria-hidden='true'>✨</span>
                  {accessory.effect}
                </span>
              )}
            </div>
          </div>

          {/* Bouton d'achat */}
          {!isOwned && onPurchase !== undefined && (
            <button
              onClick={handleClick}
              className='mt-2 w-full rounded-xl bg-gradient-to-r from-moccaccino-500 to-moccaccino-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-moccaccino-600 hover:to-moccaccino-700 hover:shadow-xl active:scale-95'
            >
              Acheter
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

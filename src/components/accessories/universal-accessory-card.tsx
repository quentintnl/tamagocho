/**
 * Universal Accessory Card Component
 *
 * Presentation Layer: Display any accessory with SVG rendering
 *
 * Responsibilities:
 * - Display accessory information
 * - Render SVG when available, fallback to icon
 * - Handle purchase interaction
 *
 * Clean Architecture: Pure presentation component
 */

'use client'

import type { Accessory, AccessoryRarity } from '@/types/accessory'
import { generateAccessoryById, hasAccessorySVGSupport } from '@/services/accessories/accessory-generator'

/**
 * Props pour le composant UniversalAccessoryCard
 */
interface UniversalAccessoryCardProps {
  /** Accessoire à afficher */
  accessory: Accessory
  /** Callback lors de l'achat */
  onPurchase?: (accessoryId: string) => void
  /** Indique si l'accessoire est déjà possédé */
  isOwned?: boolean
}

/**
 * Obtenir la couleur de badge selon la rareté - thème nature
 */
function getRarityColor (rarity: AccessoryRarity): string {
  switch (rarity) {
    case 'common':
      return 'bg-earth-100/80 text-earth-700'
    case 'rare':
      return 'bg-sky-100/80 text-sky-700'
    case 'epic':
      return 'bg-lavender-100/80 text-lavender-700'
    case 'legendary':
      return 'bg-sunset-100/80 text-sunset-700'
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
 * Carte d'affichage universelle d'un accessoire
 *
 * Responsabilité unique : afficher n'importe quel accessoire
 * avec détection automatique du support SVG
 *
 * Applique SRP en déléguant :
 * - Le calcul des couleurs à getRarityColor
 * - Le formatage des labels à getRarityLabel et getCategoryLabel
 * - La génération SVG au service accessory-generator
 * - La détection de support à hasAccessorySVGSupport
 *
 * @param {UniversalAccessoryCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte d'accessoire interactive
 *
 * @example
 * <UniversalAccessoryCard
 *   accessory={accessory}
 *   onPurchase={(id) => handlePurchase(id)}
 *   isOwned={false}
 * />
 */
export function UniversalAccessoryCard ({
  accessory,
  onPurchase,
  isOwned = false
}: UniversalAccessoryCardProps): React.ReactNode {
  const rarityColor = getRarityColor(accessory.rarity)
  const rarityLabel = getRarityLabel(accessory.rarity)
  const categoryLabel = getCategoryLabel(accessory.category)

  // Vérifier si l'accessoire a un support SVG
  const hasSVGSupport = hasAccessorySVGSupport(accessory.id)
  const svgContent = hasSVGSupport ? generateAccessoryById(accessory.id) : null

  const handleClick = (): void => {
    if (!isOwned && onPurchase !== undefined) {
      onPurchase(accessory.id)
    }
  }

  return (
    <article
      className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white to-meadow-50/60 p-6 shadow-[0_20px_54px_rgba(22,101,52,0.12)] ring-2 ring-meadow-200/60 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(22,101,52,0.18)] hover:ring-meadow-300/70'
    >
      {/* Bulles décoratives - thème nature */}
      <div
        className='pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-lavender-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-70'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-sky-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-70'
        aria-hidden='true'
      />

      <div className='relative flex flex-col gap-5'>
        {/* Zone d'affichage SVG ou Icon */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50 to-sky-50 p-8 ring-1 ring-meadow-200/50 shadow-inner'>
          {hasSVGSupport && svgContent !== null ? (
            // Affichage SVG
            <div
              className='w-32 h-32 transition-transform duration-300 group-hover:scale-110'
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            // Fallback sur emoji
            <span className='text-6xl transition-transform duration-300 group-hover:scale-110' aria-label={accessory.name}>
              {accessory.icon}
            </span>
          )}

          {/* Badge de rareté */}
          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-md ${rarityColor}`}
          >
            {rarityLabel}
          </span>

          {/* Badge possédé */}
          {isOwned && (
            <span className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-meadow-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-meadow-700 shadow-md'>
              ✓ Possédé
            </span>
          )}
        </div>

        {/* Informations textuelles */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-start justify-between gap-3'>
              <h3 className='text-lg font-semibold text-forest-800 sm:text-xl'>{accessory.name}</h3>
              <span className='inline-flex items-center gap-1 rounded-full bg-sunset-100/80 px-3 py-1 text-xs font-semibold text-sunset-700 shadow-inner'>
                <span aria-hidden='true'>💰</span>
                {accessory.price}
              </span>
            </div>

            <p className='text-sm text-forest-600 leading-relaxed'>{accessory.description}</p>

            <div className='flex flex-wrap gap-2'>
              <span className='inline-flex items-center gap-1 rounded-full bg-earth-100 px-2.5 py-1 text-xs text-earth-700 font-medium'>
                {categoryLabel}
              </span>
              {accessory.effect !== undefined && (
                <span className='inline-flex items-center gap-1 rounded-full bg-lavender-100 px-2.5 py-1 text-xs text-lavender-700 font-medium'>
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
              className='mt-2 w-full rounded-2xl bg-gradient-to-r from-meadow-500 to-forest-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-meadow-600 hover:to-forest-600 hover:shadow-xl active:scale-95'
            >
              🌿 Acheter
            </button>
          )}
        </div>
      </div>
    </article>
  )
}


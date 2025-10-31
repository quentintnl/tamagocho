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
import TomatokenIcon from '@/components/tomatoken-icon'

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
      className='group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/30 to-meadow-50/40 p-6 shadow-xl border-4 border-white/90 backdrop-blur transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-meadow-200/80 hover:scale-[1.02]'
    >
      {/* Motifs décoratifs animés - thème nature */}
      <div
        className='pointer-events-none absolute -right-12 top-16 h-32 w-32 rounded-full bg-gradient-to-br from-lavender-200/40 to-sky-200/30 blur-2xl transition-all duration-500 group-hover:opacity-80 group-hover:scale-110'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-tr from-sunset-200/30 to-gold-200/20 blur-2xl transition-all duration-500 group-hover:opacity-80 group-hover:scale-110'
        aria-hidden='true'
      />

      <div className='relative flex flex-col gap-5'>
        {/* Zone d'affichage SVG ou Icon avec effet de relief */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50 via-white to-sky-50 p-8 border-3 border-meadow-200/50 shadow-inner group-hover:shadow-lg transition-all'>
          {/* Petit effet de brillance */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          {hasSVGSupport && svgContent !== null ? (
            // Affichage SVG
            <div
              className='relative w-32 h-32 transition-transform duration-300 group-hover:scale-110'
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            // Fallback sur emoji
            <span className='relative text-6xl transition-transform duration-300 group-hover:scale-110' aria-label={accessory.name}>
              {accessory.icon}
            </span>
          )}

          {/* Badge de rareté */}
          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wide shadow-lg border-2 border-white/60 ${rarityColor}`}
          >
            {rarityLabel}
          </span>

          {/* Badge possédé */}
          {isOwned && (
            <span className='absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-meadow-400 to-forest-500 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-lg border-2 border-white/60'>
              <span className='text-sm'>✓</span> Possédé
            </span>
          )}
        </div>

        {/* Informations textuelles avec meilleur contraste */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex flex-col gap-3'>
            {/* Nom et prix */}
            <div className='flex items-start justify-between gap-3'>
              <h3 className='flex-1 text-xl font-black text-forest-800 leading-tight group-hover:text-meadow-700 transition-colors'>{accessory.name}</h3>
              <span className='flex-shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-gold-400 to-sunset-500 px-4 py-2 text-sm font-black text-white shadow-lg border-2 border-white/60 group-hover:scale-110 transition-transform'>
                <TomatokenIcon size='sm' />
                {accessory.price}
              </span>
            </div>

            {/* Description */}
            <p className='text-sm text-forest-600 font-medium leading-relaxed'>{accessory.description}</p>

            {/* Tags */}
            <div className='flex flex-wrap gap-2'>
              <span className='inline-flex items-center gap-1 rounded-xl bg-earth-100 border-2 border-earth-200/60 px-3 py-1.5 text-xs text-earth-700 font-bold'>
                {categoryLabel}
              </span>
              {accessory.effect !== undefined && (
                <span className='inline-flex items-center gap-1 rounded-xl bg-lavender-100 border-2 border-lavender-200/60 px-3 py-1.5 text-xs text-lavender-700 font-bold'>
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
              className='mt-2 w-full rounded-2xl bg-gradient-to-r from-meadow-500 to-forest-500 px-4 py-3 text-sm font-black text-white shadow-lg transition-all duration-300 hover:from-meadow-600 hover:to-forest-600 hover:shadow-xl active:scale-95 border-2 border-white/20'
            >
              <span className='mr-2'>🛒</span>
              Acheter
            </button>
          )}
        </div>
      </div>

      {/* Effet de lueur au survol */}
      <div className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-meadow-100/20 via-transparent to-transparent' />
    </article>
  )
}


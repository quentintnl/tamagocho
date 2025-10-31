/**
 * Shop Section Header - En-tête de section de la boutique
 *
 * Composant réutilisable pour afficher l'en-tête d'une section
 */

interface ShopSectionHeaderProps {
  title: string | null
  subtitle: string | null
}

/**
 * Composant pour afficher l'en-tête d'une section
 *
 * @param {ShopSectionHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête de section
 */
export function ShopSectionHeader ({ title, subtitle }: ShopSectionHeaderProps): React.ReactNode {
  return (
    <div className='mb-6 flex items-center justify-between'>
      <div>
        {title === null
          ? <div className='h-8 bg-gradient-to-r from-meadow-200/50 to-forest-200/50 rounded-xl w-48 mb-2 animate-pulse' />
          : <h2 className='text-3xl font-black text-forest-800'>{title}</h2>}

        {subtitle === null
          ? <div className='h-4 bg-forest-200/50 rounded-lg w-64 mt-2 animate-pulse' />
          : <p className='mt-2 text-sm font-medium text-forest-600'>{subtitle}</p>}
      </div>
    </div>
  )
}


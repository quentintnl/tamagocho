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
    <div className='mb-6'>
      {title === null
        ? <div className='h-8 bg-gray-300 rounded w-48 mb-2 animate-pulse' />
        : <h2 className='text-2xl font-semibold text-forest-800'>{title}</h2>}

      {subtitle === null
        ? <div className='h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse' />
        : <p className='mt-2 text-sm text-forest-600'>{subtitle}</p>}
    </div>
  )
}


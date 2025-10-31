/**
 * GalleryPagination
 *
 * Presentation Layer: Contrôles de pagination pour la galerie
 *
 * Responsabilités:
 * - Afficher les informations de pagination
 * - Permettre la navigation entre les pages
 * - Désactiver les boutons appropriés en début/fin
 *
 * Single Responsibility: Gérer l'interface de pagination
 */

'use client'

/**
 * Props pour le composant GalleryPagination
 */
interface GalleryPaginationProps {
  /** Page actuelle */
  currentPage: number
  /** Nombre total de pages */
  totalPages: number
  /** Nombre total d'éléments */
  totalCount: number
  /** Y a-t-il une page suivante ? */
  hasNextPage: boolean
  /** Y a-t-il une page précédente ? */
  hasPreviousPage: boolean
  /** Callback pour le changement de page */
  onPageChange: (page: number) => void
}

/**
 * Composant de pagination pour la galerie communautaire
 *
 * Affiche les contrôles de navigation entre les pages et
 * les informations sur le nombre total de résultats.
 *
 * Applique les principes SOLID:
 * - SRP: Gère uniquement la pagination
 * - OCP: Extensible pour différents styles de pagination
 *
 * @param {GalleryPaginationProps} props - Props du composant
 * @returns {React.ReactNode} Contrôles de pagination
 *
 * @example
 * <GalleryPagination
 *   currentPage={1}
 *   totalPages={5}
 *   totalCount={60}
 *   hasNextPage={true}
 *   hasPreviousPage={false}
 *   onPageChange={handlePageChange}
 * />
 */
export function GalleryPagination ({
  currentPage,
  totalPages,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onPageChange
}: GalleryPaginationProps): React.ReactNode {
  // Ne rien afficher s'il n'y a qu'une seule page
  if (totalPages <= 1) {
    return null
  }

  /**
   * Génère un tableau de numéros de pages à afficher
   */
  const getPageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(1, currentPage - halfRange)
    let endPage = Math.min(totalPages, currentPage + halfRange)

    // Ajuster si on est près du début ou de la fin
    if (currentPage <= halfRange) {
      endPage = Math.min(totalPages, maxPagesToShow)
    } else if (currentPage >= totalPages - halfRange) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1)
    }

    // Ajouter la première page et l'ellipse si nécessaire
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Ajouter les pages du milieu
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Ajouter l'ellipse et la dernière page si nécessaire
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className='mt-12 flex flex-col items-center gap-6'>
      {/* Informations sur les résultats */}
      <p className='text-sm text-gray-600'>
        Affichage de la page <span className='font-semibold text-gray-900'>{currentPage}</span> sur{' '}
        <span className='font-semibold text-gray-900'>{totalPages}</span>
        {' '}({totalCount} monstre{totalCount > 1 ? 's' : ''} au total)
      </p>

      {/* Contrôles de navigation */}
      <nav className='flex items-center gap-2' aria-label='Pagination'>
        {/* Bouton Précédent */}
        <button
          onClick={() => { onPageChange(currentPage - 1) }}
          disabled={!hasPreviousPage}
          className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 transition-all hover:bg-lochinvar-50 hover:ring-lochinvar-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:ring-gray-200'
          aria-label='Page précédente'
        >
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Précédent
        </button>

        {/* Numéros de pages */}
        <div className='flex items-center gap-1'>
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-3 py-2 text-gray-500'
                >
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            const isActive = pageNumber === currentPage

            return (
              <button
                key={pageNumber}
                onClick={() => { onPageChange(pageNumber) }}
                className={`
                  min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-lochinvar-500 text-white shadow-md ring-2 ring-lochinvar-300'
                    : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-lochinvar-50 hover:ring-lochinvar-300'
                  }
                `}
                aria-label={`Page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => { onPageChange(currentPage + 1) }}
          disabled={!hasNextPage}
          className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 transition-all hover:bg-lochinvar-50 hover:ring-lochinvar-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:ring-gray-200'
          aria-label='Page suivante'
        >
          Suivant
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </nav>
    </div>
  )
}

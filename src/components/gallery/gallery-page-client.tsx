/**
 * GalleryPageClient
 *
 * Presentation Layer: Page client de la galerie communautaire
 *
 * Responsabilités:
 * - Gérer l'état des filtres et de la pagination
 * - Charger les monstres publics selon les filtres
 * - Afficher la grille de monstres ou un état vide
 * - Gérer les états de chargement
 *
 * Single Responsibility: Orchestrer l'affichage de la galerie communautaire
 */

'use client'

import { useState, useTransition } from 'react'
import { getPublicMonsters, type GalleryFilters, type GalleryResult } from '@/actions/monsters.actions'
import { GalleryFilters as GalleryFiltersComponent } from './gallery-filters'
import { PublicMonsterCard } from './public-monster-card'
import { GalleryPagination } from './gallery-pagination'

/**
 * Props pour le composant GalleryPageClient
 */
interface GalleryPageClientProps {
  /** Données initiales de la galerie */
  initialData: GalleryResult
}

/**
 * Composant client de la page galerie communautaire
 *
 * Gère l'état des filtres, la pagination et le chargement
 * des monstres publics depuis le serveur.
 *
 * Applique les principes SOLID:
 * - SRP: Orchestration de la galerie uniquement
 * - DIP: Dépend des abstractions (actions serveur)
 *
 * @param {GalleryPageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de la galerie
 *
 * @example
 * <GalleryPageClient initialData={galleryData} />
 */
export function GalleryPageClient ({ initialData }: GalleryPageClientProps): React.ReactNode {
  const [data, setData] = useState<GalleryResult>(initialData)
  const [isPending, startTransition] = useTransition()

  // État des filtres
  const [filters, setFilters] = useState<GalleryFilters>({
    level: undefined,
    state: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // État de la pagination
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * Charge les monstres en fonction des filtres et de la page
   */
  const loadMonsters = async (page: number, newFilters: GalleryFilters): Promise<void> => {
    const result = await getPublicMonsters(newFilters, { page, limit: 12 })
    setData(result)
  }

  /**
   * Gère le changement de filtres
   */
  const handleFiltersChange = (newFilters: {
    level: number | null
    state: string
    sortBy: 'createdAt' | 'level' | 'name'
    sortOrder: 'asc' | 'desc'
  }): void => {
    const updatedFilters: GalleryFilters = {
      level: newFilters.level ?? undefined,
      state: newFilters.state,
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder
    }

    setFilters(updatedFilters)
    setCurrentPage(1) // Retour à la page 1 lors d'un changement de filtre

    startTransition(() => {
      void loadMonsters(1, updatedFilters)
    })
  }

  /**
   * Gère le changement de page
   */
  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
    startTransition(() => {
      void loadMonsters(page, filters)
    })

    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='space-y-8'>
      {/* Filtres */}
      <GalleryFiltersComponent
        selectedLevel={filters.level ?? null}
        selectedState={filters.state ?? ''}
        sortBy={filters.sortBy ?? 'createdAt'}
        sortOrder={filters.sortOrder ?? 'desc'}
        onFiltersChange={handleFiltersChange}
      />

      {/* Indicateur de chargement */}
      {isPending && (
        <div className='flex justify-center py-12'>
          <div className='flex items-center gap-3 text-lochinvar-600'>
            <svg
              className='h-6 w-6 animate-spin'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            <span className='font-medium'>Chargement...</span>
          </div>
        </div>
      )}

      {/* Grille de monstres ou état vide */}
      {!isPending && data.monsters.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 px-4'>
          <div className='text-center max-w-md'>
            <div className='text-6xl mb-4'>🔍</div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
              Aucun monstre trouvé
            </h3>
            <p className='text-gray-600 mb-6'>
              Aucun monstre public ne correspond à vos critères de recherche.
              Essayez de modifier les filtres ou réinitialisez-les.
            </p>
          </div>
        </div>
      ) : (
        <>
          {!isPending && (
            <>
              {/* Grille de monstres */}
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {data.monsters.map((monster) => (
                  <PublicMonsterCard
                    key={monster._id}
                    monster={monster}
                  />
                ))}
              </div>

              {/* Pagination */}
              <GalleryPagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                totalCount={data.totalCount}
                hasNextPage={data.hasNextPage}
                hasPreviousPage={data.hasPreviousPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}


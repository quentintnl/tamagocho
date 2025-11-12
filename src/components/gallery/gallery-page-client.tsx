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
import { getPublicMonsters, type GalleryFilters, type GalleryResult } from '@/actions/monsters'
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

  console.log('[GalleryPageClient] Initial data:', initialData)
  console.log('[GalleryPageClient] Current data state:', data)
  console.log('[GalleryPageClient] Monsters count:', data.monsters.length)

  // État des filtres
  const [filters, setFilters] = useState<GalleryFilters>({
    level: undefined,
    state: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

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

    startTransition(() => {
      void loadMonsters(1, updatedFilters)
    })
  }

  /**
   * Gère le changement de page
   */
  const handlePageChange = (page: number): void => {
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
          <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-100 p-8 shadow-xl border-4 border-white/80'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-lg animate-spin' style={{ animationDuration: '2s' }}>
                <svg
                  className='h-8 w-8 text-white'
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
              </div>
              <div>
                <p className='text-lg font-black text-forest-800'>Chargement en cours...</p>
                <p className='text-sm text-forest-600'>Recherche de nouvelles créatures</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grille de monstres ou état vide */}
      {!isPending && data.monsters.length === 0 ? (
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-sky-100 p-10 sm:p-12 text-center shadow-2xl border-4 border-white/90'>
          {/* Motifs décoratifs de fond */}
          <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-lavender-300/40 to-fuchsia-blue-300/30 blur-2xl' aria-hidden='true' />
          <div className='absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-meadow-300/30 to-sky-300/20 blur-2xl' aria-hidden='true' />

          <div className='relative space-y-6'>
            {/* Grosse icône centrale */}
            <div className='flex justify-center'>
              <div className='relative'>
                <div className='flex items-center justify-center h-32 w-32 rounded-3xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-2xl border-4 border-white text-6xl animate-bounce' style={{ animationDuration: '2s' }}>
                  🔍
                </div>
                {/* Petites étoiles autour */}
                <div className='absolute -top-2 -right-2 text-2xl animate-pulse'>✨</div>
                <div className='absolute -bottom-2 -left-2 text-2xl animate-pulse' style={{ animationDelay: '0.5s' }}>💫</div>
              </div>
            </div>

            {/* Titre accrocheur */}
            <div className='space-y-3'>
              <h3 className='text-3xl sm:text-4xl font-black text-forest-800 leading-tight'>
                Aucune Créature Trouvée !
              </h3>
              <p className='text-lg text-forest-600 leading-relaxed max-w-md mx-auto'>
                Aucun petit monstre ne correspond à tes critères de recherche. Essaie de modifier les filtres ou réinitialise-les.
              </p>
            </div>

            {/* Message encourageant */}
            <div className='pt-4'>
              <p className='text-sm font-medium text-forest-500 italic'>
                "Chaque créature est unique, explore toutes les possibilités ! 🌈"
              </p>
            </div>
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

/**
 * GalleryFilters
 *
 * Presentation Layer: Filtres pour la galerie communautaire
 *
 * Responsabilités:
 * - Afficher les options de filtrage (niveau, état, tri)
 * - Gérer les changements de filtres
 * - Appliquer les filtres sélectionnés
 *
 * Single Responsibility: Gérer l'interface des filtres de la galerie
 */

'use client'

/**
 * Props pour le composant GalleryFilters
 */
interface GalleryFiltersProps {
  /** Niveau sélectionné */
  selectedLevel: number | null
  /** État sélectionné */
  selectedState: string
  /** Critère de tri */
  sortBy: 'createdAt' | 'level' | 'name'
  /** Ordre de tri */
  sortOrder: 'asc' | 'desc'
  /** Callback pour les changements de filtres */
  onFiltersChange: (filters: {
    level: number | null
    state: string
    sortBy: 'createdAt' | 'level' | 'name'
    sortOrder: 'asc' | 'desc'
  }) => void
}

/**
 * Composant de filtres pour la galerie communautaire
 *
 * Permet de filtrer les monstres publics par niveau, état et ordre de tri.
 *
 * Applique les principes SOLID:
 * - SRP: Gère uniquement les filtres de la galerie
 * - OCP: Extensible pour ajouter de nouveaux filtres
 *
 * @param {GalleryFiltersProps} props - Props du composant
 * @returns {React.ReactNode} Interface des filtres
 *
 * @example
 * <GalleryFilters
 *   selectedLevel={null}
 *   selectedState=""
 *   sortBy="createdAt"
 *   sortOrder="desc"
 *   onFiltersChange={handleFiltersChange}
 * />
 */
export function GalleryFilters ({
  selectedLevel,
  selectedState,
  sortBy,
  sortOrder,
  onFiltersChange
}: GalleryFiltersProps): React.ReactNode {
  /**
   * Gestionnaire de changement de niveau
   */
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const level = e.target.value === '' ? null : Number(e.target.value)
    onFiltersChange({ level, state: selectedState, sortBy, sortOrder })
  }

  /**
   * Gestionnaire de changement d'état
   */
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onFiltersChange({ level: selectedLevel, state: e.target.value, sortBy, sortOrder })
  }

  /**
   * Gestionnaire de changement de tri
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onFiltersChange({
      level: selectedLevel,
      state: selectedState,
      sortBy: e.target.value as 'createdAt' | 'level' | 'name',
      sortOrder
    })
  }

  /**
   * Gestionnaire de changement d'ordre de tri
   */
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onFiltersChange({
      level: selectedLevel,
      state: selectedState,
      sortBy,
      sortOrder: e.target.value as 'asc' | 'desc'
    })
  }

  /**
   * Réinitialise tous les filtres
   */
  const handleReset = (): void => {
    onFiltersChange({ level: null, state: '', sortBy: 'createdAt', sortOrder: 'desc' })
  }

  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-lavender-50/30 to-fuchsia-blue-50/30 p-6 shadow-xl border-4 border-white/90'>
      {/* Motif décoratif de fond */}
      <div className='absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-lavender-200/30 to-fuchsia-blue-200/20 blur-2xl' aria-hidden='true' />

      <div className='relative flex flex-col gap-6'>
        {/* En-tête */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-md text-xl border-2 border-white/80'>
              🔍
            </div>
            <h3 className='text-xl font-black text-forest-800'>
              Filtres de Recherche
            </h3>
          </div>
          <button
            onClick={handleReset}
            className='px-4 py-2 text-sm text-white font-bold bg-gradient-to-r from-sunset-400 to-gold-500 hover:from-sunset-500 hover:to-gold-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-white/60'
          >
            Réinitialiser
          </button>
        </div>

        {/* Grille de filtres */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Filtre par niveau */}
          <div className='space-y-2'>
            <label htmlFor='level-filter' className='flex items-center gap-2 text-sm font-bold text-forest-700'>
              <span className='text-base'>⭐</span>
              Niveau
            </label>
            <select
              id='level-filter'
              value={selectedLevel ?? ''}
              onChange={handleLevelChange}
              className='w-full rounded-xl border-2 border-lavender-200 bg-white px-4 py-2.5 text-forest-800 font-medium shadow-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-300 transition-all hover:border-lavender-300'
            >
              <option value=''>Tous les niveaux</option>
              <option value='1'>⭐ Niveau 1</option>
              <option value='2'>⭐ Niveau 2</option>
              <option value='3'>⭐ Niveau 3</option>
              <option value='4'>⭐ Niveau 4</option>
              <option value='5'>⭐ Niveau 5</option>
            </select>
          </div>

          {/* Filtre par état */}
          <div className='space-y-2'>
            <label htmlFor='state-filter' className='flex items-center gap-2 text-sm font-bold text-forest-700'>
              <span className='text-base'>😊</span>
              Humeur
            </label>
            <select
              id='state-filter'
              value={selectedState}
              onChange={handleStateChange}
              className='w-full rounded-xl border-2 border-lavender-200 bg-white px-4 py-2.5 text-forest-800 font-medium shadow-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-300 transition-all hover:border-lavender-300'
            >
              <option value=''>Toutes les humeurs</option>
              <option value='happy'>😊 Heureux</option>
              <option value='sad'>😢 Triste</option>
              <option value='angry'>😠 En colère</option>
              <option value='hungry'>😋 Affamé</option>
              <option value='sleepy'>😴 Endormi</option>
            </select>
          </div>

          {/* Tri par */}
          <div className='space-y-2'>
            <label htmlFor='sort-filter' className='flex items-center gap-2 text-sm font-bold text-forest-700'>
              <span className='text-base'>📊</span>
              Trier par
            </label>
            <select
              id='sort-filter'
              value={sortBy}
              onChange={handleSortChange}
              className='w-full rounded-xl border-2 border-lavender-200 bg-white px-4 py-2.5 text-forest-800 font-medium shadow-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-300 transition-all hover:border-lavender-300'
            >
              <option value='createdAt'>📅 Date de création</option>
              <option value='level'>⭐ Niveau</option>
              <option value='name'>🔤 Nom</option>
            </select>
          </div>

          {/* Ordre de tri */}
          <div className='space-y-2'>
            <label htmlFor='sort-order-filter' className='flex items-center gap-2 text-sm font-bold text-forest-700'>
              <span className='text-base'>🔄</span>
              Ordre
            </label>
            <select
              id='sort-order-filter'
              value={sortOrder}
              onChange={handleSortOrderChange}
              className='w-full rounded-xl border-2 border-lavender-200 bg-white px-4 py-2.5 text-forest-800 font-medium shadow-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-300 transition-all hover:border-lavender-300'
            >
              <option value='desc'>⬇️ Décroissant</option>
              <option value='asc'>⬆️ Croissant</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

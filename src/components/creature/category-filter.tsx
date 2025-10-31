/**
 * CategoryFilter Component
 *
 * Presentation Layer: Filtre de catégories pour la boutique d'accessoires
 *
 * Responsabilités:
 * - Afficher les boutons de filtre de catégories
 * - Gérer la sélection de la catégorie active
 * - Fournir un retour visuel sur la catégorie sélectionnée
 *
 * Single Responsibility Principle: Affichage et gestion du filtre uniquement
 * Open/Closed Principle: Extensible via la liste de catégories
 *
 * @module components/creature/category-filter
 */

import type React from 'react'

/**
 * Option de catégorie pour le filtre
 */
interface CategoryOption {
  value: 'all' | 'accessories' | 'backgrounds'
  label: string
  icon: string
}

/**
 * Props pour le composant CategoryFilter
 */
interface CategoryFilterProps {
  /** Catégorie actuellement sélectionnée */
  selectedCategory: 'all' | 'accessories' | 'backgrounds'
  /** Callback appelé lors du changement de catégorie */
  onCategoryChange: (category: 'all' | 'accessories' | 'backgrounds') => void
  /** Liste des catégories disponibles */
  categories: CategoryOption[]
  /** Compteurs optionnels pour chaque catégorie */
  counts?: Record<'all' | 'accessories' | 'backgrounds', number>
}

/**
 * Composant de filtre de catégories
 *
 * Affiche une liste de boutons pour filtrer les accessoires par catégorie.
 * Respecte le principe de responsabilité unique en ne gérant que l'affichage du filtre.
 *
 * @param {CategoryFilterProps} props - Props du composant
 * @returns {React.ReactNode} Barre de filtres de catégories
 *
 * @example
 * <CategoryFilter
 *   selectedCategory="hat"
 *   onCategoryChange={handleCategoryChange}
 *   categories={CATEGORIES}
 * />
 */
export function CategoryFilter ({
  selectedCategory,
  onCategoryChange,
  categories,
  counts
}: CategoryFilterProps): React.ReactNode {
  return (
    <div className='mb-6'>
      <div className='flex flex-wrap gap-2 justify-center'>
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === category.value
                ? 'bg-moccaccino-500 text-white shadow-md scale-105'
                : 'bg-lochinvar-100 text-lochinvar-700 hover:bg-lochinvar-200'
            }`}
            aria-pressed={selectedCategory === category.value}
          >
            <div className='flex items-center gap-2'>
              <span aria-hidden='true'>{category.icon}</span>
              <span>{category.label}</span>
              {counts !== undefined && (
                <span
                  className={`
                    inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
                    ${
                      selectedCategory === category.value
                        ? 'bg-white/20 text-white'
                        : 'bg-lochinvar-200 text-lochinvar-800'
                    }
                  `}
                >
                  {counts[category.value]}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

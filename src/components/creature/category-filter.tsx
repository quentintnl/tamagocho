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
import type { AccessoryCategory } from '@/types/accessory'

/**
 * Option de catégorie pour le filtre
 */
interface CategoryOption {
  value: AccessoryCategory | 'all'
  label: string
  icon: string
}

/**
 * Props pour le composant CategoryFilter
 */
interface CategoryFilterProps {
  /** Catégorie actuellement sélectionnée */
  selectedCategory: AccessoryCategory | 'all'
  /** Callback appelé lors du changement de catégorie */
  onCategoryChange: (category: AccessoryCategory | 'all') => void
  /** Liste des catégories disponibles */
  categories: CategoryOption[]
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
  categories
}: CategoryFilterProps): React.ReactNode {
  return (
    <div className='mb-6'>
      <div className='flex flex-wrap gap-2'>
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
            <span className='mr-1' aria-hidden='true'>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}


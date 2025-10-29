/**
 * AccessoriesGrid Component
 *
 * Presentation Layer: Grille d'affichage des accessoires possédés
 *
 * Responsabilités:
 * - Afficher une grille responsive d'accessoires
 * - Gérer l'état vide (aucun accessoire)
 * - Fournir un scroll pour les longues listes
 *
 * Single Responsibility Principle: Affichage de la grille uniquement
 * Open/Closed Principle: Extensible via les composants enfants
 *
 * @module components/creature/accessories-grid
 */

import type React from 'react'

/**
 * Props pour le composant AccessoriesGrid
 */
interface AccessoriesGridProps {
  /** Contenu à afficher dans la grille */
  children: React.ReactNode
  /** État de chargement */
  isLoading?: boolean
  /** Nombre d'accessoires */
  count?: number
}

/**
 * Composant de grille responsive pour les accessoires
 *
 * Gère l'affichage en grille avec scroll, l'état de chargement et l'état vide.
 * Délègue le rendu de chaque carte au composant parent.
 *
 * @param {AccessoriesGridProps} props - Props du composant
 * @returns {React.ReactNode} Grille d'accessoires ou état approprié
 *
 * @example
 * <AccessoriesGrid isLoading={false} count={5}>
 *   {accessories.map(acc => <AccessoryCard key={acc.id} {...acc} />)}
 * </AccessoriesGrid>
 */
export function AccessoriesGrid ({
  children,
  isLoading = false,
  count = 0
}: AccessoriesGridProps): React.ReactNode {
  // État de chargement
  if (isLoading) {
    return (
      <div className='text-center py-8 text-foreground/50'>
        <p>Chargement...</p>
      </div>
    )
  }

  // État vide (aucun accessoire)
  if (count === 0) {
    return (
      <div className='text-center py-8 text-foreground/50'>
        <p className='text-lg mb-2'>🎁 Vous n'avez pas encore d'accessoires</p>
        <p className='text-sm'>Achetez-en dans la boutique ci-dessous !</p>
      </div>
    )
  }

  // Grille avec scroll
  return (
    <div className='max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-fuchsia-blue-300 scrollbar-track-slate-100'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {children}
      </div>
    </div>
  )
}


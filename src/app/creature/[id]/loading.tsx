import { CreaturePageSkeleton } from '@/components/creature/creature-page-skeleton'

/**
 * État de chargement pour la page de détail d'une créature
 *
 * Utilise le composant réutilisable CreaturePageSkeleton pour éviter
 * la duplication de code CSS et maintenir la cohérence visuelle.
 *
 * @returns {React.ReactNode} Skeleton de la page de créature
 */
export default function Loading (): React.ReactNode {
  return <CreaturePageSkeleton />
}

/**
 * Quests Header - En-tête de la section quêtes
 *
 * Composant réutilisable pour afficher l'en-tête avec bouton actualiser
 */

import Button from '@/components/button'

interface QuestsHeaderProps {
  title: string | null
  onRefresh?: () => void
  isLoading?: boolean
}

/**
 * Composant pour afficher l'en-tête des quêtes
 *
 * @param {QuestsHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête des quêtes
 */
export function QuestsHeader ({ title, onRefresh, isLoading = false }: QuestsHeaderProps): React.ReactNode {
  return (
    <div className="flex items-center justify-between mb-4">
      {title === null
        ? <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        : <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}

      {onRefresh !== undefined && (
        <Button onClick={onRefresh} size="sm" variant="ghost" disabled={isLoading}>
          🔄 Actualiser
        </Button>
      )}
    </div>
  )
}


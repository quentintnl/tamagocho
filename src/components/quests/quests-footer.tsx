/**
 * Quests Footer - Footer informatif pour les quêtes
 *
 * Composant réutilisable pour afficher le footer avec support skeleton
 */

interface QuestsFooterProps {
  text: string | null
}

/**
 * Composant pour afficher le footer des quêtes
 *
 * @param {QuestsFooterProps} props - Props du composant
 * @returns {React.ReactNode} Footer des quêtes
 */
export function QuestsFooter ({ text }: QuestsFooterProps): React.ReactNode {
  return (
    <div className="text-center text-sm text-gray-500 mt-6">
      {text === null
        ? <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
        : <p>{text}</p>}
    </div>
  )
}

